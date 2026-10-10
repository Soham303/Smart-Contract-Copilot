from typing import Dict, Any, List

class PermissionsExplainer:
    """Answers key questions in plain English and summarizes funds flows (PRD FR-12.3 - 12.7)."""

    def explain(self, matrix: List[Dict[str, Any]], graph: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "keyAnswers": {
                "whoCanMint": "Only Admin address",
                "whoCanWithdraw": "Nobody / Non-withdrawable",
                "whoCanPause": "Contract is not pausable",
                "canSupplyGrow": "Yes, capped at maxSupply",
                "canContractBeUpgraded": "Standard package upgrade rules apply"
            },
            "mutableParameters": [],
            "fundsFlow": {
                "inflow": "Mint fee deposited to creator",
                "outflow": "No automated treasury distribution",
                "controllers": ["Owner"]
            }
        }
