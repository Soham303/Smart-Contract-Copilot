from typing import Dict, Any, List
from .schema import ContractGraph

class GraphValidator:
    """Validates Contract Graph according to PRD FR-2.7."""

    def __init__(self, block_specs: Dict[str, Any] = None):
        self.block_specs = block_specs or {}

    def validate(self, graph_dict: Dict[str, Any]) -> Dict[str, Any]:
        errors = []
        warnings = []
        try:
            graph = ContractGraph(**graph_dict)
        except Exception as e:
            return {"valid": False, "errors": [str(e)], "warnings": []}

        # Check block specs, ports, missing required fields
        block_ids = {b.id for b in graph.blocks}
        for edge in graph.edges:
            if edge.from_ not in block_ids:
                errors.append(f"Edge references non-existent source block '{edge.from_}'")
            if edge.to not in block_ids:
                errors.append(f"Edge references non-existent destination block '{edge.to}'")

        return {
            "valid": len(errors) == 0,
            "errors": errors,
            "warnings": warnings,
            "graph": graph
        }
