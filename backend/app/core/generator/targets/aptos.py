import json
from typing import Dict, Any, Tuple, List
from app.core.graph.schema import ContractGraph
from app.core.generator.source_map import SourceMap
from app.core.generator.targets.base import Target

class AptosMoveTarget(Target):
    """Deterministic Aptos Move code generator adhering to Aptos standards (PRD FR-4.1 - 4.6)."""

    def generate(self, graph: ContractGraph) -> Tuple[Dict[str, str], SourceMap]:
        source_map = SourceMap()
        package_name = graph.meta.name or "CopilotContract"
        module_name = graph.meta.moduleName or "copilot_contract"
        version = graph.meta.version or "0.1.0"

        # 1. Generate Move.toml
        move_toml = f"""[package]
name = "{package_name}"
version = "{version}"

[dependencies]
AptosFramework = {{ git = "https://github.com/aptos-labs/aptos-framework.git", rev = "mainnet", subdir = "aptos-framework" }}
AptosTokenObjects = {{ git = "https://github.com/aptos-labs/aptos-framework.git", rev = "mainnet", subdir = "aptos-token-objects" }}

[addresses]
copilot_addr = "_"
"""

        # 2. Build Sources Line by Line with Source Mapping
        lines: List[str] = []

        def add_line(content: str = ""):
            lines.append(content)
            return len(lines)

        def add_block_section(block_id: str, section_lines: List[str]):
            start = len(lines) + 1
            for sl in section_lines:
                lines.append(sl)
            end = len(lines)
            if end >= start:
                source_map.add_mapping(block_id, start, end)

        # Header
        add_line(f"// Auto-generated deterministic Aptos Move package by Smart Contract Copilot")
        add_line(f"// Target: Aptos Move Framework v1.0")
        add_line(f"module copilot_addr::{module_name} {{")
        add_line("    use std::signer;")
        add_line("    use std::string::{Self, String};")
        add_line("    use aptos_framework::object::{Self, Object};")
        add_line("    use aptos_framework::event;")
        add_line("    use aptos_framework::timestamp;")

        # Categorize active blocks
        block_types = {b.type: b for b in graph.blocks}
        has_token = "token.fungible" in block_types
        has_nft = "nft.collection" in block_types
        has_mint_control = "token.mint_control" in block_types
        has_burn = "token.burn" in block_types
        has_pause = "token.freeze_pause" in block_types or "access.pausable" in block_types
        has_fee = "token.transfer_fee" in block_types
        has_royalty = "nft.royalty" in block_types
        has_escrow = "finance.escrow" in block_types
        has_vesting = "finance.vesting" in block_types
        has_staking = "finance.staking" in block_types
        has_gov = "governance.voting_proposal" in block_types

        if has_token:
            add_line("    use aptos_framework::fungible_asset::{Self, MintRef, TransferRef, BurnRef, Metadata};")
            add_line("    use aptos_framework::primary_fungible_store;")

        add_line()
        add_line("    // --- ERROR CODES ---")
        add_line("    const ENOT_AUTHORIZED: u64 = 1;")
        add_line("    const EEXCEEDS_CAP: u64 = 2;")
        add_line("    const EPAUSED: u64 = 3;")
        add_line("    const EINVALID_AMOUNT: u64 = 4;")
        add_line("    const EALREADY_INITIALIZED: u64 = 5;")
        add_line()

        # Generate Structs & Capabilities
        add_line("    // --- RESOURCE CAPABILITIES ---")
        if "access.owner" in block_types:
            b = block_types["access.owner"]
            add_block_section(b.id, [
                "    struct AdminCapability has key, store {",
                "        admin_address: address,",
                "    }"
            ])

        if has_token:
            b = block_types["token.fungible"]
            add_block_section(b.id, [
                "    struct ManagedFungibleAsset has key {",
                "        mint_ref: MintRef,",
                "        burn_ref: BurnRef,",
                "        transfer_ref: TransferRef,",
                "        total_minted: u64,",
                "        max_supply: u64,",
                "    }"
            ])

        if has_pause:
            pause_b = block_types.get("access.pausable") or block_types.get("token.freeze_pause")
            add_block_section(pause_b.id, [
                "    struct PauseControl has key {",
                "        is_paused: bool,",
                "    }"
            ])

        if has_escrow:
            b = block_types["finance.escrow"]
            add_block_section(b.id, [
                "    struct EscrowRecord has key {",
                "        beneficiary: address,",
                "        release_timeout: u64,",
                "        is_released: bool,",
                "    }"
            ])

        if has_vesting:
            b = block_types["finance.vesting"]
            add_block_section(b.id, [
                "    struct VestingSchedule has key {",
                "        beneficiary: address,",
                "        start_time: u64,",
                "        cliff_seconds: u64,",
                "        duration_seconds: u64,",
                "        total_amount: u64,",
                "        released_amount: u64,",
                "    }"
            ])

        # State Variable blocks
        for b in graph.blocks:
            if b.type == "logic.state_variable":
                var_name = b.props.get("name", "state_val")
                var_type = b.props.get("varType", "u64")
                add_block_section(b.id, [
                    f"    struct Var_{var_name} has key {{",
                    f"        val: {var_type},",
                    f"    }}"
                ])

        add_line()
        add_line("    // --- INITIALIZATION ---")
        add_line("    fun init_module(admin: &signer) {")
        add_line("        let admin_addr = signer::address_of(admin);")

        if "access.owner" in block_types:
            b = block_types["access.owner"]
            add_block_section(b.id, [
                "        move_to(admin, AdminCapability { admin_address: admin_addr });"
            ])

        if has_token:
            b = block_types["token.fungible"]
            name = b.props.get("name", "MyToken")
            sym = b.props.get("symbol", "MTK")
            dec = b.props.get("decimals", 8)
            max_sup = b.props.get("maxSupply", 1000000)
            icon = b.props.get("iconUri", "https://aptos.dev/logo.png")
            proj = b.props.get("projectUri", "https://example.com")

            add_block_section(b.id, [
                f"        let constructor_ref = &object::create_named_object(admin, b\"{sym}\");",
                f"        primary_fungible_store::create_primary_store_enabled_fungible_asset(",
                f"            constructor_ref,",
                f"            option::some({max_sup}),",
                f"            string::utf8(b\"{name}\"),",
                f"            string::utf8(b\"{sym}\"),",
                f"            {dec},",
                f"            string::utf8(b\"{icon}\"),",
                f"            string::utf8(b\"{proj}\"),",
                f"        );",
                f"        let mint_ref = fungible_asset::generate_mint_ref(constructor_ref);",
                f"        let burn_ref = fungible_asset::generate_burn_ref(constructor_ref);",
                f"        let transfer_ref = fungible_asset::generate_transfer_ref(constructor_ref);",
                f"        move_to(admin, ManagedFungibleAsset {{",
                f"            mint_ref,",
                f"            burn_ref,",
                f"            transfer_ref,",
                f"            total_minted: 0,",
                f"            max_supply: {max_sup},",
                f"        }});"
            ])

        if has_pause:
            pause_b = block_types.get("access.pausable") or block_types.get("token.freeze_pause")
            init_paused = str(pause_b.props.get("initiallyPaused", False)).lower()
            add_block_section(pause_b.id, [
                f"        move_to(admin, PauseControl {{ is_paused: {init_paused} }});"
            ])

        add_line("    }")
        add_line()

        # Entry Functions
        add_line("    // --- ENTRY FUNCTIONS ---")

        if has_mint_control:
            b = block_types["token.mint_control"]
            cap = b.props.get("cap", 1000000)
            add_block_section(b.id, [
                "    public entry fun mint(caller: &signer, recipient: address, amount: u64) acquires ManagedFungibleAsset, AdminCapability {",
                "        let caller_addr = signer::address_of(caller);",
                "        assert!(exists<AdminCapability>(caller_addr), ENOT_AUTHORIZED);",
                "        let asset = borrow_global_mut<ManagedFungibleAsset>(caller_addr);",
                f"        assert!(asset.total_minted + amount <= {cap}, EEXCEEDS_CAP);",
                "        let fa = fungible_asset::mint(&asset.mint_ref, amount);",
                "        primary_fungible_store::deposit(recipient, fa);",
                "        asset.total_minted = asset.total_minted + amount;",
                "    }"
            ])
            add_line()

        if has_burn:
            b = block_types["token.burn"]
            add_block_section(b.id, [
                "    public entry fun burn(caller: &signer, amount: u64) acquires ManagedFungibleAsset {",
                "        let asset = borrow_global<ManagedFungibleAsset>(@copilot_addr);",
                "        primary_fungible_store::burn(&asset.burn_ref, caller, amount);",
                "    }"
            ])
            add_line()

        if has_pause:
            pause_b = block_types.get("access.pausable") or block_types.get("token.freeze_pause")
            add_block_section(pause_b.id, [
                "    public entry fun set_pause(caller: &signer, paused: bool) acquires PauseControl, AdminCapability {",
                "        assert!(exists<AdminCapability>(signer::address_of(caller)), ENOT_AUTHORIZED);",
                "        let control = borrow_global_mut<PauseControl>(@copilot_addr);",
                "        control.is_paused = paused;",
                "    }"
            ])
            add_line()

        if has_escrow:
            b = block_types["finance.escrow"]
            add_block_section(b.id, [
                "    public entry fun release_escrow(caller: &signer) acquires EscrowRecord, AdminCapability {",
                "        assert!(exists<AdminCapability>(signer::address_of(caller)), ENOT_AUTHORIZED);",
                "        let escrow = borrow_global_mut<EscrowRecord>(@copilot_addr);",
                "        escrow.is_released = true;",
                "    }"
            ])
            add_line()

        if has_vesting:
            b = block_types["finance.vesting"]
            add_block_section(b.id, [
                "    public entry fun claim_vesting(caller: &signer) acquires VestingSchedule {",
                "        let caller_addr = signer::address_of(caller);",
                "        let schedule = borrow_global_mut<VestingSchedule>(@copilot_addr);",
                "        assert!(caller_addr == schedule.beneficiary, ENOT_AUTHORIZED);",
                "        let now = timestamp::now_seconds();",
                "        assert!(now >= schedule.start_time + schedule.cliff_seconds, ENOT_AUTHORIZED);",
                "    }"
            ])
            add_line()

        # Custom Function blocks
        for b in graph.blocks:
            if b.type == "logic.custom_function":
                fn_name = b.props.get("name", "custom_fn")
                is_entry = "entry " if b.props.get("isEntry", True) else ""
                add_block_section(b.id, [
                    f"    public {is_entry}fun {fn_name}(caller: &signer) {{",
                    f"        // Custom logic for {fn_name}",
                    f"        let _caller_addr = signer::address_of(caller);",
                    f"    }}"
                ])
                add_line()

        add_line("}")

        full_source = "\n".join(lines)
        files = {
            "Move.toml": move_toml,
            f"sources/{module_name}.move": full_source
        }
        return files, source_map
