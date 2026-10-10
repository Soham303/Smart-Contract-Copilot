from typing import Dict, Any, List

class PermissionsMatrixBuilder:
    """Deterministically derives the permissions matrix from the Contract Graph (PRD FR-12.1, 12.2)."""

    def build_matrix(self, graph: Dict[str, Any]) -> List[Dict[str, Any]]:
        rows = []
        blocks = {b.get("type"): b for b in graph.get("blocks", [])}

        if "token.fungible" in blocks:
            rows.append({
                "action": "Transfer Tokens",
                "actor": "Anyone",
                "details": "Standard primary fungible store peer-to-peer transfer"
            })

        if "token.mint_control" in blocks:
            b = blocks["token.mint_control"]
            is_public = b.get("props", {}).get("allowPublicMint", False)
            rows.append({
                "action": "Mint Tokens",
                "actor": "Anyone" if is_public else "Owner/Admin",
                "details": f"Capped at max supply {b.get('props', {}).get('cap', 'N/A')}"
            })

        if "token.burn" in blocks:
            rows.append({
                "action": "Burn Tokens",
                "actor": "Anyone",
                "details": "Holders can burn their own tokens"
            })

        if "token.freeze_pause" in blocks or "access.pausable" in blocks:
            rows.append({
                "action": "Pause Contract",
                "actor": "Owner/Admin",
                "details": "Emergency pause freezes all state updates"
            })

        if "finance.escrow" in blocks:
            rows.append({
                "action": "Release Escrow",
                "actor": "Owner/Admin",
                "details": "Releases locked deposit to designated beneficiary"
            })
            rows.append({
                "action": "Refund Escrow",
                "actor": "Anyone",
                "details": "Callable by anyone after timeout expires"
            })

        if "finance.vesting" in blocks:
            rows.append({
                "action": "Claim Vesting",
                "actor": "Specific Role",
                "details": "Only designated beneficiary after cliff duration"
            })

        if "access.owner" in blocks:
            rows.append({
                "action": "Transfer Ownership",
                "actor": "Owner/Admin",
                "details": "Passes AdminCapability to new address"
            })

        return rows
