# SuryaOS Core API Contract

## Base URLs
- Local: `http://localhost:8000`
- Versioned API: `/api/v1`

## Standard Success Response
```json
{
  "success": true,
  "message": "Human-readable status",
  "data": {}
}
```

## Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Failure details"
  }
}
```

## Auth Contract
- `POST /api/v1/auth/login`
  - Request: `{ "email": "admin@suryaos.dev", "password": "Admin@123" }`
  - Response `data`: `TokenPair`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

## Core Lists Contract
- Supports query params where applicable:
  - `page`, `page_size`
  - `sort_by`, `sort_order`
  - `search`
  - module-specific filters (`featured`, `published`, `status`, etc.)

## Cursor Endpoints
- `GET /api/v1/analytics/visitors?cursor=<id>&limit=<n>`
- `GET /api/v1/analytics/clicks?cursor=<id>&limit=<n>`
- `GET /api/v1/dashboard/recent-events?cursor=<id>&limit=<n>`

## Monitoring
- `GET /health`
- `GET /liveness`
- `GET /readiness`
- `GET /metrics`
- `GET /version`
