# Frontend Integration Guide

## Quick Start
1. Start backend.
2. Open Swagger: `http://localhost:8000/docs`
3. Import generated types from `generated/types.ts`.
4. Use OpenAPI contract from `contracts/openapi.json` (export with `scripts/export_openapi.py`).

## Auth Flow
1. Login via `/api/v1/auth/login`
2. Store `access_token` and `refresh_token`
3. Attach `Authorization: Bearer <access_token>`
4. Refresh via `/api/v1/auth/refresh` when expired

## Response Handling
- Always parse envelope:
  - success: `response.success === true`
  - fail: `response.success === false`
- Read `response.message` for user-friendly notification.

## Pagination Patterns
- Offset lists return:
  - `data.items`
  - `data.pagination`
- Cursor lists return:
  - `data.items`
  - `data.next_cursor`

## Seed + Demo Data
- `python scripts/seed.py`
- `python scripts/generate_demo_data.py`

## Collection Imports
- Postman: `collections/postman_collection.json`
- Insomnia: `collections/insomnia_collection.json`
- Bruno: `collections/bruno_collection.json`
