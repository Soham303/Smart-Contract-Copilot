import pytest
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
