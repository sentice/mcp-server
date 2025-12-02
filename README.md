# Sentice MCP Server

Овој проект е Model-Context-Protocol (MCP) сервер изграден со TypeScript, Express и официјалниот MCP SDK. Дизајниран е да работи во Docker околина заедно со `mcp-inspector` за лесно тестирање и дебагирање.

Серверот изложува алатка (`users_balance`) која комуницира со посебен backend сервис за преземање на податоци.

## Предуслови

-   [Docker](https://www.docker.com/get-started)
-   [Docker Compose](https://docs.docker.com/compose/install/)

## Како да се започне?

### 1. Креирај `.env` датотека

Во основниот директориум на проектот, креирај датотека со име `.env`. Оваа датотека ќе ги содржи твоите локални околински променливи.

```
# .env
# URL-то на твојот Adonis backend сервис
BACKEND_URL=http://backend:3000/api
```

**Забелешка:** Вредноста `http://backend:3000/api` е точна доколку твојот backend сервис се вика `backend` во истата Docker мрежа. Ако го стартуваш локално, смени ја со соодветната адреса (на пр. `http://localhost:3333/api`).

### 2. Изгради и стартувај со Docker

Користи Docker Compose за да ги изградиш Docker images и да ги стартуваш сервисите:

```bash
docker-compose up --build
```

Оваа команда ќе го направи следново:
-   Ќе го изгради `mcp-server` Docker image-от.
-   Ќе го стартува `sentice-mcp` контејнерот.
-   Ќе го стартува `mcp-inspector` контејнерот.

## Сервиси

-   **MCP Server (`sentice-mcp`)**
    -   Работи на порта `3000`.
    -   MCP ендпоинтот е достапен на `http://localhost:3000/mcp`.
    -   Health check ендпоинтот е на `http://localhost:3000/health`.

-   **MCP Inspector (`mcp-inspector`)**
    -   Корисничкиот интерфејс е достапен на [http://localhost:6274](http://localhost:6274).
    -   Прокси серверот работи на порта `6277`.

Кога ќе го отвориш инспекторот, поврзи го со `mcp-server` користејќи го следново URL: `http://sentice-mcp:3000/mcp`.