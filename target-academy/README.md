# 🎓 Target Coaching Academy — Result Analysis System

## SETUP IN 5 STEPS

### Step 1 — Install dependencies
```
npm install
```

### Step 2 — Update .env.local
Open `.env.local` and fill in:
- MONGODB_URI — your MongoDB Atlas connection string
- EMAIL_USER — your Gmail address
- EMAIL_PASS — your Gmail App Password (16-digit)

### Step 3 — Seed the first Admin
```
node scripts/seed-admin.mjs
```

### Step 4 — Run the project
```
npm run dev
```

### Step 5 — Open in browser
```
http://localhost:3000
```
Login with: admin@targetacademy.edu.in | Role: Admin

## FOLDER STRUCTURE
- app/page.js          → Full React frontend
- app/api/             → All backend API routes
- models/              → MongoDB schemas
- lib/                 → DB and email helpers
- scripts/             → Seed script
