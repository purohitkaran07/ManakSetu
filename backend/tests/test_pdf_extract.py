import io
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

SAMPLE_TEXT_PDF = b"""%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length 75 >> stream
BT
/F1 12 Tf
100 700 Td
(500 wall-mounted 25 litre electric storage water heaters for government hostels) Tj
ET
endstream endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000371 00000 n 
trailer << /Size 6 /Root 1 0 R >>
startxref
444
%%EOF"""

BLANK_PAGE_PDF = b"""%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >> endobj
xref
0 4
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
trailer << /Size 4 /Root 1 0 R >>
startxref
190
%%EOF"""


def test_extract_pdf_valid_text():
    files = {"file": ("tender_document.pdf", io.BytesIO(SAMPLE_TEXT_PDF), "application/pdf")}
    response = client.post("/api/extract-pdf", files=files)
    assert response.status_code == 200
    data = response.json()
    assert "text" in data
    assert "500 wall-mounted 25 litre electric storage water heaters" in data["text"]
    assert data["filename"] == "tender_document.pdf"
    assert data["pages_count"] == 1


def test_extract_pdf_empty_file():
    files = {"file": ("empty.pdf", io.BytesIO(b""), "application/pdf")}
    response = client.post("/api/extract-pdf", files=files)
    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()


def test_extract_pdf_invalid_format():
    files = {"file": ("corrupted.pdf", io.BytesIO(b"This is not a real PDF file content"), "application/pdf")}
    response = client.post("/api/extract-pdf", files=files)
    assert response.status_code == 400
    assert "invalid" in response.json()["detail"].lower() or "header" in response.json()["detail"].lower()


def test_extract_pdf_invalid_extension():
    files = {"file": ("tender.docx", io.BytesIO(b"dummy docx bytes"), "application/vnd.openxmlformats-officedocument.wordprocessingml.document")}
    response = client.post("/api/extract-pdf", files=files)
    assert response.status_code == 400
    assert "only pdf" in response.json()["detail"].lower()


def test_extract_pdf_no_selectable_text():
    files = {"file": ("scanned_blank.pdf", io.BytesIO(BLANK_PAGE_PDF), "application/pdf")}
    response = client.post("/api/extract-pdf", files=files)
    assert response.status_code == 400
    assert "no selectable text" in response.json()["detail"].lower()


def test_pdf_upload_to_analyze_e2e():
    """Verify that text extracted from a PDF feeds seamlessly into /api/analyze."""
    files = {"file": ("tender_document.pdf", io.BytesIO(SAMPLE_TEXT_PDF), "application/pdf")}
    extract_res = client.post("/api/extract-pdf", files=files)
    assert extract_res.status_code == 200
    extracted_text = extract_res.json()["text"]

    analyze_res = client.post("/api/analyze", json={"requirement": extracted_text, "llm_provider": "none"})
    assert analyze_res.status_code == 200
    analysis_data = analyze_res.json()

    assert analysis_data["structured_requirement"]["product"] == "Electric Storage Water Heater"
    assert analysis_data["structured_requirement"]["quantity"] == 500
    rec_nums = [r["standard"]["standard_number"] for r in analysis_data["recommendations"]]
    assert "IS 2082:2018" in rec_nums
    assert "IS 302 (Part 2/Sec 21):2024" in rec_nums

