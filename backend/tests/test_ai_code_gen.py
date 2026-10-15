import pytest
from app import create_app
from app.core.graph.catalog import catalog_instance

@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_ai_generate_code_endpoint(client):
    tmpl = catalog_instance.get_template("template_fungible_token")
    assert tmpl is not None
    graph = tmpl["graph"]

    response = client.post("/ai/generate-code", json={
        "graph": graph,
        "prompt": "Enforce strict supply cap of 1,000,000 units"
    })

    assert response.status_code == 200
    data = response.get_json()
    assert "files" in data
    assert "sourceMap" in data
    assert "aiReasoning" in data
    assert len(data["aiReasoning"]) >= 4
    assert data["verified"] is True
    assert "Move AI" in data["model"]

    # Check Move.toml and Move code
    files = data["files"]
    assert "Move.toml" in files
    mod_name = graph["meta"]["moduleName"]
    assert f"sources/{mod_name}.move" in files

    move_code = files[f"sources/{mod_name}.move"]
    # Check that prover specifications are injected
    assert "spec module" in move_code
    assert "pragma verify = true" in move_code
