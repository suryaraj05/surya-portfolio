from fastapi.testclient import TestClient


def test_contact_flow_and_notifications(client: TestClient, auth_headers: dict[str, str]) -> None:
    contact_payload = {
        "name": "Surya",
        "email": "surya@example.com",
        "company": "SuryaOS",
        "role": "Founder",
        "message": "hello",
        "source_page": "/contact",
    }
    response = client.post("/api/v1/contact", json=contact_payload)
    assert response.status_code == 200

    contacts = client.get("/api/v1/admin/contact?search=surya", headers=auth_headers)
    assert contacts.status_code == 200
    assert contacts.json()["data"]["pagination"]["total"] >= 1
    contact_id = contacts.json()["data"]["items"][0]["id"]

    mark = client.put(f"/api/v1/admin/contact/{contact_id}?status_value=READ", headers=auth_headers)
    assert mark.status_code == 200

    notifications = client.get("/api/v1/notifications", headers=auth_headers)
    assert notifications.status_code == 200
    notif_items = notifications.json()["data"]["items"]
    assert len(notif_items) >= 1
    notif_id = notif_items[0]["id"]

    read = client.put(f"/api/v1/notifications/{notif_id}/read", headers=auth_headers)
    assert read.status_code == 200
