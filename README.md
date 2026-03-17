# Payout Management MVP

A full-stack payout management system with role-based access control (RBAC) for OPS and FINANCE teams.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend**: Express.js, TypeScript, JWT Authentication
- **Database**: MongoDB (Local development) / MongoDB Atlas (Production)

## Project Structure

```
/frontend          # Next.js frontend application
/backend           # Express.js backend API
```

## Live URLs

- **Frontend**: [To be deployed on Vercel]
- **Backend**: [To be deployed on Render]

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
# Edit .env with your MongoDB connection string
npm run seed    # Seed database with test users
npm run dev     # Start development server on port 5000
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with backend API URL
npm run dev     # Start development server on port 3000
```

## Test Credentials

- **OPS User**: ops@demo.com / ops123
- **FINANCE User**: finance@demo.com / fin123

## Features

- ✅ JWT-based authentication with role-based access control
- ✅ Vendor management (CRUD operations)
- ✅ Payout request workflow (Draft → Submitted → Approved/Rejected)
- ✅ Audit trail for all payout actions
- ✅ Filters by status and vendor
- ✅ Role-based UI and API restrictions

## Development

More detailed setup instructions coming soon...
