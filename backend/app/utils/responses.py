from typing import Any

from app.schemas.common import APIErrorPayload, APIErrorResponse, APIResponse


def success_response(message: str, data: Any = None) -> APIResponse:
    return APIResponse(success=True, message=message, data=data if data is not None else {})


def error_response(code: str, message: str) -> APIErrorResponse:
    return APIErrorResponse(success=False, error=APIErrorPayload(code=code, message=message))
