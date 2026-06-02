from datetime import datetime, timezone

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from app.db.session import SessionLocal
from app.models.entities import AuditLog


class AuditLogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        if request.method in {"POST", "PUT", "DELETE", "PATCH"}:
            db = SessionLocal()
            try:
                db.add(
                    AuditLog(
                        actor="anonymous",
                        action=f"{request.method} {request.url.path}",
                        entity_type="http_request",
                        entity_id=None,
                        metadata_json={
                            "status_code": response.status_code,
                            "query": dict(request.query_params),
                        },
                        created_at=datetime.now(timezone.utc),
                    )
                )
                db.commit()
            finally:
                db.close()
        return response
