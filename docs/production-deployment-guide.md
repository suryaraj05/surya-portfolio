# Production Deployment Guide (SuryaOS)

Target stack:

- Frontend: Vercel (`frontend/`)
- Backend: Railway (`backend/`)
- Database: Neon PostgreSQL
- Redis: Upstash Redis

---

## 1. Environment Variables

Use `docs/production-env.md` as the source of truth.

Quick mapping:

- Vercel: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_URL`
- Railway: app/runtime + security + DB + Redis + CORS + optional S3 variables

---

## 2. Deployment Configuration Files

- Vercel config: `frontend/vercel.json`
- Railway config: `backend/railway.toml`
- Railway start script: `backend/scripts/start_production.py`

`start_production.py` ensures:
1. `alembic upgrade head` runs first
2. API server starts on Railway-provided `PORT`

---

## 3. Verified Production Readiness Checks

### CORS configuration

- Backend reads `CORS_ORIGINS` from environment.
- Middleware now disables credentialed CORS when wildcard origin is used.
- Production recommendation: use explicit origins only.

### Production API URLs

- Frontend API base uses `NEXT_PUBLIC_API_URL`.
- Trailing slash is normalized to prevent `//api/v1/...` URL issues.

### Analytics endpoints

Available and routed under `/api/v1`:

- `POST /analytics/visit`
- `POST /analytics/page-view`
- `POST /analytics/session-end`
- `GET /analytics/dashboard`
- `GET /analytics/visitors`
- `GET /analytics/live`
- `GET /analytics/resume`
- `GET /analytics/clicks`
- `POST /events/click`
- `POST /events/resume-download`

### File upload paths

`POST /api/v1/media/upload` now builds URLs using:

1. `S3_ENDPOINT_URL` (if provided), else
2. `S3_BUCKET` + `S3_REGION`, else
3. local fallback URL

### OpenGraph image URLs

- OpenGraph image values are normalized to absolute URLs.
- Relative OG paths are converted using `NEXT_PUBLIC_SITE_URL`.

### Sitemap generation

- `frontend/app/sitemap.ts` now lists implemented routes:
  - `/`
  - `/architecture`
  - `/projects`
  - `/contact`

### robots.txt

- `frontend/app/robots.ts` returns crawl-allow rules and production sitemap URL.

### Health endpoints

Backend exposes:

- `/health`
- `/readiness`
- `/liveness`
- `/version`
- `/metrics`

### Database migrations in production

- Alembic now uses runtime `DATABASE_URL` from backend settings in `backend/alembic/env.py`.
- Railway start command applies migrations before app boot.

---

## 4. Deploy Sequence

1. Provision Neon database and Upstash Redis.
2. Configure Railway backend env vars and deploy backend.
3. Confirm backend health endpoints.
4. Configure Vercel frontend env vars and deploy frontend.
5. Run post-deploy smoke tests from `docs/deployment-runbook.md`.

---

## 5. Checklists and Operations

- Pre-flight + runtime checklist: `docs/deployment-checklist.md`
- Step-by-step operations runbook: `docs/deployment-runbook.md`

