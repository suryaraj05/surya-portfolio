# Deployment Checklist

## Pre-Deploy

- [ ] Frontend builds locally from `frontend/` with `npm run build`
- [ ] Backend imports and starts from `backend/`
- [ ] `DATABASE_URL` points to Neon production database
- [ ] `REDIS_URL` points to Upstash production instance
- [ ] `CORS_ORIGINS` includes only trusted frontend domains
- [ ] `NEXT_PUBLIC_API_URL` points to Railway backend public URL
- [ ] `NEXT_PUBLIC_SITE_URL` matches canonical production domain
- [ ] `SECRET_KEY` is rotated from default
- [ ] No development URLs remain in deployment variables

## Backend (Railway)

- [ ] `railway.toml` present with `/health` healthcheck
- [ ] Start command runs migrations before app boot (`python scripts/start_production.py`)
- [ ] Railway variables are set for all required backend env values
- [ ] `/health`, `/readiness`, `/liveness`, `/version`, `/metrics` are reachable

## Frontend (Vercel)

- [ ] `vercel.json` present
- [ ] Root directory configured to `frontend`
- [ ] Vercel environment variables set for production
- [ ] Production build completes on Vercel
- [ ] `robots.txt` and `sitemap.xml` resolve correctly

## Runtime Validation

- [ ] Homepage loads with no API CORS errors
- [ ] Projects list and project detail pages fetch backend data
- [ ] Contact form submission succeeds against production API
- [ ] Analytics ingestion endpoints return success
- [ ] OpenGraph previews resolve with absolute image URLs
- [ ] Media upload URLs point to configured storage endpoint
