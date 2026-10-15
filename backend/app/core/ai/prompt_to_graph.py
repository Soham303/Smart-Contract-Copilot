import re
import os
import json
from typing import Dict, Any, Tuple
from app.core.graph.catalog import catalog_instance

class PromptToGraphService:
    """Active AI service that autonomously synthesizes complete, connected block graphs

    from natural language English prompts (PRD Section 9.6, FR-6.1 - 6.7).
    """

    def generate_graph(self, prompt: str, api_key: str = None) -> Tuple[Dict[str, Any], Dict[str, Any]]:
        # If external LLM key is provided or in env, we can invoke it, otherwise use our active semantic synthesizer
        key = api_key or os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY")
        if key:
            try:
                graph, diff = self._invoke_llm_api(prompt, key)
                if graph:
                    return graph, diff
            except Exception as e:
                print(f"External LLM invocation error, falling back to autonomous semantic synthesizer: {e}")

        return self._synthesize_semantic_graph(prompt)

    def _synthesize_semantic_graph(self, prompt: str) -> Tuple[Dict[str, Any], Dict[str, Any]]:
        p = prompt.strip()
        lower_p = p.lower()

        # 1. Extract Name & Symbol
        name_match = re.search(r'(?:named|called|name)\s+["\']?([A-Za-z0-9\s_-]+?)["\']?(?:\s+(?:with|symbol|ticker|and|\.|$))', p, re.I)
        symbol_match = re.search(r'(?:symbol|ticker)\s+["\']?([A-Za-z0-9_-]+)["\']?', p, re.I)

        extracted_name = name_match.group(1).strip() if name_match else None
        extracted_symbol = symbol_match.group(1).strip().upper() if symbol_match else None

        # 2. Extract Max Supply / Total Supply
        supply_match = re.search(r'([\d,._]+)\s*(?:million|m|billion|b|k|thousand|tokens|nfts|coins|supply|items)?', lower_p)
        supply = None
        if supply_match:
            try:
                num_str = re.search(r'[\d,._]+', supply_match.group(0)).group(0).replace(',', '').replace('_', '')
                base_num = float(num_str)
                if 'billion' in supply_match.group(0) or 'b' in supply_match.group(0):
                    base_num *= 1_000_000_000
                elif 'million' in supply_match.group(0) or 'm' in supply_match.group(0):
                    base_num *= 1_000_000
                elif 'thousand' in supply_match.group(0) or 'k' in supply_match.group(0):
                    base_num *= 1_000
                supply = int(base_num)
            except Exception:
                supply = None

        # 3. Extract Royalty / Fee Percentage
        pct_match = re.search(r'(\d+(?:\.\d+)?)\s*%\s*(?:royalty|fee|cut|tax)', lower_p)
        fee_bps = None
        if pct_match:
            try:
                fee_bps = min(1000, int(float(pct_match.group(1)) * 100))
            except Exception:
                fee_bps = None

        # 4. Determine Primary Domain
        is_nft = any(w in lower_p for w in ["nft", "collectible", "pfp", "digital art", "collection", "mint rules", "royalty"])
        is_escrow = any(w in lower_p for w in ["escrow", "buyer", "seller", "freelance", "arbiter", "trade"])
        is_vesting = any(w in lower_p for w in ["vesting", "vest", "cliff", "lockup", "unlock schedule"])
        is_staking = any(w in lower_p for w in ["stake", "staking", "yield", "reward rate", "pool"])
        is_dao = any(w in lower_p for w in ["dao", "voting", "proposal", "quorum", "governance"])

        blocks = []
        edges = []
        explanation_items = []

        if is_nft:
            col_name = extracted_name or "Aptos Collectibles"
            mod_name = re.sub(r'[^a-zA-Z0-9_]', '_', col_name.lower())
            max_supply = supply if (supply and supply <= 50000) else 1000

            # Block 1: NFT Collection
            blocks.append({
                "id": "b1",
                "type": "nft.collection",
                "props": {
                    "name": col_name,
                    "description": f"Unique digital collectible collection: {col_name}",
                    "maxSupply": max_supply,
                    "uri": "https://ipfs.io/ipfs/collection-metadata.json"
                },
                "position": {"x": 360, "y": 140}
            })
            explanation_items.append(f"Created NFT Collection '{col_name}' capped at {max_supply:,} items")

            # Block 2: Royalty
            r_bps = fee_bps or 500
            blocks.append({
                "id": "b2",
                "type": "nft.royalty",
                "props": {"bps": r_bps, "recipient": "creator"},
                "position": {"x": 60, "y": 80}
            })
            edges.append({"from": "b2", "fromPort": "royalty", "to": "b1", "toPort": "royalty"})
            explanation_items.append(f"Attached Creator Royalty fee set to {(r_bps/100):.1f}%")

            # Block 3: Whitelist or Mint Rules
            if "whitelist" in lower_p or "presale" in lower_p or "vip" in lower_p:
                blocks.append({
                    "id": "b3",
                    "type": "access.whitelist",
                    "props": {"scope": "mint"},
                    "position": {"x": 60, "y": 240}
                })
                edges.append({"from": "b3", "fromPort": "gate", "to": "b1", "toPort": "mint"})

                # Owner block
                blocks.append({
                    "id": "b4",
                    "type": "access.owner",
                    "props": {"transferable": True},
                    "position": {"x": 60, "y": 380}
                })
                edges.append({"from": "b4", "fromPort": "owner", "to": "b3", "toPort": "admin"})
                explanation_items.append("Added VIP Whitelist gated by Master Owner admin rights")
            else:
                blocks.append({
                    "id": "b3",
                    "type": "access.owner",
                    "props": {"transferable": True},
                    "position": {"x": 60, "y": 240}
                })
                edges.append({"from": "b3", "fromPort": "owner", "to": "b1", "toPort": "mint"})
                explanation_items.append("Connected Master Owner capability for collection management")

        elif is_escrow:
            escrow_name = extracted_name or "TradeEscrow"
            mod_name = re.sub(r'[^a-zA-Z0-9_]', '_', escrow_name.lower())
            blocks.append({
                "id": "b1",
                "type": "finance.escrow",
                "props": {
                    "beneficiary": "0x2",
                    "timeoutSec": 86400 * 7,
                    "autoRefundOnTimeout": True
                },
                "position": {"x": 360, "y": 140}
            })
            blocks.append({
                "id": "b2",
                "type": "access.owner",
                "props": {"transferable": True},
                "position": {"x": 60, "y": 140}
            })
            edges.append({"from": "b2", "fromPort": "owner", "to": "b1", "toPort": "arbiter"})
            explanation_items.append("Synthesized Safe Escrow contract with arbiter release and 7-day refund timeout")

        elif is_vesting:
            v_name = extracted_name or "TeamVesting"
            mod_name = re.sub(r'[^a-zA-Z0-9_]', '_', v_name.lower())
            tot = supply or 1_000_000
            blocks.append({
                "id": "b1",
                "type": "finance.vesting",
                "props": {
                    "beneficiary": "0x3",
                    "cliffDurationSec": 2592000,
                    "vestingDurationSec": 31536000,
                    "totalAmount": tot
                },
                "position": {"x": 360, "y": 140}
            })
            blocks.append({
                "id": "b2",
                "type": "access.owner",
                "props": {"transferable": True},
                "position": {"x": 60, "y": 140}
            })
            explanation_items.append(f"Constructed Linear Vesting Lockup releasing {tot:,} tokens with 30-day cliff")

        elif is_staking:
            stk_name = extracted_name or "YieldStaking"
            mod_name = re.sub(r'[^a-zA-Z0-9_]', '_', stk_name.lower())
            blocks.append({
                "id": "b1",
                "type": "finance.staking",
                "props": {
                    "rewardRatePerSec": 10,
                    "lockupDurationSec": 604800
                },
                "position": {"x": 360, "y": 140}
            })
            blocks.append({
                "id": "b2",
                "type": "access.pausable",
                "props": {"initiallyPaused": false},
                "position": {"x": 60, "y": 140}
            })
            blocks.append({
                "id": "b3",
                "type": "access.owner",
                "props": {"transferable": True},
                "position": {"x": 60, "y": 280}
            })
            edges.append({"from": "b3", "fromPort": "owner", "to": "b2", "toPort": "admin"})
            explanation_items.append("Built Staking Reward Pool with 7-day lockup and emergency pause control")

        elif is_dao:
            dao_name = extracted_name or "CommunityDAO"
            mod_name = re.sub(r'[^a-zA-Z0-9_]', '_', dao_name.lower())
            blocks.append({
                "id": "b1",
                "type": "governance.voting_proposal",
                "props": {
                    "quorumPct": 20,
                    "votingPeriodSec": 259200,
                    "passThresholdPct": 51
                },
                "position": {"x": 360, "y": 140}
            })
            blocks.append({
                "id": "b2",
                "type": "access.role",
                "props": {"roleName": "COUNCIL"},
                "position": {"x": 60, "y": 140}
            })
            blocks.append({
                "id": "b3",
                "type": "access.owner",
                "props": {"transferable": True},
                "position": {"x": 60, "y": 280}
            })
            edges.append({"from": "b3", "fromPort": "owner", "to": "b2", "toPort": "manager"})
            explanation_items.append("Assembled Community DAO with proposal voting, 20% quorum, and council role governance")

        else:
            # Standard Fungible Token / Memecoin
            token_name = extracted_name or "StarCoin"
            token_sym = extracted_symbol or (token_name[:4].upper() if len(token_name) >= 3 else "STAR")
            mod_name = re.sub(r'[^a-zA-Z0-9_]', '_', token_name.lower())
            tot_supply = supply or 1_000_000

            # Block 1: Fungible Token
            blocks.append({
                "id": "b1",
                "type": "token.fungible",
                "props": {
                    "name": token_name,
                    "symbol": token_sym,
                    "decimals": 8,
                    "maxSupply": tot_supply,
                    "iconUri": "https://aptos.dev/logo.png",
                    "projectUri": "https://example.com"
                },
                "position": {"x": 420, "y": 160}
            })
            explanation_items.append(f"Configured Fungible Token '{token_name}' (${token_sym}) capped at {tot_supply:,} coins")

            # Block 2: Mint Control
            is_public_mint = "public mint" in lower_p or "anyone can mint" in lower_p or "free mint" in lower_p
            blocks.append({
                "id": "b2",
                "type": "token.mint_control",
                "props": {
                    "cap": tot_supply,
                    "rateLimit": 0,
                    "allowPublicMint": is_public_mint
                },
                "position": {"x": 100, "y": 80}
            })
            edges.append({"from": "b2", "fromPort": "mint_control", "to": "b1", "toPort": "mint"})
            explanation_items.append(f"Set Mint Control: {'Public Mint' if is_public_mint else 'Owner-only Mint'}")

            # Block 3: Owner block
            blocks.append({
                "id": "b3",
                "type": "access.owner",
                "props": {"transferable": True},
                "position": {"x": 100, "y": 240}
            })
            edges.append({"from": "b3", "fromPort": "owner", "to": "b2", "toPort": "admin"})

            # Optional: Burn block
            if "burn" in lower_p or "destroy" in lower_p or "deflation" in lower_p:
                burn_id = f"b_{len(blocks)+1}"
                blocks.append({
                    "id": burn_id,
                    "type": "token.burn",
                    "props": {"burner": "holder"},
                    "position": {"x": 720, "y": 80}
                })
                edges.append({"from": burn_id, "fromPort": "burn_control", "to": "b1", "toPort": "burn"})
                explanation_items.append("Added Token Burn module allowing holders to destroy tokens")

            # Optional: Pause block
            if "pause" in lower_p or "freeze" in lower_p or "emergency" in lower_p:
                pause_id = f"b_{len(blocks)+1}"
                blocks.append({
                    "id": pause_id,
                    "type": "token.freeze_pause",
                    "props": {"scope": "global"},
                    "position": {"x": 720, "y": 220}
                })
                edges.append({"from": pause_id, "fromPort": "pause_control", "to": "b1", "toPort": "pause"})
                explanation_items.append("Enabled Emergency Freeze Switch to protect against exploits")

            # Optional: Transfer fee block
            if "fee" in lower_p or "tax" in lower_p or fee_bps:
                fee_id = f"b_{len(blocks)+1}"
                t_bps = fee_bps or 100
                blocks.append({
                    "id": fee_id,
                    "type": "token.transfer_fee",
                    "props": {"bps": t_bps, "recipient": "creator"},
                    "position": {"x": 720, "y": 360}
                })
                edges.append({"from": fee_id, "fromPort": "fee_config", "to": "b1", "toPort": "fee"})
                explanation_items.append(f"Applied {(t_bps/100):.1f}% Transfer Fee to every transaction")

        graph = {
            "schemaVersion": "1.0",
            "target": "aptos-move",
            "meta": {
                "name": re.sub(r'[^a-zA-Z0-9]', '', extracted_name or "MyContract"),
                "moduleName": re.sub(r'[^a-zA-Z0-9_]', '_', (extracted_name or "my_contract").lower()),
                "version": "1.0.0"
            },
            "blocks": blocks,
            "edges": edges
        }

        diff = {
            "prompt": prompt,
            "totalBlocks": len(blocks),
            "edgesCount": len(edges),
            "addedBlocks": [b["type"] for b in blocks],
            "explanation": " • " + "\n • ".join(explanation_items)
        }

        return graph, diff

    def _invoke_llm_api(self, prompt: str, api_key: str):
        import urllib.request
        import urllib.error

        is_gemini = "AIza" in api_key or os.getenv("GEMINI_API_KEY") == api_key
        if not is_gemini:
            return None, None

        sys_msg = (
            "You are an Aptos Move smart contract architecture AI. "
            "Convert the user's prompt into a valid Contract Graph JSON with 'schemaVersion': '1.0', 'target': 'aptos-move', "
            "'meta': {'name': str, 'moduleName': str, 'version': '1.0.0'}, 'blocks': [{'id': str, 'type': str, 'props': dict, 'position': {'x': int, 'y': int}}], "
            "and 'edges': [{'from': str, 'fromPort': str, 'to': str, 'toPort': str}]. "
            "Valid block types include: 'token.fungible', 'token.mint_burn', 'token.freeze', 'token.transfer_fee', 'nft.collection', 'nft.whitelist', 'access.single_owner', 'finance.linear_vesting'. "
            "Return JSON only."
        )

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        req_data = {
            "contents": [
                {"parts": [{"text": f"{sys_msg}\n\nUser Prompt: {prompt}"}]}
            ],
            "generationConfig": {"temperature": 0.2, "responseMimeType": "application/json"}
        }
        try:
            req = urllib.request.Request(
                url,
                data=json.dumps(req_data).encode("utf-8"),
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                graph = json.loads(text)
                if "blocks" in graph and "edges" in graph:
                    diff = {
                        "prompt": prompt,
                        "totalBlocks": len(graph.get("blocks", [])),
                        "edgesCount": len(graph.get("edges", [])),
                        "addedBlocks": [b.get("type", "") for b in graph.get("blocks", [])],
                        "explanation": f"Autonomously synthesized {len(graph.get('blocks', []))} interconnected blocks via Gemini 1.5 Flash (Free Tier)"
                    }
                    return graph, diff
        except Exception as e:
            print(f"[PromptToGraph] Gemini API call error: {e}, using local semantic synthesizer")

        return None, None

ai_prompt_service = PromptToGraphService()
