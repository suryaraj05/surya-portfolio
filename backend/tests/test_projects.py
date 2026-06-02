from fastapi.testclient import TestClient


def test_projects_crud_and_list(client: TestClient, auth_headers: dict[str, str]) -> None:
    payload = {
        "title": "SuryaOS",
        "slug": "suryaos",
        "short_description": "Core platform",
        "full_description": "Long desc",
        "problem": "Scale",
        "solution": "Modular API",
        "architecture": "Clean",
        "tech_stack": ["FastAPI"],
        "featured": True,
        "status": "published",
        "gallery_images": [],
    }
    create = client.post("/api/v1/projects", json=payload, headers=auth_headers)
    assert create.status_code == 200
    project_id = create.json()["data"]["id"]

    list_resp = client.get("/api/v1/projects?page=1&page_size=10&search=Surya&featured=true&status=published")
    assert list_resp.status_code == 200
    assert list_resp.json()["data"]["pagination"]["total"] == 1

    get_resp = client.get("/api/v1/projects/suryaos")
    assert get_resp.status_code == 200

    update = client.put(f"/api/v1/projects/{project_id}", json={"title": "SuryaOS Core"}, headers=auth_headers)
    assert update.status_code == 200
    assert update.json()["data"]["title"] == "SuryaOS Core"

    delete = client.delete(f"/api/v1/projects/{project_id}", headers=auth_headers)
    assert delete.status_code == 200
