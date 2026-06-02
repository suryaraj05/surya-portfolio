# Surya Portfolio Repository Architecture

## Top-Level Structure

```txt
surya-portfolio/
  backend/      # FastAPI backend service (isolated Python app)
  frontend/     # Next.js frontend app (isolated Node app)
  docs/         # Cross-project architecture and integration docs
  contracts/    # Shared API contracts and DTO artifacts
```

## Backend (`backend/`)

Owns all API runtime concerns:

- FastAPI app source (`app/`)
- Alembic migrations (`alembic/`, `alembic.ini`)
- Python dependency/config (`pyproject.toml`)
- Deployment config (`Dockerfile`, `docker-compose.yml`)
- Backend scripts (`scripts/`)
- Backend environment file (`.env`, `.env.example`)
- Test suite (`tests/`)

Run independently from `backend/`:

- Install: `..\.venv\Scripts\python -m pip install -e .[dev]`
- Start: `..\.venv\Scripts\python -m uvicorn app.main:app --reload`

## Frontend (`frontend/`)

Owns all web runtime concerns:

- Next.js app routes (`app/`)
- UI/component system (`components/`)
- App libraries (`lib/`)
- Local content source (`content/`)
- Frontend scripts (`scripts/`)
- Frontend contracts mirror (`src/contracts/`)
- Frontend environment file (`.env.local`)

Run independently from `frontend/`:

- Install: `npm install`
- Contracts sync: `npm run sync:contracts`
- Dev: `npm run dev`
- Build: `npm run build`

## Shared Contracts (`contracts/`)

Single cross-app contract source:

- `openapi.json` (backend OpenAPI spec)
- `api-contract.md` (human-readable contract guide)
- `types.ts` (frontend-consumable DTOs)

Frontend consumes these via `scripts/sync-contracts.mjs`.

## Docs (`docs/`)

Cross-repository documentation:

- `api-integration-guide.md`
- `frontend-foundation-architecture.md`
- `repository-architecture.md` (this file)

## Isolation Guarantees

- No frontend build/runtime dependency on backend source code modules.
- No backend runtime dependency on frontend source code modules.
- Shared interface boundary is contracts under `contracts/`.
- Each app has its own config, dependency manager, and startup path.

