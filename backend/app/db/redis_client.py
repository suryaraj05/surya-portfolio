import redis

from app.core.config import get_settings

settings = get_settings()
redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)


def redis_get(key: str) -> str | None:
    try:
        return redis_client.get(key)
    except redis.RedisError:
        return None


def redis_setex(key: str, ttl_seconds: int, value: str) -> None:
    try:
        redis_client.setex(key, ttl_seconds, value)
    except redis.RedisError:
        return


def redis_delete(*keys: str) -> None:
    try:
        if keys:
            redis_client.delete(*keys)
    except redis.RedisError:
        return


def redis_hlen(name: str) -> int:
    try:
        return int(redis_client.hlen(name))
    except redis.RedisError:
        return 0
