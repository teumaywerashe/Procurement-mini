# ProcureHub Backend API

A NestJS REST API for the ProcureHub procurement management platform, powered by Drizzle ORM and PostgreSQL.

---

## Tech Stack & Architecture

- **Framework**: NestJS 11
- **Database ORM**: Drizzle ORM with PostgreSQL 17 (`pg`)
- **Authentication**: Passport JWT with HttpOnly cookies & Bearer header support (`@nestjs/jwt`, `@nestjs/passport`)
- **Validation & Docs**: `class-validator`, `class-transformer`, Swagger / OpenAPI (`@nestjs/swagger`)
- **Testing**: Jest (`ts-jest`), `@nestjs/testing`

### Modules Overview

- **AuthModule**: Handles user registration, login, JWT token issue via HttpOnly cookies, and logout.
- **UserModule**: User management, profile retrieval/update, and SuperAdmin role assignments.
- **VendorModule**: Vendor organization profiles, owner registration, and vendor discovery.
- **TenderModule**: Tender lifecycle management (draft, published, closed, awarded, cancelled) with filtering & pagination.
- **BidModule**: Proposal submissions, bid status management (pending, accepted, rejected), and vendor bid tracking.
- **DatabaseModule**: Drizzle database connection and schema definitions.

---

## Setup & Running

### Prerequisites

- Node.js 20+
- PostgreSQL database (or Docker Compose setup)

### Environment Variables

Create a `.env` file in `procurement-api/`:

```env
PORT=3000
JWT_SECRET=your_jwt_secret_key
DATABASE_URL=postgresql://user:password@localhost:5432/procurement
FRONTEND_URL=http://localhost:3001
```

### Installation & Run Commands

```bash
# Install dependencies
npm install

# Run database migrations
npm run "db migrate"

# Development mode (watch mode)
npm run start:dev

# Production build & start
npm run build
npm run start:prod
```

---

## Role-Based Access Control (RBAC)

The API enforces granular role-based access control via custom guards (`JwtAuthGuard`, `RolesGuard`, `AdminOrOwnerGuard`, `IsSuperAdminGuard`).

| Role | Access & Boundaries |
| --- | --- |
| **SuperAdmin** | Full administrative rights, user role management (`/user/:id/role`), user creation & deletion. Isolated from bid submission features to ensure data integrity. |
| **Admin** | Create, update, and manage tenders. View bids submitted to owned tenders, manage vendor details, and evaluate bids. |
| **Vendor** | Manage vendor organization profile, browse published tenders, submit bids on open tenders, and view own submitted bid statuses. |

---

## Testing & Mocking Strategy

Unit tests are written using Jest and NestJS `@nestjs/testing` utilities.

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate code coverage
npm run test:cov
```

### Spec File Mocking Patterns

1. **Controller Unit Tests (`*.controller.spec.ts`)**:
   - `Test.createTestingModule` instantiates controllers in isolation.
   - Standardized guard dependency resolution by providing `{ provide: JwtService, useValue: { verify: jest.fn() } }`.
   - Controller services are injected using mock provider objects (e.g., `{ provide: VendorService, useValue: mockVendorService }`).

2. **Service Unit Tests (`*.service.spec.ts`)**:
   - Drizzle database operations (`db.select`, `db.insert`, `db.update`, `db.delete`, `db.query`) are mocked using `jest.mock('../database/db')`.
   - Transactional calls inside services are handled via `transaction: jest.fn((cb) => cb(mockDb))`.

---

## API Endpoints Reference

Base URL: `http://localhost:3000`

### Auth

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | Public | Register a new user account |
| POST | `/auth/login` | Public | Login and receive HTTP-only JWT cookie |
| POST | `/auth/logout` | Authenticated | Logout and clear session cookie |

### Users

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/user/me` | Authenticated | Get current authenticated user profile |
| GET | `/user` | SuperAdmin, Admin | List all user accounts |
| POST | `/user` | SuperAdmin | Create new user/admin account |
| GET | `/user/:id` | SuperAdmin, Admin | Get user by ID |
| PATCH | `/user/:id/profile` | Owner, Admin, SuperAdmin | Update profile details |
| PATCH | `/user/:id/role` | SuperAdmin | Update user role |
| POST | `/user/:id/role` | SuperAdmin | Set user role |
| DELETE | `/user/:id` | SuperAdmin | Delete user account |

### Vendors

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/vendor` | Authenticated | Register a vendor profile |
| GET | `/vendor` | SuperAdmin, Admin | List all vendors (with pagination & search) |
| GET | `/vendor/me` | Vendor | Get vendor profile of current user |
| GET | `/vendor/:id` | SuperAdmin, Owner | Get vendor by ID |
| PATCH | `/vendor/:id` | SuperAdmin, Owner | Update vendor details |
| DELETE | `/vendor/:id` | SuperAdmin, Owner | Delete vendor profile |

### Tenders

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/tender` | Public / Authenticated | Search & filter tenders (status, price, title) |
| GET | `/tender/:id` | Public / Authenticated | Get tender details |
| POST | `/tender` | Admin, SuperAdmin | Create a new tender |
| PATCH | `/tender/:id` | Admin (Owner), SuperAdmin | Update tender |
| DELETE | `/tender/:id` | Admin (Owner), SuperAdmin | Delete tender |

### Bids

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/bid` | Admin | List bids |
| GET | `/bid/tender/:tenderId` | Admin | View bids submitted for a tender |
| GET | `/bid/my-bids` | Vendor | View vendor's own bids |
| GET | `/bid/:id` | Admin, Vendor (Owner) | Get bid details |
| POST | `/bid` | Vendor | Submit a bid for an open tender |
| PATCH | `/bid/:id` | Admin (Tender Owner) | Update bid status (accept/reject) |
