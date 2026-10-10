import re
from typing import Dict, Any, Tuple
from app.core.graph.catalog import catalog_instance

class PromptToGraphService:
    """Transforms natural language descriptions into validated block graphs with diff preview (PRD FR-6.1 - 6.7)."""

    def generate_graph(self, prompt: str) -> Tuple[Dict[str, Any], Dict[str, Any]]:
        p = prompt.lower()

        # Extract numerical supply if present (e.g. 1000, 1000000)
        supply_match = re.search(r"(\d+[\d_,]*)\s*(supply|tokens|nfts|max|items)?", p)
        supply = 1000000
        if supply_match:
            try:
                raw_num = supply_match.group(1).replace(",", "").replace("_", "")
                if int(raw_num) > 0:
                    supply = int(raw_num)
            except ValueError:
                pass

        # Extract royalty bps if present (e.g. "5%", "500 bps")
        royalty_bps = 500
        royalty_match = re.search(r"(\d+(\.\d+)?)%\s*royalt", p)
        if royalty_match:
            try:
                pct = float(royalty_match.group(1))
                royalty_bps = min(1000, int(pct * 100))
            except ValueError:
                pass

        if "nft" in p or "collection" in p or "art" in p:
            template = catalog_instance.get_template("template_nft_collection")
            graph = json_copy(template["graph"])
            graph["blocks"][0]["props"]["maxSupply"] = supply if supply < 1000000 else 1000
            graph["blocks"][1]["props"]["bps"] = royalty_bps
        elif "escrow" in p:
            template = catalog_instance.get_template("template_escrow")
            graph = json_copy(template["graph"])
        elif "vesting" in p:
            template = catalog_instance.get_template("template_vesting")
            graph = json_copy(template["graph"])
            graph["blocks"][0]["props"]["totalAmount"] = supply
        elif "stake" in p or "staking" in p:
            template = catalog_instance.get_template("template_staking")
            graph = json_copy(template["graph"])
        elif "vote" in p or "dao" in p or "governance" in p:
            template = catalog_instance.get_template("template_voting_dao")
            graph = json_copy(template["graph"])
        else:
            # Default to Fungible Token
            template = catalog_instance.get_template("template_fungible_token")
            graph = json_copy(template["graph"])
            graph["blocks"][0]["props"]["maxSupply"] = supply
            graph["blocks"][1]["props"]["cap"] = supply

            if "burn" in p:
                burn_id = f"b_{len(graph['blocks'])+1}"
                graph["blocks"].append({
                    "id": burn_id,
                    "type": "token.burn",
                    "props": {"burner": "holder"}
                })
                graph["edges"].append({
                    "from": burn_id,
                    "fromPort": "burn_control",
                    "to": "b1",
                    "toPort": "burn"
                })

            if "pause" in p or "freeze" in p:
                pause_id = f"b_{len(graph['blocks'])+1}"
                graph["blocks"].append({
                    "id": pause_id,
                    "type": "token.freeze_pause",
                    "props": {"scope": "global"}
                })
                graph["edges"].append({
                    "from": pause_id,
                    "fromPort": "pause_control",
                    "to": "b1",
                    "toPort": "pause"
                })

        diff = {
            "prompt": prompt,
            "addedBlocks": [b["type"] for b in graph["blocks"]],
            "totalBlocks": len(graph["blocks"]),
            "edgesCount": len(graph["edges"])
        }
        return graph, diff

def json_copy(obj):
    import json
    return json.loads(json.dumps(obj))

ai_prompt_service = PromptToGraphService()
