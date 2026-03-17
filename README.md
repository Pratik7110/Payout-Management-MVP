# Payout Management MVP

A full-stack payout management system with role-based access control (RBAC) for OPS and FINANCE teams. This MVP demonstrates a complete workflow for managing vendor payouts with proper authorization, audit trails, and status transitions.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Axios
- **Backend**: Express.js, TypeScript, JWT Authentication, MongoDB/Mongoose
- **Database**: MongoDB (Local development via Compass) / MongoDB Atlas (Production)
- **Deployment**: Vercel (Frontend) / Render (Backend)

## Project Structure

```
├── /frontend                 # Next.js frontend application
│   ├── src/app              # Next.js app router pages
│   ├── src/components       # Reusable React components
│   ├── src/context          # Auth context provider
│   ├── src/lib              # API utilities
│   └── package.json         # Frontend dependencies
├── /backend                 # Express.js backend API
│   ├── src/routes           # API route handlers
│   ├── src/models           # MongoDB schemas
│   ├── src/middleware       # Auth and error handling
│   ├── src/config           # Database configuration
│   ├── src/utils            # JWT utilities
│   ├── src/scripts          # Database seed script
│   └── package.json         # Backend dependencies
├── README.md                # This file
└── .gitignore              # Git ignore rules
```

## Features

### Authentication & Authorization
- ✅ JWT-based authentication (24h token expiry)
- ✅ Role-based access control (OPS and FINANCE roles)
- ✅ Server-side role enforcement (not just UI)
- ✅ Secure password hashing with bcryptjs

### Vendor Management
- ✅ Create vendors with payment methods (UPI, Bank Account, IFSC)
- ✅ View all vendors in a table
- ✅ Strict validation on vendor fields
- ✅ Bank account masking for security

### Payout Management
- ✅ OPS can create payouts in Draft status
- ✅ OPS can submit payouts (Draft → Submitted)
- ✅ FINANCE can approve payouts (Submitted → Approved)
- ✅ FINANCE can reject payouts with reason (Submitted → Rejected)
- ✅ Strict status transition validation
- ✅ Filter payouts by status and vendor

### Audit Trail
- ✅ Track all payout actions (CREATED, SUBMITTED, APPROVED, REJECTED)
- ✅ Record who performed each action and when
- ✅ Display audit history on payout detail page
- ✅ Action icons and formatted timestamps

## Quick Start (< 5 minutes)

### Prerequisites

- Node.js 18+ installed
- MongoDB running locally (via MongoDB Compass) or MongoDB Atlas account
- Git installed

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your MongoDB connection:
```
MONGODB_URI=mongodb://localhost:27017/payout_management
JWT_SECRET=your_secure_jwt_secret_here
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

Then seed the database and start:
```bash
npm run seed    # Seed database with test users and vendors
npm run dev     # Start development server on port 5000
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Then start:
```bash
npm run dev     # Start development server on port 3000
```

Visit `http://localhost:3000` in your browser.

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| OPS | ops@demo.com | ops123 |
| FINANCE | finance@demo.com | fin123 |

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email and password

### Vendors
- `GET /api/vendors` - List all active vendors (authenticated)
- `POST /api/vendors` - Create new vendor (authenticated)

### Payouts
- `POST /api/payouts` - Create payout (OPS only)
- `GET /api/payouts` - List payouts with optional filters (authenticated)
  - Query params: `status` (Draft/Submitted/Approved/Rejected), `vendor_id`
- `GET /api/payouts/:id` - Get payout details with audit trail (authenticated)
- `POST /api/payouts/:id/submit` - Submit payout (OPS only, Draft status)
- `POST /api/payouts/:id/approve` - Approve payout (FINANCE only, Submitted status)
- `POST /api/payouts/:id/reject` - Reject payout (FINANCE only, Submitted status)

## User Workflows

### OPS User Workflow
1. Login with ops@demo.com / ops123
2. View vendors in Vendors page
3. Create new payout request (Draft status)
4. Submit payout for approval
5. View all payouts and their status

### FINANCE User Workflow
1. Login with finance@demo.com / fin123
2. View all payouts in Payouts page
3. Filter payouts by status (Submitted)
4. Approve or reject payouts
5. View audit trail for each payout

## Database Schema

### Users Collection
- email (unique, lowercase)
- password (hashed)
- role (OPS or FINANCE)
- timestamps

### Vendors Collection
- name (required)
- upi_id (optional)
- bank_account (optional)
- ifsc (optional)
- is_active (default: true)
- timestamps

### Payouts Collection
- vendor_id (reference to Vendor)
- amount (must be > 0)
- mode (UPI, IMPS, or NEFT)
- note (optional)
- status (Draft, Submitted, Approved, or Rejected)
- decision_reason (only when rejected)
- created_by (reference to User)
- timestamps

### PayoutAudits Collection
- payout_id (reference to Payout)
- action (CREATED, SUBMITTED, APPROVED, or REJECTED)
- performed_by (reference to User)
- performed_by_email
- timestamp

## Validation Rules

### Vendor Fields
- **Name**: 2-100 characters, alphanumeric + basic punctuation
- **UPI ID**: Format `username@bank` (e.g., vendor@upi)
- **Bank Account**: 10-18 digits only
- **IFSC Code**: 11 characters (4 letters + 0 + 6 alphanumeric, e.g., HDFC0001234)
- **At least one payment method required** (UPI or Bank Account)

### Payout Fields
- **Amount**: Must be greater than 0
- **Mode**: UPI, IMPS, or NEFT
- **Status Transitions**: Strictly enforced (Draft → Submitted → Approved/Rejected)
- **Decision Reason**: Required when rejecting

## Assumptions

1. MongoDB is available locally or via MongoDB Atlas
2. Node.js 18+ is installed
3. Frontend and backend run on different ports (3000 and 5000)
4. JWT secret should be changed in production
5. CORS is configured for localhost development
6. Bank accounts are masked in UI for security
7. All timestamps are in UTC

## Security Considerations

- ✅ Passwords hashed with bcryptjs (10 salt rounds)
- ✅ JWT tokens expire after 24 hours
- ✅ Role-based access enforced on backend
- ✅ Input validation on all endpoints
- ✅ CORS configured for frontend origin
- ✅ Bank account numbers masked in UI
- ✅ No sensitive data in API responses

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variable: `NEXT_PUBLIC_API_URL=<backend-url>`
4. Deploy

### Backend (Render)
1. Push code to GitHub
2. Create new Web Service on Render
3. Set build command: `cd backend && npm install && npm run build`
4. Set start command: `cd backend && npm start`
5. Add environment variables (MONGODB_URI, JWT_SECRET, etc.)
6. Deploy

## Development Notes

- Backend runs on port 5000 by default
- Frontend runs on port 3000 by default
- MongoDB connection string can be local or Atlas
- Seed script creates 2 users and 3 sample vendors
- All timestamps use ISO 8601 format
- Error responses follow consistent JSON format

## Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB is running locally or Atlas connection string is correct
- Check MONGODB_URI in .env file

**CORS Error**
- Verify CORS_ORIGIN in backend .env matches frontend URL
- Check frontend API URL in .env.local

**Authentication Failed**
- Ensure backend is running on correct port
- Check JWT_SECRET is set in backend .env
- Verify token is being sent in Authorization header

**Payout Creation Failed**
- Ensure vendor exists and is active
- Check amount is greater than 0
- Verify user has OPS role

## License

ISC
