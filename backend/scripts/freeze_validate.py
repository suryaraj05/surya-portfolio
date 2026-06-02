import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from fastapi.testclient import TestClient
from sqlalchemy import create_engine, inspect, text

from app.main import app


def run() -> None:
    client = TestClient(app)
    summary: dict = {}

    # Core endpoint checks
    health = client.get("/health")
    ready = client.get("/readiness")
    live = client.get("/liveness")
    version = client.get("/version")
    openapi = client.get("/openapi.json")

    summary["health_status_codes"] = {
        "health": health.status_code,
        "readiness": ready.status_code,
        "liveness": live.status_code,
        "version": version.status_code,
        "openapi": openapi.status_code,
    }

    # Route count
    api_routes = [r for r in app.routes if hasattr(r, "path") and "/openapi" not in r.path]
    summary["routes_count"] = len(api_routes)

    # DB table count
    engine = create_engine("sqlite:///./freeze_validation.db")
    insp = inspect(engine)
    tables = insp.get_table_names()
    summary["tables_count"] = len(tables)
    summary["tables"] = sorted(tables)

    # Audit log verification
    client.post("/api/v1/contact", json={"name": "Freeze", "email": "freeze@example.com", "message": "audit-check"})
    with engine.connect() as conn:
        audit_count = conn.execute(text("select count(*) from audit_logs")).scalar_one()
        event_count = conn.execute(text("select count(*) from events")).scalar_one()
        project_count = conn.execute(text("select count(*) from projects")).scalar_one()
        blog_count = conn.execute(text("select count(*) from blogs")).scalar_one()
        setting_count = conn.execute(text("select count(*) from settings")).scalar_one()
        notif_count = conn.execute(text("select count(*) from notifications")).scalar_one()
        user_count = conn.execute(text("select count(*) from users")).scalar_one()
        visitor_count = conn.execute(text("select count(*) from visitors")).scalar_one()

    summary["seeded_entities"] = {
        "users": user_count,
        "projects": project_count,
        "blogs": blog_count,
        "settings": setting_count,
        "notifications": notif_count,
        "visitors": visitor_count,
        "events": event_count,
    }
    summary["audit_logs_written"] = audit_count > 0
    summary["analytics_events_exist"] = event_count > 0

    # Type contract quick-check
    ts_types = Path("generated/types.ts").read_text(encoding="utf-8")
    summary["typescript_contracts"] = {
        "has_api_success": "interface ApiSuccess" in ts_types,
        "has_project_dto": "interface ProjectDTO" in ts_types,
        "has_blog_dto": "interface BlogDTO" in ts_types,
        "has_contact_dto": "interface ContactDTO" in ts_types,
    }

    # Redis cache behavior probe (non-fatal if Redis absent)
    from app.db.redis_client import redis_client
    from redis import RedisError

    try:
        client.get("/api/v1/projects")
        keys = redis_client.keys("projects*")
        summary["redis_cache_keys_found"] = len(keys)
        summary["redis_available"] = True
    except RedisError:
        summary["redis_cache_keys_found"] = 0
        summary["redis_available"] = False

    print(json.dumps(summary, indent=2, default=str))


if __name__ == "__main__":
    run()
