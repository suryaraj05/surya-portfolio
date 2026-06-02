# SuryaOS Core

Production-grade API-first backend for:
- Portfolio website
- Android admin app
- AI agent integrations

## Stack
- FastAPI + Python 3.12
- PostgreSQL + SQLAlchemy + Alembic
- Redis caching and live metrics
- JWT auth (access/refresh)
- Docker + Compose
- Pytest + coverage

## Run (local venv)
1. Copy env:
   - `cp .env.example .env` (or create manually on Windows)
2. Install:
   - `..\.venv\Scripts\python -m pip install -e .[dev]` (if your `.venv` is one folder above)
3. Start API:
   - `..\.venv\Scripts\python -m uvicorn app.main:app --reload`

## Docker
- `docker compose up --build`

## Migrations
- Generate revision: `alembic revision --autogenerate -m "message"`
- Apply migrations: `alembic upgrade head`
- Rollback one step: `alembic downgrade -1`

## API Base
- `/api/v1`
- Version strategy:
  - Stable production namespace: `/api/v1`
  - Future-compatible namespace: `/api/v2`

## Integration Assets
- OpenAPI contract: `../contracts/openapi.json`
- API contract doc: `../contracts/api-contract.md`
- Integration guide: `../docs/api-integration-guide.md`
- Frontend DTO/types: `../contracts/types.ts`
- Postman collection: `../collections/postman_collection.json`
- Bruno collection: `../collections/bruno_collection.json`
- Insomnia collection: `../collections/insomnia_collection.json`

## Utility Scripts
- Export OpenAPI: `..\.venv\Scripts\python scripts\export_openapi.py`
- Seed baseline data: `..\.venv\Scripts\python scripts\seed.py`
- Generate demo analytics data: `..\.venv\Scripts\python scripts\generate_demo_data.py`
