# SRT Todo

Full-stack Todo application scaffold for the SRT intern assignment.

The codebase includes:

- React/Vite frontend with routing, theme toggle, language switcher, and Todo management UI.
- Express/TypeScript backend with environment validation, health check, shared middleware, Prisma client setup, and Todo API module.
- PostgreSQL persistence through Prisma.
- Docker Compose setup for running the backend API and PostgreSQL locally.

## Tech Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, React Router, Axios, i18next
- Backend: Node.js, Express, TypeScript, Prisma, PostgreSQL, Zod
- Tooling: Docker, Docker Compose, Jest, Supertest

## Project Structure

```text
.
+-- front_end/   # React + Vite client
`-- back_end/    # Express + Prisma API
```

## Requirements

- Node.js LTS
- npm
- Docker Desktop

## Backend Setup

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

Start PostgreSQL with Docker:

```bash
docker compose up -d db
```

Apply Prisma migrations:

```bash
npm run prisma:migrate
```

Generate Prisma client:

```bash
npm run prisma:generate
```

Start the backend API:

```bash
npm run dev
```

The backend runs at `http://localhost:4000`.

## Frontend Setup

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

The frontend runs at `http://localhost:5173`.

## Docker Backend Option

Use this mode when you want Docker to run both the backend API and PostgreSQL.
Do not run `npm run dev` at the same time, because both modes use port `4000`.

```bash
cd back_end
docker compose up -d db
docker compose run --rm migrate
docker compose up api
```

What these commands do:

- `docker compose up -d db` starts the PostgreSQL container.
- `docker compose run --rm migrate` applies Prisma migrations and creates the database tables.
- `docker compose up api` starts the backend API container.

The backend API will be available at:

```text
http://localhost:4000
```

Health check:

```bash
curl http://localhost:4000/health
```

List todos:

```bash
curl http://localhost:4000/api/todos
```

Stop containers:

```bash
docker compose down
```

Reset the local Docker database:

```bash
docker compose down -v
```

Use `docker compose down -v` only when you want to delete the local PostgreSQL data volume.

## Common Commands

Backend:

```bash
cd back_end
npm run dev
npm run build
npm run start
npm test
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

## API Endpoints

| Method | Endpoint                | Description                                 |
| ------ | ----------------------- | ------------------------------------------- |
| GET    | `/health`               | Health check                                |
| GET    | `/api/todos`            | List todos with search, filter, pagination  |
| GET    | `/api/todos/:id`        | Get todo by ID                              |
| POST   | `/api/todos`            | Create todo                                 |
| PATCH  | `/api/todos/:id`        | Update todo                                 |
| PATCH  | `/api/todos/:id/toggle` | Toggle todo status                          |
| DELETE | `/api/todos/:id`        | Delete todo                                 |

## Git Notes

Do not commit local environment files, dependencies, build output, logs, or generated cache files. The root `.gitignore` excludes those files.
