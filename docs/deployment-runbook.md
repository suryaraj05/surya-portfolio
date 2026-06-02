# Deployment Runbook

## 1) Deploy Backend to Railway

1. Create a Railway project for `backend/`.
2. Connect repository and set service root to `backend`.
3. Railway will use `backend/railway.toml`.
4. Add required backend environment variables from `docs/production-env.md`.
5. Trigger deployment.
6. Confirm startup logs include successful Alembic migration run.
7. Validate:
   - `GET /health`
   - `GET /readiness`
   - `GET /liveness`
   - `GET /version`
   - `GET /metrics`

## 2) Provision Neon PostgreSQL

1. Create production Neon project/database.
2. Copy pooled connection string into Railway `DATABASE_URL`.
3. Ensure SSL mode is enabled in URL.
4. Redeploy Railway service.
5. Confirm tables exist after migration.

## 3) Provision Upstash Redis

1. Create Upstash Redis instance.
2. Copy Redis URL into Railway `REDIS_URL`.
3. Redeploy Railway service.
4. Verify analytics live counters and rate limiting continue working.

## 4) Deploy Frontend to Vercel

1. Create Vercel project for `frontend/`.
2. Ensure build uses `frontend/vercel.json`.
3. Add:
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_API_URL` (Railway public URL)
4. Deploy.
5. Validate:
   - `/`
   - `/projects`
   - `/projects/[slug]`
   - `/architecture`
   - `/contact`
   - `/robots.txt`
   - `/sitemap.xml`

## 5) Post-Deploy Smoke Tests

1. Submit one contact form entry from production UI.
2. Trigger analytics events by visiting pages and clicking tracked links.
3. Query backend analytics endpoints:
   - `POST /api/v1/analytics/visit`
   - `POST /api/v1/analytics/page-view`
   - `POST /api/v1/events/click`
   - `GET /api/v1/analytics/dashboard`
4. Confirm CORS allows frontend origin and blocks unknown origins.
5. Confirm OpenGraph card generation uses absolute URLs.

## 6) Rollback Procedure

1. Roll back Vercel deployment to last healthy version.
2. Roll back Railway deployment to last healthy release.
3. If migration introduced issue:
   - create corrective migration
   - deploy backend with fixed migration
4. Re-run smoke tests.
