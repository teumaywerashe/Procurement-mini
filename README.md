# ProcureHub

**Live:** [https://procurementHub.vercel.com](https://procurementHub.vercel.com)

A full-stack procurement management platform. Admins publish tenders, vendors browse and submit bids, and both roles track everything through role-specific dashboards.

---

## Tech Stack

| Layer     | Technology                                                                   |
| --------- | ---------------------------------------------------------------------------- |
| Frontend  | Next.js 16, React 19, Tailwind CSS v4, Mantine v7, Redux Toolkit + RTK Query |
| Backend   | NestJS 11, Drizzle ORM, PostgreSQL 17, Passport JWT                          |
| Database  | PostgreSQL (via Docker)                                                      |
| Dev Tools | Drizzle Studio, pgAdmin 4, Docker Compose                                    |

---

## Project Structure

```
.
├── procurement-api/     # NestJS REST API
├── procurement-fe/      # Next.js frontend
├── docker-compose.yml   # Full stack orchestration
└── .env                 # Root environment variables
```

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- Node.js 20+ (for running services outside Docker)

### 1. Clone and configure environment

```bash
git clone <repo-url>
cd <repo>
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
PORT=3000
JWT_SECRET=your_jwt_secret_here

# PostgreSQL
DATABASE_URL=postgresql://user:password@postgres:5432/procurement
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=procurement

# pgAdmin
PGADMIN_DEFAULT_EMAIL=admin@example.com
PGADMIN_DEFAULT_PASSWORD=admin

# Frontend (used by backend for CORS)
FRONTEND_URL=http://localhost:3001
```

The frontend also needs its own env file:

```bash
# procurement-fe/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## Running with Docker (recommended)

This spins up all services: PostgreSQL, the API, the frontend, Drizzle Studio, and pgAdmin.

```bash
docker compose up
```

| Service        | URL                   |
| -------------- | --------------------- |
| Frontend       | http://localhost:3001 |
| Backend API    | http://localhost:3000 |
| pgAdmin        | http://localhost:5050 |
| Drizzle Studio | http://localhost:4984 |
| PostgreSQL     | localhost:5433        |

Migrations run automatically on backend startup.

To stop:

```bash
docker compose down
```

---

## Running Locally (without Docker)

You still need a running PostgreSQL instance. Update `DATABASE_URL` in `procurement-api/.env` to point to it.

### Backend

```bash
cd procurement-api
npm install

# Run database migrations
npx drizzle-kit migrate

# Start in watch mode
npm run start:dev
```

### Frontend

```bash
cd procurement-fe
npm install
npm run dev
```

Frontend runs on http://localhost:3000, backend on http://localhost:3000 by default — adjust ports as needed.

---

## API Overview

Base URL: `http://localhost:3000`

All protected routes require a JWT cookie set at login.

### Auth

| Method | Endpoint         | Description                  |
| ------ | ---------------- | ---------------------------- |
| POST   | `/auth/register` | Register a new user          |
| POST   | `/auth/login`    | Login and receive JWT cookie |
| POST   | `/auth/logout`   | Clear session                |

### Tenders

| Method | Endpoint      | Access | Description                            |
| ------ | ------------- | ------ | -------------------------------------- |
| GET    | `/tender/all` | All    | List all tenders (filterable by title) |
| GET    | `/tender/:id` | All    | Get single tender                      |
| POST   | `/tender`     | Admin  | Create tender                          |
| PATCH  | `/tender/:id` | Admin  | Update tender                          |
| DELETE | `/tender/:id` | Admin  | Delete tender                          |

### Bids

| Method | Endpoint                | Access | Description                |
| ------ | ----------------------- | ------ | -------------------------- |
| GET    | `/bid`                  | Admin  | Get all bids               |
| GET    | `/bid/tender/:tenderId` | Admin  | Bids for a specific tender |
| GET    | `/bid/vendor/:vendorId` | Vendor | Bids by vendor             |
| POST   | `/bid`                  | Vendor | Submit a bid               |
| PATCH  | `/bid/:id`              | Admin  | Update bid status          |

### Vendors

| Method | Endpoint      | Access | Description           |
| ------ | ------------- | ------ | --------------------- |
| GET    | `/vendor`     | Admin  | List all vendors      |
| GET    | `/vendor/:id` | Admin  | Get vendor by user ID |
| PATCH  | `/vendor/:id` | Admin  | Update vendor         |

### Users

| Method | Endpoint    | Access | Description         |
| ------ | ----------- | ------ | ------------------- |
| GET    | `/user/me`  | Auth   | Get current user    |
| PATCH  | `/user/:id` | Auth   | Update user profile |

---

## Database Schema

```
users         id, name, email, role (admin|vendor), password, created_at
tender        id, title, name, description, status, closing_date, reference_number, estimated_value, created_by, created_at
bid           id, vendor_id, tender_id, amount, bid_status, reference_number, submitted_at
vendor        id, name, email, owner_id, registration_number, phone_number, created_at
```

Tender statuses: `draft`, `published`, `closed`, `awarded`, `cancelled`

Bid statuses: `pending`, `accepted`, `rejected`

---

## Frontend Pages

| Route              | Role   | Description                                  |
| ------------------ | ------ | -------------------------------------------- |
| `/`                | Guest  | Landing page                                 |
| `/login`           | Guest  | Login form                                   |
| `/registration`    | Guest  | Sign up form                                 |
| `/dashboard`       | All    | Overview with stats and recent activity      |
| `/tender`          | All    | Browse and filter tenders by category/status |
| `/tender/:id`      | All    | Tender detail — vendors can submit bids here |
| `/tender/create`   | Admin  | Create a new tender                          |
| `/tender/:id/edit` | Admin  | Edit an existing tender                      |
| `/tender/manage`   | Admin  | Manage all tenders with filters and actions  |
| `/bids`            | Admin  | All submitted bids with category filters     |
| `/bids/my`         | Vendor | Vendor's own bids with stats                 |
| `/vendors`         | Admin  | Vendor list with analytics                   |
| `/vendors/:id`     | Admin  | Single vendor profile                        |
| `/profile`         | All    | View and edit your profile                   |

---

## Scripts Reference

### Backend (`procurement-api/`)

```bash
npm run start:dev      # Development with watch mode
npm run start:prod     # Production
npm run build          # Compile TypeScript
npm run test           # Unit tests
npm run test:e2e       # End-to-end tests
npm run test:cov       # Coverage report
npm run lint           # Lint and fix
```

### Frontend (`procurement-fe/`)

```bash
npm run dev            # Development server
npm run build          # Production build
npm run start          # Start production build
npm run lint           # Lint
```

### Docker shortcuts (from `procurement-api/package.json`)

```bash
npm run docker:up      # docker compose up
npm run docker:down    # docker compose down
npm run docker:logs    # Follow logs
npm run docker:build   # Rebuild images
```

---

## Roles

**Admin**

- Create, edit, delete, and manage tenders
- View all bids across all tenders
- Manage vendor accounts
- Award or reject bids

**Vendor**

- Browse published tenders
- Submit bids on open tenders
- Track own bid statuses
- View company profile

---

## License

Private — unlicensed.
