# Financy

Financy is a personal finance manager built as the final project for the **Rocketseat Postgraduation**. It lets users track their income and expenses, organize transactions by category, and visualize their financial health through a clean dashboard.

## Features

- **Authentication** — register, login, and silent token refresh (JWT access token + rotating refresh token)
- **Dashboard** — monthly balance summary showing total income, total expenses, net balance, and the most-used category
- **Transactions** — create, edit, and delete transactions (income or expense); filter by period, type, category, or text search; paginated table view
- **Categories** — create, edit, and delete custom categories with icon and color; statistics showing total categories, total transactions, and most-used category
- **Profile** — view logged-in user information
- **Per-user isolation** — every query and mutation is scoped to the authenticated user

## Tech Stack

### Backend
- Node.js + Express 5
- TypeScript
- GraphQL (Apollo Server 5 + TypeGraphQL)
- Prisma ORM + SQLite
- JWT authentication with rotating refresh tokens
- typedi for dependency injection

### Frontend
- React 19 + TypeScript
- Vite
- Apollo Client 4 (GraphQL)
- Zustand (auth state with persistence)
- TailwindCSS v4 + Radix UI (Shadcn components)
- React Router v7
- Sonner (toast notifications)
- lucide-react (icons)

---

## Setup & Running

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- [pnpm](https://pnpm.io) 10+

---

### Backend

```bash
cd backend
pnpm install
```

Copy the environment file and fill in the values:

```bash
cp .env.example .env
```

```env
JWT_SECRET=your_secret_here
DATABASE_URL=file:./dev.db
```

Run database migrations and generate the Prisma client:

```bash
pnpm migrate
pnpm generate
```

Start the development server:

```bash
pnpm dev
```

The GraphQL API will be available at **http://localhost:4000/graphql**.

---

### Frontend

```bash
cd frontend
pnpm install
```

Copy the environment file:

```bash
cp .env.example .env
```

```env
VITE_BACKEND_URL=http://localhost:4000/graphql
```

Start the development server:

```bash
pnpm dev
```

The application will be available at **http://localhost:5173**.

> Make sure the backend is running before starting the frontend.
