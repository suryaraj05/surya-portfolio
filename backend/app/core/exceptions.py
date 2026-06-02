from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from app.utils.responses import error_response


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(HTTPException)
    async def http_exception_handler(_: Request, exc: HTTPException) -> JSONResponse:
        payload = error_response(code=f"HTTP_{exc.status_code}", message=str(exc.detail))
        return JSONResponse(status_code=exc.status_code, content=payload.model_dump())

    @app.exception_handler(ValidationError)
    async def validation_exception_handler(_: Request, exc: ValidationError) -> JSONResponse:
        payload = error_response(code="VALIDATION_ERROR", message=str(exc.errors()))
        return JSONResponse(status_code=422, content=payload.model_dump())

    @app.exception_handler(SQLAlchemyError)
    async def sqlalchemy_exception_handler(_: Request, __: SQLAlchemyError) -> JSONResponse:
        payload = error_response(code="DATABASE_ERROR", message="Database error")
        return JSONResponse(status_code=500, content=payload.model_dump())

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(_: Request, __: Exception) -> JSONResponse:
        payload = error_response(code="INTERNAL_SERVER_ERROR", message="Internal server error")
        return JSONResponse(status_code=500, content=payload.model_dump())
