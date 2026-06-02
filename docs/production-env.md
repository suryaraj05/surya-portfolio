# Production Environment Variables

## Frontend (Vercel)

Set these in Vercel Project Settings -> Environment Variables:

- `NEXT_PUBLIC_SITE_URL`  
  Public website URL (example: `https://suryaos.com`)
- `NEXT_PUBLIC_API_URL`  
  Railway backend base URL (example: `https://suryaos-core.up.railway.app`)

## Backend (Railway)

Set these in Railway service variables:

- `APP_NAME=SuryaOS Core`
- `ENV=production`
- `API_V1_PREFIX=/api/v1`
- `API_VERSION=1.0.0`
- `SECRET_KEY=<strong-random-secret>`
- `ALGORITHM=HS256`
- `ACCESS_TOKEN_EXPIRE_MINUTES=30`
- `REFRESH_TOKEN_EXPIRE_MINUTES=10080`
- `DATABASE_URL=<Neon pooled PostgreSQL URL>`
- `REDIS_URL=<Upstash Redis URL>`
- `CORS_ORIGINS=["https://suryaos.com","https://www.suryaos.com"]`
- `RATE_LIMIT_LOGIN_PER_MINUTE=10`
- `RATE_LIMIT_CONTACT_PER_MINUTE=20`
- `RATE_LIMIT_ANALYTICS_PER_MINUTE=120`
- `CACHE_TTL_SECONDS=300`

Optional media storage variables:

- `S3_BUCKET`
- `S3_REGION`
- `S3_ENDPOINT_URL`
- `S3_ACCESS_KEY`
- `S3_SECRET_KEY`

Use either:
- `S3_ENDPOINT_URL` for S3-compatible providers, or
- `S3_BUCKET` + `S3_REGION` for AWS S3 URL generation.

## Neon Notes

- Use SSL-enabled Neon connection string.
- Use the pooled URL for app runtime traffic.
- Use the same `DATABASE_URL` for app and Alembic migrations.

## Upstash Notes

- Use Redis URL format accepted by `redis-py`.
- Keep TLS enabled in production URL.
