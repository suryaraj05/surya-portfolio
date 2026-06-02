# Surya Portfolio (SuryaOS)

Monorepo for the SuryaOS platform:

- `backend/` — FastAPI API (Railway)
- `frontend/` — Next.js site (Vercel)
- `contracts/` — OpenAPI + shared DTOs
- `docs/` — Architecture and deployment guides

## Quick start

**Backend** (`backend/`):

```bash
cp .env.example .env
pip install -e .[dev]
alembic upgrade head
uvicorn app.main:app --reload
```

**Frontend** (`frontend/`):

```bash
cp .env.example .env.local
npm install
npm run dev
```

See `docs/production-deployment-guide.md` for production deployment.
