# API

## Visao Geral

A API do InfraCare é feita em NestJS e protege quase todas as rotas com JWT e papéis. A exceção pública atual é `GET /health`.

Base local padrão:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`

## Autenticacao

### POST /auth/login

Autentica o usuario e retorna o token de acesso junto com o perfil sanitizado.

Requisicao:

```json
{
  "email": "admin@infracare.local",
  "password": "Admin@123"
}
```

Resposta:

```json
{
  "accessToken": "jwt-token-aqui",
  "user": {
    "id": "usr-admin",
    "name": "Fernanda Lima",
    "email": "admin@infracare.local",
    "role": "ADMIN",
    "unit": "Matriz",
    "status": "OK",
    "summary": "Acesso administrativo completo",
    "updatedAt": "2026-04-18T08:20:00.000Z"
  }
}
```

### GET /auth/me

Retorna os dados do usuario autenticado.

Headers:

- `Authorization: Bearer <token>`

## Healthcheck

### GET /health

Endpoint publico para verificacao operacional.

Resposta:

```json
{
  "status": "ok",
  "service": "InfraCare API",
  "timestamp": "2026-04-18T08:21:00.000Z"
}
```

## Dashboards E Modulos

Todos os endpoints abaixo exigem `Authorization: Bearer <token>`.

### GET /dashboard

Retorna cards e destaques do painel operacional.

Papéis permitidos:

- ADMIN
- ANALYST
- TECHNICIAN
- MANAGER

### GET /assets

Lista os ativos monitorados.

Papéis permitidos:

- ADMIN
- ANALYST
- TECHNICIAN
- MANAGER

### GET /incidents

Lista os incidentes operacionais.

Papéis permitidos:

- ADMIN
- ANALYST
- TECHNICIAN
- MANAGER

### GET /tickets

Lista os chamados em atendimento.

Papéis permitidos:

- ADMIN
- ANALYST
- TECHNICIAN
- MANAGER

### GET /checklists/executions

Lista as execuções de checklists.

Papéis permitidos:

- ADMIN
- ANALYST
- TECHNICIAN
- MANAGER

### GET /sla/indicators

Retorna indicadores consolidados de SLA.

Papéis permitidos:

- ADMIN
- ANALYST
- MANAGER

Resposta resumida:

```json
{
  "totalPolicies": 3,
  "insideSla": 1,
  "outsideSla": 2,
  "outsidePercentage": 66.67,
  "policies": []
}
```

### GET /status-page

Lista o status dos serviços críticos.

Papéis permitidos:

- ADMIN
- ANALYST
- TECHNICIAN
- MANAGER

### GET /reports

Lista relatórios e exportações recentes.

Papéis permitidos:

- ADMIN
- ANALYST
- MANAGER

### GET /audit/logs

Lista eventos de auditoria.

Papéis permitidos:

- ADMIN
- ANALYST

### GET /users

Lista usuários cadastrados na base de demonstração.

Papéis permitidos:

- ADMIN
- ANALYST
- MANAGER

## Regras De Consumo

1. O frontend deve enviar o token no cabeçalho `Authorization` para as rotas protegidas.
2. As respostas atuais usam dados de demonstração em memória.
3. O formato de lista costuma ser um array de objetos com `id`, `name`, `status`, `summary` e `updatedAt`.
4. O contrato pode evoluir para persistência real sem mudar o padrão de autenticação.

## Convencoes

- `GET` para consulta de dados.
- `POST` para login.
- `401` indica token ausente ou invalido.
- `403` indica papel insuficiente.

## Observacao

O backend atual prioriza validação local e documentação de produto. A próxima versão deve detalhar rotas de escrita e mutação quando a persistência real entrar em produção.
