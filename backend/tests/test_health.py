from fastapi.testclient import TestClient

from app.main import app


def test_liveness() -> None:
    client = TestClient(app)
    response = client.get("/liveness")
    assert response.status_code == 200
    assert response.json()["data"]["status"] == "alive"


def test_readiness() -> None:
    client = TestClient(app)
    response = client.get("/readiness")
    assert response.status_code == 200
    assert response.json()["data"]["status"] == "ready"
