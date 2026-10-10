from app.core.audit.scorer import calculate_risk_score

def test_risk_score_calculation():
    findings = [
        {"severity": "Critical"},
        {"severity": "High"}
    ]
    # Critical: -30, High: -15 => 100 - 45 = 55
    res = calculate_risk_score(findings)
    assert res["score"] == 55
    assert res["band"] == "Moderate"
