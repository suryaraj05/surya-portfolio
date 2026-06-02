import json
from typing import Any

from app.core.config import get_settings
from app.db.redis_client import redis_delete, redis_get, redis_setex

settings = get_settings()


def cache_get_json(key: str) -> Any | None:
    value = redis_get(key)
    if not value:
        return None
    try:
        return json.loads(value)
    except json.JSONDecodeError:
        return None


def cache_set_json(key: str, payload: Any, ttl_seconds: int | None = None) -> None:
    redis_setex(key, ttl_seconds or settings.CACHE_TTL_SECONDS, json.dumps(payload, default=str))


def cache_invalidate(prefix: str) -> None:
    # Prefix invalidation is intentionally coarse for compatibility and simplicity.
    # Current routes use stable keys, so invalidate known keys explicitly.
    if prefix == "projects":
        redis_delete("projects:list")
    elif prefix == "blogs":
        redis_delete("blogs:list")
    elif prefix == "settings":
        redis_delete("settings:singleton")
    elif prefix == "dashboard":
        redis_delete("dashboard:overview")
