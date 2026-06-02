import structlog
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

logger = structlog.get_logger()


class RequestLogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        logger.info(
            "request",
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            client=str(request.client.host if request.client else ""),
        )
        return response
