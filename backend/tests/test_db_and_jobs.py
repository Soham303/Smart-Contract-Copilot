import pytest
from app.core.db.repository import db_repo

def test_db_user_creation_and_retrieval():
    email = "new_builder@aptos.test"
    pwd_hash = "fakehash123"
    created = db_repo.create_user(email, pwd_hash, name="New Builder")
    assert created["id"] is not None
    assert created["email"] == email

    retrieved = db_repo.get_user_by_email(email)
    assert retrieved is not None
    assert retrieved["name"] == "New Builder"

def test_db_project_crud_and_versioning():
    user = db_repo.create_user("founder@test.io", "pwd123", name="Founder")
    user_id = user["id"]

    initial_graph = {
        "schemaVersion": "1.0",
        "meta": {"name": "FounderCoin", "moduleName": "founder_coin"},
        "blocks": [{"id": "b1", "type": "token.fungible", "props": {}}],
        "edges": []
    }

    # Create project
    proj = db_repo.create_project(user_id, "Founder Coin", mode="blocks", initial_graph=initial_graph)
    assert proj["id"] is not None
    assert proj["currentGraphId"] is not None

    # Retrieve project
    fetched = db_repo.get_project(proj["id"])
    assert fetched["name"] == "Founder Coin"

    # Latest graph
    latest_graph = db_repo.get_latest_graph_version(proj["id"])
    assert latest_graph is not None
    assert latest_graph["graph"]["meta"]["name"] == "FounderCoin"

    # Save new graph version (autosave)
    updated_graph = dict(initial_graph)
    updated_graph["meta"]["name"] = "FounderCoinV2"
    v2 = db_repo.save_graph_version(proj["id"], updated_graph)
    assert v2["id"] != latest_graph["id"]

    # Verify latest graph is now V2
    latest_v2 = db_repo.get_latest_graph_version(proj["id"])
    assert latest_v2["graph"]["meta"]["name"] == "FounderCoinV2"

    # List projects
    projs = db_repo.list_projects(user_id)
    assert len(projs) >= 1

    # Delete project
    deleted = db_repo.delete_project(proj["id"])
    assert deleted is True
    assert db_repo.get_project(proj["id"]) is None

def test_job_lifecycle():
    job = db_repo.create_job("proj_1", "compile")
    assert job["id"] is not None
    assert job["status"] == "queued"

    db_repo.update_job(job["id"], status="processing", progress=50, message="Compiling bytecode...")
    in_flight = db_repo.get_job(job["id"])
    assert in_flight["status"] == "processing"
    assert in_flight["progress"] == 50

    db_repo.update_job(job["id"], status="completed", progress=100, result={"success": True})
    completed = db_repo.get_job(job["id"])
    assert completed["status"] == "completed"
    assert completed["result"]["success"] is True
