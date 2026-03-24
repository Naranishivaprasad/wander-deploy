# 🚀 Deployment Guide — WanderIndia

## Architecture
| Layer | Platform | Cost |
|-------|----------|------|
| Database | MongoDB Atlas | Free |
| Backend | Render.com | Free |
| Frontend | Vercel | Free |

---

## Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/Naranishivaprasad/wander-india.git
git push -u origin main
```

---

## Step 2: Deploy Backend on Render

1. Go to https://render.com → New → Web Service
2. Connect your GitHub repo
3. Set **Root Directory** → `backend`
4. Set **Build Command** → `npm install`
5. Set **Start Command** → `npm start`
6. Add Environment Variables:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://naranishivaprasad909_db_user:Shiva%40123@travelplanner.cm3yhly.mongodb.net/wander-india?retryWrites=true&w=majority&appName=travelplanner` |
| `JWT_SECRET` | `wanderindia_super_secret_jwt_key_change_in_production` |
| `JWT_EXPIRE` | `30d` |
| `CLOUDINARY_CLOUD_NAME` | `dq8zptc2v` |
| `CLOUDINARY_API_KEY` | `786112675493296` |
| `CLOUDINARY_API_SECRET` | `tkUcx_s8ZQJpNfTv9S2seCP4IRw` |
| `CLIENT_URL` | *(fill after Vercel deploy)* |

7. Click **Deploy** → copy your Render URL e.g. `https://wander-india-backend.onrender.com`

---

## Step 3: Deploy Frontend on Vercel

1. Go to https://vercel.com → New Project → Import repo
2. Set **Root Directory** → `frontend`
3. Add Environment Variable:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://wander-india-backend.onrender.com` |

4. **Build Command** → `npm run build`
5. **Output Directory** → `dist`
6. Click **Deploy** → copy your Vercel URL e.g. `https://wander-india.vercel.app`

---

## Step 4: Connect Frontend → Backend (CORS)

1. Go back to **Render** → your backend → **Environment**
2. Set `CLIENT_URL` → `https://wander-india.vercel.app`
3. Render auto-redeploys ✅

---

## Step 5: (Optional) Seed Sample Data

```bash
cd backend
MONGODB_URI="your-atlas-uri" node seeder.js
```

---

## ✅ Done!
- Frontend: https://wander-india.vercel.app
- Backend API: https://wander-india-backend.onrender.com/api
- Health Check: https://wander-india-backend.onrender.com/api/health
