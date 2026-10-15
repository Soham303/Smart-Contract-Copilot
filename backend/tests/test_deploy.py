import pytest
from app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_deploy_payload_generation(client):
    res = client.post("/deploy/payload", json={
        "files": {
            "sources/token.move": "module 0x1::token { struct Coin has key {} }"
        },
        "network": "testnet",
        "moduleName": "token"
    })
    assert res.status_code == 200
    data = res.get_json()
    assert "payload" in data
    assert data["payload"]["function"] == "0x1::code::publish_package_txn"
    assert data["network"] == "testnet"
    assert "codeHash" in data

def test_deploy_record_and_history(client):
    record_res = client.post("/deploy/record", json={
        "projectId": "proj_aptos_test",
        "network": "testnet",
        "address": "0x1234567890abcdef",
        "txHash": "0xdeadbeef12345678",
        "codeHash": "abc1234"
    })
    assert record_res.status_code == 201
    record_data = record_res.get_json()
    assert record_data["deployment"]["txHash"] == "0xdeadbeef12345678"

    history_res = client.get("/deploy/history?projectId=proj_aptos_test")
    assert history_res.status_code == 200
    history_data = history_res.get_json()
    assert history_data["count"] >= 1
    assert any(d["txHash"] == "0xdeadbeef12345678" for d in history_data["deployments"])
