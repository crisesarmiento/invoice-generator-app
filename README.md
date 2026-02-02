# Invoice Studio

Invoice Studio is a modern invoicing web app for freelancers. It supports multi-user authentication, client management, invoice creation with line items, analytics, and server-side PDF export.

## Features
- Email/password authentication with password reset via Resend
- Profile defaults for company info, terms, and notes
- Client management embedded in invoice creation
- Auto-sequential invoice numbers per client
- Dashboard metrics (by client, month, and year)
- Server-generated PDF export
- Light/dark mode with modern UI

## Tech Stack
- Next.js 15 (App Router, Server Actions)
- PostgreSQL + Prisma
- Auth.js (NextAuth) Credentials provider
- shadcn-style UI components + Tailwind CSS
- Vitest + Testing Library (unit tests)
- Playwright (e2e tests)

## Prerequisites
- Node.js 20+
- pnpm 10+
- PostgreSQL (local) or Docker

## Environment Variables
Copy `env.example` to `.env` and update values:

```
cp env.example .env
```

Key variables:
- `DATABASE_URL`
- `AUTH_SECRET` (generate via `openssl rand -base64 32`)
- `AUTH_URL` and `NEXT_PUBLIC_APP_URL`
- `RESEND_API_KEY` and `RESEND_FROM_EMAIL`

## Local Development
Install dependencies:

```
pnpm install
```

Generate Prisma client and run migrations:

```
pnpm --filter @invoice/db db:generate
pnpm --filter @invoice/db db:migrate
```

Run the app:

```
pnpm --filter web dev
```

Open `http://localhost:3000`.

## Docker
Start the app and database:

```
docker compose up --build
```

The app runs at `http://localhost:3000`.

## Testing
Unit tests (80% coverage target):

```
pnpm --filter web test
```

E2E tests:

```
pnpm --filter web test:e2e
```

Playwright requires browser binaries:

```
pnpm --filter web exec playwright install
```

## Production Notes
- Use `docker compose up --build` or build the Docker image via `docker build .`.
- Ensure `AUTH_URL` and `NEXT_PUBLIC_APP_URL` match your deployment domain.
