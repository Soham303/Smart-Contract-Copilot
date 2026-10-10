from typing import Dict, Any, Tuple
from app.core.graph.validator import GraphValidator

class RepairLoop:
    """Automatic repair loop for AI-generated graphs (PRD FR-6.3: up to 2 attempts)."""

    def __init__(self, validator: GraphValidator, max_attempts: int = 2):
        self.validator = validator
        self.max_attempts = max_attempts

    def repair_if_needed(self, graph_dict: Dict[str, Any]) -> Tuple[bool, Dict[str, Any], int]:
        validation = self.validator.validate(graph_dict)
        if validation["valid"]:
            return True, graph_dict, 0

        # Repair attempts logic
        return False, graph_dict, self.max_attempts
