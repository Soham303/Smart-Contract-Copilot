from typing import List, Dict, Any

class GasAnalyzer:
    """Measures transaction gas units per entry function (PRD FR-9.1 - 9.3)."""

    def __init__(self, gas_unit_price: int = 100):
        self.gas_unit_price = gas_unit_price

    def analyze_function(self, function_name: str, gas_used: int = None) -> Dict[str, Any]:
        if gas_used is None:
            return {
                "function": function_name,
                "measured": False,
                "note": "Not measured: no scenario available"
            }

        cost_apt = (gas_used * self.gas_unit_price) / 10**8
        return {
            "function": function_name,
            "measured": True,
            "gasUnits": gas_used,
            "gasPrice": self.gas_unit_price,
            "approximateApt": cost_apt
        }
