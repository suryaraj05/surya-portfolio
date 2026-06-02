from fastapi.testclient import TestClient


def test_analytics_and_dashboard(client: TestClient, auth_headers: dict[str, str]) -> None:
    visit = {
        "session_id": "sess_1",
        "ip_hash": "hash1",
        "country": "IN",
        "city": "Bengaluru",
        "device": "mobile",
        "browser": "chrome",
        "os": "android",
        "landing_page": "/",
    }
    r1 = client.post("/api/v1/analytics/visit", json=visit)
    assert r1.status_code == 200

    page_view = {"event_type": "page_view", "visitor_id": "sess_1", "metadata": {"path": "/projects"}}
    r2 = client.post("/api/v1/analytics/page-view", json=page_view)
    assert r2.status_code == 200

    click = {"event_type": "github_click", "visitor_id": "sess_1", "metadata": {"target": "github"}}
    r3 = client.post("/api/v1/events/click", json=click)
    assert r3.status_code == 200

    visitors = client.get("/api/v1/analytics/visitors?limit=10&country=IN&search=sess")
    assert visitors.status_code == 200
    assert len(visitors.json()["data"]["items"]) >= 1

    clicks = client.get("/api/v1/analytics/clicks?limit=10")
    assert clicks.status_code == 200
    assert "summary" in clicks.json()["data"]

    overview = client.get("/api/v1/dashboard/overview")
    assert overview.status_code == 200
    assert "events" in overview.json()["data"]

    recent = client.get("/api/v1/dashboard/recent-events?limit=5")
    assert recent.status_code == 200
    assert "events" in recent.json()["data"]
