# InvoiceFlow – simple invoice generator for freelancers

InvoiceFlow is a lightweight invoicing tool for freelancers.
It lets you create clean invoices in seconds, auto-calculate totals & VAT, and export professional PDFs – with Thai-ready support.

## Tech stack

- Frontend: React, Vite, TypeScript, Tailwind, shadcn/ui, React Router, TanStack Query
- Backend: NestJS, TypeORM, PostgreSQL (Neon)

## Running locally

### Backend

```bash
cd backend
npm install
cp .env.example .env  # if you create one
# configure DATABASE_URL, DB_SSL, JWT_SECRET
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
# set VITE_API_URL in frontend/.env, e.g.
# VITE_API_URL=http://localhost:3000/api/v1
npm run dev
```

The marketing landing page is available at `/` and the authenticated app starts at `/invoices`.

## Product Hunt launch assets (summary)

- **Name**: InvoiceFlow
- **Tagline**: `Create invoices in 30 seconds — no formatting, no printing.`
- **Description**:
  Freelancers waste hours creating invoices in Word.
  InvoiceFlow lets you generate invoices instantly, auto calculate totals & VAT, and export clean PDFs.
  Built for freelancers who want speed and simplicity, with Thai-ready support.

Use the landing page at `/` for your pre-launch waitlist and demo links.