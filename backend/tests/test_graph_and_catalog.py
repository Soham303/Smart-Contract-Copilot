import pytest
from app.core.graph.catalog import catalog_instance
from app.core.graph.validator import GraphValidator

def test_catalog_loads_all_blocks():
    blocks = catalog_instance.list_blocks()
    assert len(blocks) >= 20, f"Expected at least 20 blocks in catalog, found {len(blocks)}"
    categories = catalog_instance.get_categories()
    for required_cat in ["Token", "NFT", "Finance", "Governance", "Access", "Logic"]:
        assert required_cat in categories, f"Category {required_cat} missing from catalog"

def test_catalog_loads_all_templates():
    templates = catalog_instance.list_templates()
    assert len(templates) >= 6, f"Expected at least 6 templates, found {len(templates)}"
    template_ids = {t["id"] for t in templates}
    for expected_id in [
        "template_fungible_token",
        "template_nft_collection",
        "template_escrow",
        "template_vesting",
        "template_staking",
        "template_voting_dao"
    ]:
        assert expected_id in template_ids, f"Template {expected_id} missing"

def test_all_templates_pass_graph_validation():
    validator = GraphValidator(catalog_instance)
    for tmpl in catalog_instance.list_templates():
        graph = tmpl["graph"]
        res = validator.validate(graph)
        assert res["valid"] is True, f"Template {tmpl['id']} failed validation: {res['errors']}"

def test_port_type_compatibility_enforced():
    # token.mint_control (out: mint_control: MintGate) -> token.fungible (in: mint: MintGate) should succeed
    compat = catalog_instance.validate_port_connection(
        from_block_type="token.mint_control",
        from_port_name="mint_control",
        to_block_type="token.fungible",
        to_port_name="mint"
    )
    assert compat["compatible"] is True

    # Incompatible connection: royalty -> fungible token mint port should fail with reason
    incompat = catalog_instance.validate_port_connection(
        from_block_type="nft.royalty",
        from_port_name="royalty",
        to_block_type="token.fungible",
        to_port_name="mint"
    )
    assert incompat["compatible"] is False
    assert "Incompatible port types" in incompat["reason"]

def test_validator_rejects_out_of_bounds_properties():
    validator = GraphValidator(catalog_instance)
    invalid_graph = {
        "schemaVersion": "1.0",
        "target": "aptos-move",
        "meta": {"name": "BadToken", "moduleName": "bad_token"},
        "blocks": [
            {
                "id": "b1",
                "type": "token.transfer_fee",
                "props": {
                    "bps": 2000  # max is 1000
                }
            }
        ],
        "edges": []
    }
    res = validator.validate(invalid_graph)
    assert res["valid"] is False
    assert any("exceeds maximum" in err for err in res["errors"])
