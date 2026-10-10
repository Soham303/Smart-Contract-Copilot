from typing import List, Dict, Any
from .rules.base import Finding, BaseAuditRule
from .scorer import calculate_risk_score

class AuditEngine:
    """Security audit engine executing rule-based static analysis (PRD FR-8.1 - 8.8)."""

    def __init__(self, rules: List[BaseAuditRule] = None):
        self.rules = rules or []

    def run_audit(self, code: str, graph: Dict[str, Any] = None) -> Dict[str, Any]:
        findings: List[Finding] = []
        for rule in self.rules:
            findings.extend(rule.check(code, graph))

        findings_dict = [f.model_dump() for f in findings]
        risk_metrics = calculate_risk_score(findings_dict)

        return {
            "disclaimer": "Automated analysis. Not a substitute for a professional audit.",
            "riskScore": risk_metrics["score"],
            "riskBand": risk_metrics["band"],
            "severityCounts": risk_metrics["severityCounts"],
            "findings": findings_dict
        }
