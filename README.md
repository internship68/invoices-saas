# InvoiceFlow Monorepo

InvoiceFlow is a full-stack invoicing app for freelancers: create invoices, mark paid, and generate receipts with Thai-ready support.

This is the **single source of truth** README for the entire project (frontend + backend).

## Project Structure

```text
invoices-saas/
  backend/                 # NestJS API + TypeORM + PostgreSQL
    src/
      auth/
      clients/
      invoices/
      receipts/
      settings/
      users/
      workspaces/
      common/              # shared backend types/utilities
  frontend/                # React + Vite + TypeScript app
    src/
      pages/
      components/
      lib/
      hooks/
```

## Tech Stack

- Frontend: React, Vite, TypeScript, Tailwind, shadcn/ui, TanStack Query
- Backend: NestJS, TypeORM, PostgreSQL
- Auth: JWT (Bearer token)

## Local Development

### 1) Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2) Configure environment variables

Create env files from examples:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Required values:

- `backend/.env`
  - `DATABASE_URL`
  - `DB_SSL` (`true` or `false`)
  - `JWT_SECRET`
  - `PORT` (optional, default `3000`)
- `frontend/.env`
  - `VITE_API_URL` (example: `http://localhost:3000/api/v1`)

### 3) Run apps

Backend:

```bash
cd backend
npm run start:dev
```

Frontend:

```bash
cd frontend
npm run dev
```

App URLs:

- Landing page: `/`
- Main app: `/invoices`
- API base: `/api/v1`

## Backend Architecture (Modular + Clean Code Direction)

Current backend is organized by feature modules:

- `auth`: register, login, current user
- `clients`: customer CRUD
- `invoices`: invoice CRUD + mark paid + public invoice endpoint
- `receipts`: receipt read endpoints
- `settings`: workspace billing/profile settings
- `workspaces`: workspace entity and workspace-access shared service

Clean-code improvements already applied:

- Centralized workspace ownership lookup/creation in `WorkspaceAccessService`
- Reduced duplicated workspace logic in services
- Moved request DTOs into `dto/` folders per feature module
- Replaced `any` in backend service/controller code with typed DTO/domain contracts
- Simplified noisy auth controller logging/error wrapping
- Added startup env validation via `ConfigModule.forRoot({ validate })`

## Mock / Demo Data Policy

- Existing demo/mocked data flows are preserved.
- Do not edit demo/mock content in presentation flows unless explicitly requested.
- Legacy local-storage helper code remains untouched for demo compatibility.

## Security & Git Hygiene

Root `.gitignore` now ignores env files recursively:

- `**/.env`
- `**/.env.*`
- while still allowing:
  - `.env.example`
  - `backend/.env.example`
  - `frontend/.env.example`

If any secret file was committed before, rotate those secrets and remove them from git history separately when needed.

## Scripts

Backend:

- `npm run start:dev` - run API in watch mode
- `npm run build` - build TypeScript output
- `npm run start` - run built server
- `npm run test` - run backend core service tests (`auth`, `invoices`, `receipts`)

Frontend:

- `npm run dev` - run Vite dev server
- `npm run build` - production build
- `npm run lint` - run ESLint
- `npm run test` - run Vitest tests

## Next Refactor Steps (Optional)

- Add migration strategy (disable `synchronize` in non-local environments)
- Add full API integration tests (controller + guard + DB)