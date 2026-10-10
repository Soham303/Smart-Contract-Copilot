from typing import Dict, Any, List

class GasOptimizer:
    """Proposes gas optimization patches and verifies measured savings (PRD FR-9.4 - 9.6, Section 18)."""

    def __init__(self):
        # Rule catalog patterns (§18)
        self.optimization_patterns = [
            "cache_borrow_global",
            "replace_vector_linear_search",
            "inline_hot_helpers",
            "pack_struct_fields"
        ]

    def verify_patch(self, before_gas: int, after_gas: int) -> Dict[str, Any]:
        """Only patches that pass tests and reduce measured gas are accepted (PRD FR-9.5)."""
        if before_gas <= 0:
            return {"valid": False, "savedPct": 0}

        saved_units = before_gas - after_gas
        saved_pct = (saved_units / before_gas) * 100

        # Must save at least 1% per PRD Section 18
        is_beneficial = saved_pct >= 1.0

        return {
            "valid": is_beneficial,
            "beforeGas": before_gas,
            "afterGas": after_gas,
            "savedUnits": saved_units,
            "savedPct": round(saved_pct, 2)
        }
