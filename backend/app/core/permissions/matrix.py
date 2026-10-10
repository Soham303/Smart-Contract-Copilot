from typing import Dict, Any, List

class PermissionsMatrixBuilder:
    """Deterministically derives the permissions matrix from the Contract Graph or code (PRD FR-12.1, 12.2).
    Rows: actions (entry functions).
    Columns: actors (Anyone, Owner/Admin, specific Role, Nobody/Disabled).
    """

    ACTORS = ["Anyone", "Owner/Admin", "Specific Role", "Nobody/Disabled"]

    def build_matrix(self, graph: Dict[str, Any]) -> List[Dict[str, Any]]:
        # Deterministic analysis based on block connections to access blocks
        rows = []
        return rows
