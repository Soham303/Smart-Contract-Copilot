import pytest
from app.core.graph.catalog import catalog_instance
from app.core.graph.schema import ContractGraph
from app.core.generator.targets.aptos import AptosMoveTarget

def test_deterministic_generator_output():
    graph = ContractGraph(
        meta={"name": "TestToken", "moduleName": "test_token"},
        blocks=[],
        edges=[]
    )
    target = AptosMoveTarget()
    files1, sm1 = target.generate(graph)
    files2, sm2 = target.generate(graph)
    assert files1["Move.toml"] == files2["Move.toml"]
    assert files1["sources/test_token.move"] == files2["sources/test_token.move"]

def test_generator_for_fungible_token_template():
    target = AptosMoveTarget()
    tmpl = catalog_instance.get_template("template_fungible_token")
    assert tmpl is not None
    graph = ContractGraph(**tmpl["graph"])
    files, source_map = target.generate(graph)
    
    assert "Move.toml" in files
    mod_name = graph.meta.moduleName
    assert f"sources/{mod_name}.move" in files
    code = files[f"sources/{mod_name}.move"]
    
    # Verify standard Move tokens and framework calls are in code
    assert f"module copilot_addr::{mod_name}" in code
    assert "primary_fungible_store::create_primary_store_enabled_fungible_asset" in code
    assert "public entry fun mint" in code
    
    # Verify source map mapped the blocks
    sm_dict = source_map.to_dict()
    assert "b1" in sm_dict["blockToLines"]
    assert "b2" in sm_dict["blockToLines"]
    b1_range = sm_dict["blockToLines"]["b1"]
    assert b1_range["startLine"] > 0
    assert b1_range["endLine"] >= b1_range["startLine"]
