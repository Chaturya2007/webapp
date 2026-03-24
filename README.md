# ☕ Café Tranquil — Food Ordering System

A complete production-ready full-stack food ordering system.

## Tech Stack
- **Frontend**: React + Vite (Customer App)
- **Admin**: React + Vite + Recharts (Admin Dashboard)
- **Backend**: Node.js + Express + Socket.io
- **Database**: MongoDB Atlas
- **Auth**: JWT + Role-based (Admin/User)

## Quick Start

### 1. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
node seed/seedData.js   # Seed database
npm start               # Runs on port 5000
```

### 2. Frontend (Customer App)
```bash
cd frontend
npm install
npm run dev             # Runs on http://localhost:3000
```

### 3. Admin Dashboard
```bash
cd admin-dashboard
npm install
npm run dev             # Runs on http://localhost:3001
```

## Default Credentials
- **Admin**: admin@cafetranquil.com / admin123

## UPI Payment
QR is generated dynamically using:
`upi://pay?pa=chaturya.01@ptaxis&pn=Cafe%20Tranquil&am={amount}&cu=INR`

## Features
- 🔐 JWT Authentication (User + Admin roles)
- 🛒 Cart with real-time price calculation
- 🍽️ Dine-in / Takeaway / Home Delivery
- 💳 COD + UPI payment with QR code
- ⚡ Real-time order tracking (Socket.io)
- 📊 Admin analytics with charts
- ⭐ Reviews and ratings system

## Deployment
- **Backend**: Render / Railway — set env vars from `.env.example`
- **Frontend**: Vercel — set `VITE_API_URL` to your backend URL
- **Database**: MongoDB Atlas — use the Atlas connection string in `MONGO_URI`
