# SRT Todo

Full-stack Todo List Management application for the SRT intern assignment.

The project includes a React/Vite frontend, an Express/TypeScript backend, PostgreSQL persistence through Prisma, validation, centralized error handling, unit tests, and GitHub Actions CI.

## Features

- View the todo list.
- Create a new todo.
- Edit an existing todo.
- Delete a todo.
- Toggle a todo between pending and completed.
- Search todos by title or description.
- Filter todos by status.
- Paginate and sort todo data.
- Display loading, empty, and error states in the UI.
- Show success/error feedback for create, update, toggle, and delete actions.
- Support light/dark theme and English/Vietnamese UI text.

## Tech Stack

Frontend:

- React 19, Vite, TypeScript
- React Router
- Tailwind CSS
- Radix UI Dialog
- Ant Design Pagination
- React Hook Form and Zod
- Axios
- i18next / react-i18next
- Sonner toast notifications

Backend:

- Node.js, Express, TypeScript
- Prisma ORM
- PostgreSQL
- Zod request validation
- Helmet and CORS
- Jest and Supertest

Tooling:

- GitHub Actions CI
- Docker and Docker Compose for optional local backend/database container usage

## Project Structure

```text
.
+-- back_end/       # Express + Prisma API
+-- front_end/      # React + Vite client
`-- .github/        # CI workflow
```

## Requirements

- Node.js LTS
- npm
- PostgreSQL database
- Docker Desktop, optional, if you want to run PostgreSQL/backend with Docker

## Backend Setup

Install dependencies:

```bash
cd back_end
npm install
```

Create `back_end/.env`:

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://postgres:password@localhost:5432/todo_dev
DIRECT_URL=postgresql://postgres:password@localhost:5432/todo_dev
CORS_ORIGIN=http://localhost:5173
```

Start a PostgreSQL database locally. If using Docker for the database:

```bash
docker compose up -d db
```

If your machine uses the legacy Compose CLI, use `docker-compose` instead of `docker compose`.

Apply Prisma migrations:

```bash
npm run prisma:migrate
```

Generate the Prisma client:

```bash
npm run prisma:generate
```

Start the backend API:

```bash
npm run dev
```

The backend runs at:

```text
http://localhost:4000
```

## Frontend Setup

Install dependencies:

```bash
cd front_end
npm install
```

Create `front_end/.env`:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

Start the frontend:

```bash
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

## API Endpoints

Base URL:

```text
http://localhost:4000
```

| Method | Endpoint                | Description                                      |
| ------ | ----------------------- | ------------------------------------------------ |
| GET    | `/health`               | Health check                                     |
| GET    | `/api/todos`            | List todos with search, status filter, and paging |
| GET    | `/api/todos/:id`        | Get one todo by ID                               |
| POST   | `/api/todos`            | Create a todo                                    |
| PATCH  | `/api/todos/:id`        | Update a todo                                    |
| PATCH  | `/api/todos/:id/toggle` | Toggle pending/completed status                  |
| DELETE | `/api/todos/:id`        | Delete a todo                                    |

### List Query Parameters

`GET /api/todos` supports:

| Query       | Description                                      |
| ----------- | ------------------------------------------------ |
| `search`    | Search in title and description                  |
| `status`    | `PENDING` or `COMPLETED`                         |
| `page`      | Page number                                      |
| `limit`     | Page size                                        |
| `sortBy`    | `createdAt`, `title`, or `status`                |
| `sortOrder` | `asc` or `desc`                                  |

Example:

```bash
curl "http://localhost:4000/api/todos?search=report&status=PENDING&page=1&limit=10"
```

## Response Shape

Successful responses:

```json
{
  "success": true,
  "message": "Todo created successfully",
  "data": {}
}
```

Validation or runtime errors:

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

Paginated list responses include `items` and `meta`:

```json
{
  "success": true,
  "message": "Todos fetched successfully",
  "data": {
    "items": [],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 0,
      "totalPages": 0
    }
  }
}
```

## Validation Commands

Backend:

```bash
cd back_end
npm test
npm run test:coverage
npm run build
```

Frontend:

```bash
cd front_end
npm run typecheck
npm run build
```

The backend test suite covers the todo service, controller, validation schemas, middleware, and pagination utility.

## Optional Docker Backend

Use this mode if you want Docker to run both PostgreSQL and the backend API.
Do not run `npm run dev` at the same time, because both modes use port `4000`.

```bash
cd back_end
docker compose up -d db
docker compose run --rm migrate
docker compose up api
```

What these commands do:

- `docker compose up -d db` starts PostgreSQL.
- `docker compose run --rm migrate` applies Prisma migrations.
- `docker compose up api` starts the backend API container.

Stop containers:

```bash
docker compose down
```

Reset local Docker database data:

```bash
docker compose down -v
```

Use `docker compose down -v` only when you intentionally want to delete the local PostgreSQL volume.

## CI

GitHub Actions is configured in `.github/workflows/ci.yml`.

The workflow runs on pushes and pull requests to `dev` and `main`:

- Backend: `npm ci`, `npm test`, `npm run build`
- Frontend: `npm ci`, `npm run typecheck`, `npm run build`
- Docker: backend Docker image build

## Common Commands

Backend:

```bash
cd back_end
npm run dev
npm run build
npm run start
npm test
npm run test:coverage
npm run prisma:studio
```

Frontend:

```bash
cd front_end
npm run dev
npm run build
npm run preview
npm run typecheck
```

## Notes

- Environment files, dependencies, build output, logs, and generated cache files should not be committed.
- The backend expects the frontend origin to match `CORS_ORIGIN`.
- The frontend expects `VITE_API_BASE_URL` to include the backend `/api` prefix.
