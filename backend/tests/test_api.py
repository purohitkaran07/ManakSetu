from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_api_analyze_flow():
    payload = {
        "requirement": "We need to procure 500 wall-mounted 25 litre electric storage water heaters for government hostels.",
        "llm_provider": "none",
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert "structured_requirement" in data
    assert data["structured_requirement"]["product"] == "Electric Storage Water Heater"
    assert data["structured_requirement"]["quantity"] == 500
    assert len(data["recommendations"]) >= 2
    assert "version_alerts" in data


def test_api_standards_list_and_detail():
    list_res = client.get("/api/standards")
    assert list_res.status_code == 200
    standards = list_res.json()
    assert len(standards) >= 6

    # Test detail of first standard
    first_id = standards[0]["id"]
    detail_res = client.get(f"/api/standards/{first_id}")
    assert detail_res.status_code == 200
    detail = detail_res.json()
    assert detail["id"] == first_id
    assert "relationships" in detail


def test_api_graph():
    response = client.get("/api/graph")
    assert response.status_code == 200
    graph = response.json()
    assert "nodes" in graph
    assert "edges" in graph
    assert len(graph["nodes"]) >= 6
    assert len(graph["edges"]) >= 4

    # Central node check
    central_nodes = [n for n in graph["nodes"] if n["data"]["is_central"]]
    assert len(central_nodes) == 1
    assert central_nodes[0]["data"]["standard_number"] == "IS 2082:2018"


def test_api_history():
    response = client.get("/api/history")
    assert response.status_code == 200
    history = response.json()
    assert isinstance(history, list)
    assert len(history) >= 1  # From previous test analysis
