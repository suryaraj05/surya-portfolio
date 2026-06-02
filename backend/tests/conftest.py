from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient

from app.core.security import create_password_hash
from app.db.session import Base, SessionLocal, engine
from app.main import app
from app.models.common import RoleEnum
from app.models.entities import User


@pytest.fixture(autouse=True)
def reset_db() -> Generator[None, None, None]:
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    db.add(
        User(
            email="admin@surya.dev",
            password_hash=create_password_hash("admin123"),
            role=RoleEnum.SUPER_ADMIN,
            is_active=True,
        )
    )
    db.commit()
    db.close()
    yield


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


@pytest.fixture
def auth_headers(client: TestClient) -> dict[str, str]:
    response = client.post("/api/v1/auth/login", json={"email": "admin@surya.dev", "password": "admin123"})
    token = response.json()["data"]["access_token"]
    return {"Authorization": f"Bearer {token}"}
