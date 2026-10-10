from typing import Dict, Any, List

class PermissionsExplainer:
    """Answers key questions in plain English and summarizes funds flows (PRD FR-12.3 - 12.7)."""

    def explain(self, matrix: List[Dict[str, Any]], graph: Dict[str, Any]) -> Dict[str, Any]:
        blocks = {b.get("type"): b for b in graph.get("blocks", [])}

        who_can_mint = "Nobody / Disabled"
        if "token.mint_control" in blocks:
            b = blocks["token.mint_control"]
            if b.get("props", {}).get("allowPublicMint", False):
                who_can_mint = "Anyone (Public Mint enabled)"
            else:
                who_can_mint = "Only Owner/Admin with AdminCapability"
        elif "nft.collection" in blocks:
            who_can_mint = "Anyone adhering to collection mint rules"

        who_can_withdraw = "Nobody / Non-withdrawable"
        if "finance.escrow" in blocks:
            who_can_withdraw = "Beneficiary upon admin release, or depositor after timeout"
        elif "finance.vesting" in blocks:
            who_can_withdraw = "Beneficiary claimable linearly after cliff"

        who_can_pause = "Contract is not pausable"
        if "token.freeze_pause" in blocks or "access.pausable" in blocks:
            who_can_pause = "Only Owner/Admin can toggle emergency pause"

        can_supply_grow = "No"
        if "token.fungible" in blocks:
            max_sup = blocks["token.fungible"].get("props", {}).get("maxSupply", "unbounded")
            can_supply_grow = f"Yes, strictly capped at {max_sup} tokens"
        elif "nft.collection" in blocks:
            max_sup = blocks["nft.collection"].get("props", {}).get("maxSupply", "unbounded")
            can_supply_grow = f"Yes, capped at {max_sup} NFTs"

        mutable_params = []
        if "token.transfer_fee" in blocks:
            bps = blocks["token.transfer_fee"].get("props", {}).get("bps", 0)
            mutable_params.append(f"Transfer fee set to {bps} bps ({(bps/100):.1f}%)")
        if "nft.royalty" in blocks:
            bps = blocks["nft.royalty"].get("props", {}).get("bps", 0)
            mutable_params.append(f"Royalty rate set to {bps} bps ({(bps/100):.1f}%)")

        return {
            "keyAnswers": {
                "whoCanMint": who_can_mint,
                "whoCanWithdraw": who_can_withdraw,
                "whoCanPause": who_can_pause,
                "canSupplyGrow": can_supply_grow,
                "canContractBeUpgraded": "Standard Aptos package governance upgrade rules apply."
            },
            "mutableParameters": mutable_params,
            "fundsFlow": {
                "inflow": "Deposits, mint fees, and transfers routed through Primary Fungible Stores.",
                "outflow": "Controlled by resource capability checks.",
                "controllers": ["Owner/Admin" if "access.owner" in blocks else "Decentralized logic"]
            }
        }
