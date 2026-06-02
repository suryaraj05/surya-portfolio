from fastapi.testclient import TestClient


def test_blogs_crud_and_filter(client: TestClient, auth_headers: dict[str, str]) -> None:
    payload = {
        "title": "FastAPI at scale",
        "slug": "fastapi-scale",
        "excerpt": "scaling notes",
        "content": "full content",
        "tags": ["fastapi"],
        "categories": ["backend"],
        "published": True,
    }
    create = client.post("/api/v1/blogs", json=payload, headers=auth_headers)
    assert create.status_code == 200
    blog_id = create.json()["data"]["id"]

    listing = client.get("/api/v1/blogs?published=true&search=scale")
    assert listing.status_code == 200
    assert listing.json()["data"]["pagination"]["total"] >= 1

    get_resp = client.get("/api/v1/blogs/fastapi-scale")
    assert get_resp.status_code == 200

    update = client.put(f"/api/v1/blogs/{blog_id}", json={"excerpt": "updated"}, headers=auth_headers)
    assert update.status_code == 200
    assert update.json()["data"]["excerpt"] == "updated"

    delete = client.delete(f"/api/v1/blogs/{blog_id}", headers=auth_headers)
    assert delete.status_code == 200
