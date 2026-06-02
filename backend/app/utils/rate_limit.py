from fastapi import HTTPException, Request, status
from redis import RedisError

from app.db.redis_client import redis_client


def enforce_rate_limit(request: Request, key_prefix: str, limit: int, window_seconds: int = 60) -> None:
    client_ip = request.client.host if request.client else "unknown"
    key = f"ratelimit:{key_prefix}:{client_ip}"
    try:
        current = redis_client.incr(key)
        if current == 1:
            redis_client.expire(key, window_seconds)
        if current > limit:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded for {key_prefix}",
            )
    except RedisError:
        # Fail open if Redis is temporarily unavailable.
        return
