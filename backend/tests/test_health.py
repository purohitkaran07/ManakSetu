from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["healthy", "degraded"]
    assert "database" in data
    assert data["database"]["standards_count"] >= 6
    assert data["model"]["name"] == "sentence-transformers/all-MiniLM-L6-v2"
    assert data["model"]["embedding_dim"] == 384
