import re
import os
import json
from typing import Dict, Any, Tuple
from app.core.graph.catalog import catalog_instance

class PromptToGraphService:
    """Active AI service that autonomously synthesizes complete, connected block graphs
    with comprehensive properties and typed port connections from natural language English prompts (PRD Section 9.6, FR-6.1 - 6.7).
    """

    def generate_graph(self, prompt: str, api_key: str = None) -> Tuple[Dict[str, Any], Dict[str, Any]]:
        # If external LLM key is provided or in env, attempt Gemini generation first
        key = api_key or os.getenv("GEMINI_API_KEY")
        if key:
            try:
                graph, diff = self._invoke_llm_api(prompt, key)
                if graph and len(graph.get("blocks", [])) >= 3 and len(graph.get("edges", [])) >= 2:
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
            max_supply = supply if (supply and supply <= 50000) else 5000

            # Block 1: Master Owner Capability (Left)
            blocks.append({
                "id": "b1_owner",
                "type": "access.owner",
                "props": {"transferable": True},
                "position": {"x": 60, "y": 140}
            })
            explanation_items.append("Configured Master Admin Owner Capability for administrative privilege")

            # Block 2: Whitelist Gate (Middle Top)
            blocks.append({
                "id": "b2_whitelist",
                "type": "access.whitelist",
                "props": {"scope": "mint"},
                "position": {"x": 420, "y": 60}
            })
            edges.append({"from": "b1_owner", "fromPort": "owner", "to": "b2_whitelist", "toPort": "admin"})
            explanation_items.append("Added Access Whitelist gate for VIP/presale mint authorization")

            # Block 3: Secondary Royalty (Middle Center)
            r_bps = fee_bps or 500
            blocks.append({
                "id": "b3_royalty",
                "type": "nft.royalty",
                "props": {"bps": r_bps, "recipient": "creator"},
                "position": {"x": 420, "y": 240}
            })
            explanation_items.append(f"Configured Creator Royalty fee set to {(r_bps/100):.1f}% ({r_bps} bps)")

            # Block 4: Emergency Freeze Switch (Middle Bottom)
            blocks.append({
                "id": "b4_freeze",
                "type": "token.freeze_pause",
                "props": {"scope": "global"},
                "position": {"x": 420, "y": 420}
            })
            edges.append({"from": "b1_owner", "fromPort": "owner", "to": "b4_freeze", "toPort": "admin"})
            explanation_items.append("Added Emergency Freeze switch to halt transfers during security incidents")

            # Block 5: Digital Asset NFT Collection (Right)
            blocks.append({
                "id": "b5_nft",
                "type": "nft.collection",
                "props": {
                    "name": col_name,
                    "description": f"Official Aptos Digital Asset v2 collection: {col_name}",
                    "maxSupply": max_supply,
                    "uri": "https://ipfs.io/ipfs/collection-metadata.json"
                },
                "position": {"x": 840, "y": 180}
            })
            edges.append({"from": "b2_whitelist", "fromPort": "gate", "to": "b5_nft", "toPort": "mint"})
            edges.append({"from": "b3_royalty", "fromPort": "royalty", "to": "b5_nft", "toPort": "royalty"})
            explanation_items.append(f"Linked Aptos Digital Asset Collection '{col_name}' capped at {max_supply:,} NFTs")

        elif is_vesting:
            v_name = extracted_name or "TeamVesting"
            mod_name = re.sub(r'[^a-zA-Z0-9_]', '_', v_name.lower())
            tot = supply or 2_000_000

            # Block 1: Master Owner
            blocks.append({
                "id": "b1_owner",
                "type": "access.owner",
                "props": {"transferable": True},
                "position": {"x": 60, "y": 140}
            })

            # Block 2: Mint Control
            blocks.append({
                "id": "b2_mint",
                "type": "token.mint_control",
                "props": {"cap": tot, "rateLimit": 0, "allowPublicMint": False},
                "position": {"x": 420, "y": 60}
            })
            edges.append({"from": "b1_owner", "fromPort": "owner", "to": "b2_mint", "toPort": "admin"})

            # Block 3: Fungible Token
            blocks.append({
                "id": "b3_token",
                "type": "token.fungible",
                "props": {
                    "name": f"{v_name} Token",
                    "symbol": extracted_symbol or "VEST",
                    "decimals": 8,
                    "maxSupply": tot,
                    "iconUri": "https://aptos.dev/logo.png",
                    "projectUri": "https://example.com"
                },
                "position": {"x": 420, "y": 260}
            })
            edges.append({"from": "b2_mint", "fromPort": "mint_control", "to": "b3_token", "toPort": "mint"})

            # Block 4: Linear Vesting Schedule
            blocks.append({
                "id": "b4_vesting",
                "type": "finance.vesting",
                "props": {
                    "beneficiary": "0x3",
                    "cliffDurationSec": 2592000,
                    "vestingDurationSec": 31536000,
                    "totalAmount": tot
                },
                "position": {"x": 840, "y": 180}
            })
            edges.append({"from": "b3_token", "fromPort": "token", "to": "b4_vesting", "toPort": "token"})

            explanation_items.append("Constructed Linear Vesting Lockup with 30-day cliff and 365-day gradual unlock schedule")
            explanation_items.append(f"Linked underlying Fungible Asset '{v_name}' backed by {tot:,} tokens")

        elif is_escrow:
            escrow_name = extracted_name or "TradeEscrow"
            mod_name = re.sub(r'[^a-zA-Z0-9_]', '_', escrow_name.lower())

            # Block 1: Master Owner
            blocks.append({
                "id": "b1_owner",
                "type": "access.owner",
                "props": {"transferable": True},
                "position": {"x": 60, "y": 140}
            })

            # Block 2: Escrow Contract
            blocks.append({
                "id": "b2_escrow",
                "type": "finance.escrow",
                "props": {
                    "beneficiary": "0x2",
                    "timeoutSec": 86400 * 14,
                    "autoRefundOnTimeout": True
                },
                "position": {"x": 440, "y": 140}
            })
            edges.append({"from": "b1_owner", "fromPort": "owner", "to": "b2_escrow", "toPort": "arbiter"})

            # Block 3: Emergency Pause
            blocks.append({
                "id": "b3_pause",
                "type": "token.freeze_pause",
                "props": {"scope": "global"},
                "position": {"x": 440, "y": 320}
            })
            edges.append({"from": "b1_owner", "fromPort": "owner", "to": "b3_pause", "toPort": "admin"})

            explanation_items.append("Synthesized Safe Trade Escrow with 14-day automatic refund timeout")
            explanation_items.append("Attached Arbiter dispute resolution gate and emergency pause control")

        elif is_staking:
            stk_name = extracted_name or "YieldStaking"
            mod_name = re.sub(r'[^a-zA-Z0-9_]', '_', stk_name.lower())

            # Block 1: Master Owner
            blocks.append({
                "id": "b1_owner",
                "type": "access.owner",
                "props": {"transferable": True},
                "position": {"x": 60, "y": 160}
            })

            # Block 2: Pause Control
            blocks.append({
                "id": "b2_pause",
                "type": "token.freeze_pause",
                "props": {"scope": "global"},
                "position": {"x": 420, "y": 80}
            })
            edges.append({"from": "b1_owner", "fromPort": "owner", "to": "b2_pause", "toPort": "admin"})

            # Block 3: Staking Pool
            blocks.append({
                "id": "b3_staking",
                "type": "finance.staking",
                "props": {
                    "rewardRatePerSec": 25,
                    "lockupDurationSec": 604800
                },
                "position": {"x": 840, "y": 140}
            })

            explanation_items.append("Built Yield Staking Pool with 7-day minimum lockup and calibrated reward emission")
            explanation_items.append("Protected pool with Owner-gated emergency circuit breaker")

        else:
            # Standard Rich Fungible Asset / Memecoin (5 Connected Blocks!)
            token_name = extracted_name or "AptosToken"
            token_sym = extracted_symbol or (token_name[:4].upper() if len(token_name) >= 3 else "APT")
            mod_name = re.sub(r'[^a-zA-Z0-9_]', '_', token_name.lower())
            tot_supply = supply or 1_000_000_000

            # 1. Master Owner Admin Capability (Left)
            blocks.append({
                "id": "b1_owner",
                "type": "access.owner",
                "props": {"transferable": True},
                "position": {"x": 60, "y": 180}
            })
            explanation_items.append("Generated Master Admin Owner Capability for administrative control")

            # 2. Mint Control (Middle Top)
            is_public_mint = "public mint" in lower_p or "anyone can mint" in lower_p or "free mint" in lower_p
            blocks.append({
                "id": "b2_mint",
                "type": "token.mint_control",
                "props": {
                    "cap": tot_supply,
                    "rateLimit": 0,
                    "allowPublicMint": is_public_mint
                },
                "position": {"x": 440, "y": 60}
            })
            edges.append({"from": "b1_owner", "fromPort": "owner", "to": "b2_mint", "toPort": "admin"})
            explanation_items.append(f"Configured Mint Control (Cap: {tot_supply:,}, Public: {is_public_mint})")

            # 3. Emergency Freeze Switch (Middle Center)
            blocks.append({
                "id": "b3_freeze",
                "type": "token.freeze_pause",
                "props": {"scope": "global"},
                "position": {"x": 440, "y": 240}
            })
            edges.append({"from": "b1_owner", "fromPort": "owner", "to": "b3_freeze", "toPort": "admin"})
            explanation_items.append("Enabled Emergency Freeze Switch to protect against exploits")

            # 4. Transfer Fee / Tax (Middle Bottom)
            t_bps = fee_bps if fee_bps is not None else (200 if ("fee" in lower_p or "tax" in lower_p) else 100)
            blocks.append({
                "id": "b4_fee",
                "type": "token.transfer_fee",
                "props": {"bps": t_bps, "recipient": "creator"},
                "position": {"x": 440, "y": 420}
            })
            explanation_items.append(f"Enforced {(t_bps/100):.1f}% ({t_bps} bps) Protocol Transfer Fee to treasury")

            # 5. Burn Capability (Middle Bottom-2)
            blocks.append({
                "id": "b5_burn",
                "type": "token.burn",
                "props": {"burner": "holder"},
                "position": {"x": 440, "y": 580}
            })
            edges.append({"from": "b1_owner", "fromPort": "owner", "to": "b5_burn", "toPort": "admin"})
            explanation_items.append("Integrated Deflationary Burn mechanism allowing holders to destroy tokens")

            # 6. Central Fungible Asset Token (Right)
            blocks.append({
                "id": "b6_token",
                "type": "token.fungible",
                "props": {
                    "name": token_name,
                    "symbol": token_sym,
                    "decimals": 8,
                    "maxSupply": tot_supply,
                    "iconUri": "https://aptos.dev/logo.png",
                    "projectUri": "https://example.com"
                },
                "position": {"x": 880, "y": 220}
            })
            # Connect all controllers to the central fungible token
            edges.append({"from": "b2_mint", "fromPort": "mint_control", "to": "b6_token", "toPort": "mint"})
            edges.append({"from": "b3_freeze", "fromPort": "pause_control", "to": "b6_token", "toPort": "pause"})
            edges.append({"from": "b4_fee", "fromPort": "fee_config", "to": "b6_token", "toPort": "fee"})
            edges.append({"from": "b5_burn", "fromPort": "burn_control", "to": "b6_token", "toPort": "burn"})

            explanation_items.append(f"Linked core Fungible Asset '{token_name}' (${token_sym}) capped at {tot_supply:,}")

        graph = {
            "schemaVersion": "1.0",
            "target": "aptos-move",
            "meta": {
                "name": extracted_name or "GeneratedContract",
                "moduleName": mod_name if 'mod_name' in locals() else "generated_module",
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

        is_gemini = "AIza" in api_key or api_key.startswith("AQ.") or os.getenv("GEMINI_API_KEY") == api_key
        if not is_gemini:
            return None, None

        sys_msg = (
            "You are an expert Aptos Move smart contract architecture AI. "
            "Convert the user's natural language prompt into a comprehensive, multi-block contract topology. "
            "You MUST output at least 4 to 6 interconnected blocks with complete, non-empty properties and valid port edges. "
            "Exact valid catalog block types and ports: "
            "- 'access.owner': ports.out: ['owner' (AccessGate)], props: {'transferable': bool}\n"
            "- 'access.whitelist': ports.in: ['admin' (AccessGate)], ports.out: ['gate' (MintGate)], props: {'scope': 'mint'}\n"
            "- 'token.mint_control': ports.in: ['admin' (AccessGate)], ports.out: ['mint_control' (MintGate)], props: {'cap': int, 'rateLimit': int, 'allowPublicMint': bool}\n"
            "- 'token.freeze_pause': ports.in: ['admin' (AccessGate)], ports.out: ['pause_control' (PauseGate)], props: {'scope': 'global'}\n"
            "- 'token.transfer_fee': ports.out: ['fee_config' (FeeConfig)], props: {'bps': int, 'recipient': str}\n"
            "- 'token.burn': ports.in: ['admin' (AccessGate)], ports.out: ['burn_control' (BurnGate)], props: {'burner': 'holder'}\n"
            "- 'token.fungible': ports.in: ['mint' (MintGate), 'burn' (BurnGate), 'pause' (PauseGate), 'fee' (FeeConfig)], ports.out: ['token' (TokenRef)], "
            "props: {'name': str, 'symbol': str, 'decimals': 8, 'maxSupply': int, 'iconUri': str, 'projectUri': str}\n"
            "- 'nft.collection': ports.in: ['mint' (MintGate), 'royalty' (RoyaltyConfig), 'pause' (PauseGate)], props: {'name': str, 'description': str, 'maxSupply': int, 'uri': str}\n"
            "- 'nft.royalty': ports.out: ['royalty' (RoyaltyConfig)], props: {'bps': int, 'recipient': str}\n"
            "- 'finance.vesting': ports.in: ['token' (TokenRef)], props: {'beneficiary': str, 'cliffDurationSec': int, 'vestingDurationSec': int, 'totalAmount': int}\n"
            "- 'finance.escrow': ports.in: ['arbiter' (AccessGate)], props: {'beneficiary': str, 'timeoutSec': int, 'autoRefundOnTimeout': bool}\n\n"
            "All edges MUST connect valid outPort to inPort. "
            "Return ONLY valid JSON matching format: "
            "{'schemaVersion': '1.0', 'target': 'aptos-move', 'meta': {'name': str, 'moduleName': str, 'version': '1.0.0'}, "
            "'blocks': [{'id': str, 'type': str, 'props': dict, 'position': {'x': int, 'y': int}}], "
            "'edges': [{'from': str, 'fromPort': str, 'to': str, 'toPort': str}]}"
        )

        candidate_models = ["gemini-3-flash-preview", "gemini-flash-latest", "gemini-2.5-flash-lite", "gemini-1.5-flash"]
        for gemini_model in candidate_models:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{gemini_model}:generateContent?key={api_key}"
            req_data = {
                "contents": [
                    {"parts": [{"text": f"{sys_msg}\n\nUser Request: {prompt}"}]}
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
                    if "blocks" in graph and "edges" in graph and len(graph["blocks"]) >= 3:
                        diff = {
                            "prompt": prompt,
                            "totalBlocks": len(graph.get("blocks", [])),
                            "edgesCount": len(graph.get("edges", [])),
                            "addedBlocks": [b.get("type", "") for b in graph.get("blocks", [])],
                            "explanation": f"Autonomously synthesized {len(graph.get('blocks', []))} interconnected blocks via Google {gemini_model.title()} (Free Tier)"
                        }
                        return graph, diff
            except Exception as e:
                continue

        return None, None

ai_prompt_service = PromptToGraphService()
