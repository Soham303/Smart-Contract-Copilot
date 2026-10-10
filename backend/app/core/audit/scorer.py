from typing import List, Dict, Any

SEVERITY_WEIGHTS = {
    "Critical": 30,
    "High": 15,
    "Medium": 7,
    "Low": 2,
    "Info": 0
}

def calculate_risk_score(findings: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Computes risk score (0-100) from weighted severities per PRD Section 17.
    score = max(0, 100 - sum(weight * count))
    Bands: 80-100 Low risk, 50-79 Moderate, below 50 High.
    """
    deduction = 0
    severity_counts = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0, "Info": 0}

    for finding in findings:
        sev = finding.get("severity", "Info")
        if sev in severity_counts:
            severity_counts[sev] += 1
            deduction += SEVERITY_WEIGHTS.get(sev, 0)

    score = max(0, 100 - deduction)

    if score >= 80:
        band = "Low"
    elif score >= 50:
        band = "Moderate"
    else:
        band = "High"

    return {
        "score": score,
        "band": band,
        "severityCounts": severity_counts
    }
