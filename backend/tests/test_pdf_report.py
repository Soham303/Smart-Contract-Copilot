import pytest
from app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_generate_and_download_pdf_report(client):
    payload = {
        "projectName": "SkyApesVesting",
        "audit": {
            "riskScore": 92,
            "riskBand": "Low",
            "findings": [
                {
                    "ruleId": "M101",
                    "severity": "Medium",
                    "title": "Unbounded loop risk",
                    "message": "Iteration count depends on vector length",
                    "fix": "Cap max iterations"
                }
            ]
        },
        "gas": {
            "entries": [
                {"function": "initialize", "gasUnits": 1200, "approximateApt": 0.000120},
                {"function": "release_vested", "gasUnits": 2500, "approximateApt": 0.000250}
            ]
        },
        "permissions": {
            "keyAnswers": {
                "whoCanMint": "Only AdminCapability holder",
                "whoCanWithdraw": "Beneficiary after cliff",
                "whoCanPause": "Emergency admin",
                "canSupplyGrow": "Capped at 1,000,000"
            },
            "matrix": [
                {"action": "mint", "actor": "AdminCapability", "details": "Exclusive capability minting"},
                {"action": "release", "actor": "Beneficiary", "details": "Linear unlock after cliff"}
            ]
        }
    }

    # 1. Generate Report
    gen_resp = client.post("/reports/generate", json=payload)
    assert gen_resp.status_code == 200
    data = gen_resp.get_json()
    assert "reportId" in data
    assert "downloadPdfUrl" in data
    report_id = data["reportId"]

    # 2. Download Binary PDF via GET /reports/{id}/pdf
    pdf_resp = client.get(f"/reports/{report_id}/pdf")
    assert pdf_resp.status_code == 200
    assert pdf_resp.mimetype == "application/pdf"
    assert pdf_resp.data.startswith(b"%PDF-")
    assert len(pdf_resp.data) > 1000

    # 3. Direct Binary PDF export via POST /reports/export-pdf
    export_resp = client.post("/reports/export-pdf", json=payload)
    assert export_resp.status_code == 200
    assert export_resp.mimetype == "application/pdf"
    assert export_resp.data.startswith(b"%PDF-")
