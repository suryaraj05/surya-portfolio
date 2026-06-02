from fastapi.testclient import TestClient


def test_login_success(client: TestClient) -> None:
    response = client.post("/api/v1/auth/login", json={"email": "admin@surya.dev", "password": "admin123"})
    assert response.status_code == 200
    assert response.json()["success"] is True
    assert "access_token" in response.json()["data"]
    assert "refresh_token" in response.json()["data"]


def test_login_invalid_password(client: TestClient) -> None:
    response = client.post("/api/v1/auth/login", json={"email": "admin@surya.dev", "password": "bad"})
    assert response.status_code == 401


def test_me_endpoint(client: TestClient, auth_headers: dict[str, str]) -> None:
    response = client.get("/api/v1/auth/me", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["data"]["email"] == "admin@surya.dev"
