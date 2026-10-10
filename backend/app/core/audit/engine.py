from typing import List, Dict, Any, Optional
from .rules.base import Finding, BaseAuditRule
from .rules.rules_catalog import ALL_RULES
from .scorer import calculate_risk_score

class AuditEngine:
    """Security audit engine executing rule-based static analysis (PRD FR-8.1 - 8.8, Section 17)."""

    def __init__(self, rules: Optional[List[BaseAuditRule]] = None):
        self.rules = rules if rules is not None else ALL_RULES

    def run_audit(self, code: str, graph: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
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
            "findings": findings_dict,
            "rulesEvaluated": len(self.rules)
        }

audit_engine_instance = AuditEngine()
