# Todo Backend API

Express/TypeScript backend foundation for the SRT Todo application.

The current backend includes:

- Express app bootstrap with Helmet, CORS, JSON parsing, and centralized error handling.
- Environment validation with Zod.
- Prisma client setup.
- PostgreSQL datasource and `Todo` model schema.
- Health check endpoint.
- Docker Compose setup for local development and test databases.

Todo CRUD routes are not implemented yet. The frontend already targets the `/api/todos` contract, so the next backend step is adding the Todo module routes, validation, service, and repository.

## Tech Stack

- Node.js LTS
- Express 4
- TypeScript
- PostgreSQL
- Prisma ORM
- Zod
- Jest and Supertest
- Docker and Docker Compose

## Structure

```text
back_end/
+-- prisma/
|   `-- schema.prisma
+-- src/
|   +-- common/
|   +-- config/
|   +-- middlewares/
|   +-- routes/
|   +-- types/
|   +-- app.ts
|   `-- server.ts
+-- docker-compose.yml
+-- docker-compose.test.yml
`-- package.json
```

## Environment Variables

Create `back_end/.env`:

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://postgres:password@localhost:5432/todo_dev
DIRECT_URL=postgresql://postgres:password@localhost:5432/todo_dev
CORS_ORIGIN=http://localhost:5173
```

`DATABASE_URL` is required because `postinstall` runs `prisma generate`.

## Local Development

Install dependencies:

```bash
npm install
```

Start PostgreSQL:

```bash
docker compose up -d db
```

Generate Prisma client:

```bash
npm run prisma:generate
```

Start the API:

```bash
npm run dev
```

The API runs on `http://localhost:4000` by default.

## Commands

```bash
npm run dev
npm run build
npm run start
npm test
npm run prisma:generate
npm run prisma:migrate
npm run prisma:deploy
npm run prisma:studio
```

## Docker Local Development

```bash
docker compose up --build
```

This starts the API and a local PostgreSQL database.

## Current Endpoints

| Method | Endpoint  | Description  |
| ------ | --------- | ------------ |
| GET    | `/health` | Health check |

Planned Todo API contract:

| Method | Endpoint                | Description        |
| ------ | ----------------------- | ------------------ |
| GET    | `/api/todos`            | List todos         |
| GET    | `/api/todos/:id`        | Get todo by ID     |
| POST   | `/api/todos`            | Create todo        |
| PATCH  | `/api/todos/:id`        | Update todo        |
| PATCH  | `/api/todos/:id/toggle` | Toggle todo status |
| DELETE | `/api/todos/:id`        | Delete todo        |

## Response Shape

Successful responses follow this shape:

```json
{
  "success": true,
  "message": "OK",
  "data": {}
}
```

Errors follow this shape:

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": {}
  }
}
```

## Next Backend Step

Implement the Todo module:

- Route definitions under `src/routes`.
- Request validation with Zod.
- Controller/service/repository layers.
- Prisma queries for the `Todo` model.
- Unit or integration tests for the Todo API.
