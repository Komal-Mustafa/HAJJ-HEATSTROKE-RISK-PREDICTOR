# Deployment Guide — Hajj Heatstroke Risk Predictor

**Stack:** FastAPI (Python) → Render · React (Vite) → Vercel

---

## 1. Test locally first

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
python train_model.py          # generates model/model.pkl
uvicorn main:app --reload
# → open http://localhost:8000/docs  (Swagger UI)
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
# edit .env.local → VITE_API_URL=http://localhost:8000
npm run dev
# → open http://localhost:3000
```

---

## 2. Push to GitHub

Make sure your repo has this structure:
```
HAJJ-HEATSTROKE-RISK-PREDICTOR/
  backend/
    main.py
    train_model.py
    requirements.txt
    render.yaml
  frontend/
    src/
    index.html
    package.json
    vite.config.js
    vercel.json
```

```bash
git add .
git commit -m "Add full-stack deployment setup"
git push origin main
```

---

## 3. Deploy Backend → Render (free)

1. Go to **https://render.com** → Sign up / Log in with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo
4. Configure:
   - **Name:** `hajj-heatstroke-api`
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt && python train_model.py`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Free
5. Click **"Create Web Service"**
6. Wait ~3-5 min for the first deploy
7. Copy your URL: `https://hajj-heatstroke-api.onrender.com`

> **Note:** Free Render instances sleep after 15 min of inactivity and take ~30s to wake up.
> Upgrade to the $7/month "Starter" plan for always-on if you need faster cold starts.

---

## 4. Deploy Frontend → Vercel (free)

1. Go to **https://vercel.com** → Sign up / Log in with GitHub
2. Click **"Add New Project"**
3. Import your GitHub repo
4. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite (auto-detected)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add **Environment Variable:**
   - Key: `VITE_API_URL`
   - Value: `https://hajj-heatstroke-api.onrender.com`  ← your Render URL
6. Click **"Deploy"**
7. Your app is live at: `https://your-project.vercel.app`

---

## 5. Connect a custom domain (optional)

- **Vercel:** Project → Settings → Domains → Add your domain
- Point your domain's DNS CNAME to `cname.vercel-dns.com`
- SSL is automatic and free

---

## 6. Update the app

```bash
git add .
git commit -m "your changes"
git push origin main
```
Both Render and Vercel auto-deploy on every push to `main`.

---

## API Reference

### POST /predict
```json
// Request
{
  "temp_celsius": 44.0,
  "humidity": 25.0,
  "month": 7,
  "hour": 13,
  "zone": "Arafat"
}

// Response
{
  "risk_level": "EXTREME",
  "feels_like": 47.3,
  "color": "#8B0000",
  "icon": "🚨",
  "advice": ["STOP all outdoor activities immediately", "..."],
  "inputs_echo": { ... }
}
```

### GET /health
```json
{ "status": "ok", "model": "RandomForestClassifier", "classes": [...] }
```

Full interactive docs: `https://your-api.onrender.com/docs`
