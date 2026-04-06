# API

## Auth
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

## Dashboard
- `GET /dashboard`

## Domínio
- `GET/POST/PATCH /assets`
- `GET/POST/PATCH /incidents`
- `GET/POST/PATCH /tickets`
- `GET /checklists/executions`
- `PATCH /checklists/executions/:id/complete`

## Relatórios
- `GET /reports`
- `GET /reports/export?type=incidents|tickets|checklists`
