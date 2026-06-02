from fastapi import HTTPException, Request, status
from starlette.middleware.base import BaseHTTPMiddleware


class RequestValidationMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.method in {"POST", "PUT", "PATCH"}:
            content_length = request.headers.get("content-length")
            if content_length in (None, "0"):
                return await call_next(request)
            content_type = request.headers.get("content-type", "")
            if "application/json" not in content_type and "multipart/form-data" not in content_type:
                raise HTTPException(
                    status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                    detail="Unsupported content type",
                )
            if content_length and int(content_length) > 2_000_000:
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail="Request payload too large",
                )
        return await call_next(request)
