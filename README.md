# SRT Todo

Full-stack Todo application scaffold for the SRT intern assignment.

The current codebase includes:

- React/Vite frontend app shell with routing, theme toggle, language switcher, and Todo management UI.
- Express/TypeScript backend foundation with environment validation, health check, shared middleware, Prisma client setup, and Todo database schema.
- Docker Compose setup for local PostgreSQL.

## Tech Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, React Router, Axios, i18next
- Backend: Node.js, Express, TypeScript, Prisma, PostgreSQL, Zod
- Tooling: Docker Compose, Jest, Supertest

## Project Structure

```text
.
+-- front_end/   # React + Vite client
`-- back_end/    # Express + Prisma API foundation
```

## Requirements

- Node.js LTS
- npm
- Docker Desktop, recommended for local PostgreSQL

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

Start PostgreSQL:

```bash
docker compose up -d db
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

## Docker Backend Option

To run the backend API and PostgreSQL together:

```bash
cd back_end
docker compose up --build
```

## Current API Status

Implemented:

| Method | Endpoint  | Description  |
| ------ | --------- | ------------ |
| GET    | `/health` | Health check |

The frontend Todo UI is wired to the following API contract, which should be implemented in the backend Todo module next:

| Method | Endpoint                | Description        |
| ------ | ----------------------- | ------------------ |
| GET    | `/api/todos`            | List todos         |
| GET    | `/api/todos/:id`        | Get todo by ID     |
| POST   | `/api/todos`            | Create todo        |
| PATCH  | `/api/todos/:id`        | Update todo        |
| PATCH  | `/api/todos/:id/toggle` | Toggle todo status |
| DELETE | `/api/todos/:id`        | Delete todo        |

## Git Notes

Do not commit local environment files, dependencies, build output, logs, or generated cache files. The root `.gitignore` excludes those files.
