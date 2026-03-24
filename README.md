# 🧭 WanderIndia — Travel Planner

A full-stack travel booking platform built with React + Node.js + MongoDB.

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
```

The `.env` file is already configured with your credentials. If you need to change anything:

```
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/wander-india?retryWrites=true&w=majority&appName=<appName>
JWT_SECRET=your_strong_random_secret_here
JWT_EXPIRE=30d

CLIENT_URL=https://your-app.vercel.app

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 2. Seed the Database (first time only)

```bash
npm run seed
```

This creates:
- ✅ 10 travel packages across India
- 👤 Admin account: `admin@travel.com` / `admin123`
- 👤 User account: `user@travel.com` / `user1234`
- 📅 2 sample bookings

To **reset** and reseed from scratch:
```bash
npm run seed:reset
```

### 3. Start the Backend

```bash
npm run dev      # development (auto-restarts)
npm start        # production
```

Server runs on: http://localhost:5000

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

---





---

## 🗂️ Project Structure

```
travel-planner/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── cloudinary.js      # Cloudinary + multer (optional)
│   ├── controllers/
│   │   ├── authController.js  # Register, Login, GetMe
│   │   ├── packageController.js
│   │   └── bookingController.js
│   ├── middleware/
│   │   ├── auth.js            # JWT protect + adminOnly
│   │   └── errorHandler.js    # Global error handler
│   ├── models/
│   │   ├── User.js
│   │   ├── Package.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── packages.js
│   │   └── bookings.js
│   ├── seeder.js              # Database seeder
│   ├── server.js
│   ├── .env                   ← your credentials here
│   └── package.json
│
└── frontend/
    └── src/
        ├── api/axios.js       # Axios instance with JWT interceptor
        ├── context/AuthContext.jsx
        ├── components/common/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── PackageCard.jsx
        │   └── ProtectedRoute.jsx
        └── pages/
            ├── Home.jsx
            ├── Packages.jsx
            ├── PackageDetail.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── MyBookings.jsx
            ├── AdminDashboard.jsx
            └── AdminPackageForm.jsx
```

---

