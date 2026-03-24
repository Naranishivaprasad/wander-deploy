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
MONGODB_URI=mongodb://localhost:27017/wander-india
JWT_SECRET=wanderindia_super_secret_jwt_key_change_in_production
CLOUDINARY_CLOUD_NAME=dq8zptc2v
CLOUDINARY_API_KEY=786112675493296
CLOUDINARY_API_SECRET=tkUcx_s8ZQJpNfTv9S2seCP4IRw
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

## 🔧 Fixes Applied

| # | Issue | Fix |
|---|-------|-----|
| 1 | `.env` file missing → MongoDB won't connect | Created `.env` with all credentials |
| 2 | CORS only allowed one origin → blocked in some browsers | Fixed to allow all dev origins |
| 3 | Axios baseURL broke in production builds | Added `VITE_API_URL` env var support |
| 4 | AuthContext read stale `localStorage` user on mount | Now always verifies token with `/auth/me` |
| 5 | Cloudinary crashed if env vars missing | Made Cloudinary optional with memory fallback |
| 6 | `packageController` price/duration filter had JS object bug | Fixed filter object construction |
| 7 | `createPackage` ignored `imageUrl` from body | Added `imageUrl` body field as fallback |
| 8 | Seeder would re-seed and duplicate data on every run | Seeder is now idempotent (checks first) |
| 9 | Only 6 packages in seed data | Expanded to **10 packages** across India |

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

## 🔑 API Endpoints

### Auth
| Method | URL | Access | Description |
|--------|-----|--------|-------------|
| POST | `/api/auth/register` | Public | Create account |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | Protected | Get current user |

### Packages
| Method | URL | Access | Description |
|--------|-----|--------|-------------|
| GET | `/api/packages` | Public | Get all packages (filterable) |
| GET | `/api/packages/:id` | Public | Get single package |
| POST | `/api/packages` | Admin | Create package |
| PUT | `/api/packages/:id` | Admin | Update package |
| DELETE | `/api/packages/:id` | Admin | Delete package |

Query params for GET `/api/packages`:
- `search`, `location`, `featured`, `minPrice`, `maxPrice`, `minDays`, `maxDays`

### Bookings
| Method | URL | Access | Description |
|--------|-----|--------|-------------|
| POST | `/api/bookings` | User | Create booking |
| GET | `/api/bookings/my` | User | My bookings |
| GET | `/api/bookings` | Admin | All bookings |
| PUT | `/api/bookings/:id/status` | Admin | Update status |
| DELETE | `/api/bookings/:id` | User | Cancel booking |

---

## 🌐 Production Deployment

Set these env vars on your hosting platform:

**Backend:**
```
MONGODB_URI=mongodb+srv://...   # Use MongoDB Atlas for production
JWT_SECRET=<strong-random-string>
CLIENT_URL=https://your-frontend.com
```

**Frontend:**
```
VITE_API_URL=https://your-backend.com
```
