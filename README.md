# Job Eligibility Checker

A full-stack web app that evaluates how well your profile matches a target job role. You fill in your education, skills, experience, and certifications — and it gives you a detailed score breakdown, skill gap analysis, and actionable recommendations to improve your chances.

Built with a React + Vite frontend and a Python FastAPI backend running a trained scikit-learn model.

**Live:** [job.gaury.dev](https://job.gaury.dev) · **API:** [job-api.gaury.dev](https://job-api.gaury.dev/docs)

---

## What it does

- Scores your profile across 4 dimensions — **skills**, **education**, **experience**, and **academics**
- Classifies you into tiers: *Highly Eligible*, *Eligible*, *Partially Eligible*, or *Foundational / Action Required*
- Shows which skills you match, which ones you're missing, and any bonus skills you bring
- Generates prioritized recommendations (what to learn, what to build, what to certify)
- Supports 6 job roles: Python Developer, Data Analyst, ML Engineer, Data Scientist, Web Developer, Software Developer

## Tech stack

**Frontend**
- React 19, TypeScript, Vite
- Tailwind CSS v4
- Framer Motion (animations)
- Lucide React (icons)

**Backend**
- Python 3.12, FastAPI, Uvicorn
- scikit-learn (trained classification model)
- Pydantic v2 (request/response validation)
- Pandas, NumPy, Joblib

**Hosting**
- Frontend on [Vercel](https://vercel.com)
- Backend on [Render](https://render.com)

---

## Project structure

```
├── src/                          # React frontend
│   ├── components/               # UI components (Hero, Form, Results, etc.)
│   ├── services/                 # API client (eligibilityService.ts)
│   ├── data/                     # Job roles catalog
│   ├── types/                    # TypeScript interfaces
│   ├── context/                  # Theme provider (dark/light mode)
│   └── utils/                    # Animation helpers
│
├── backend/                      # Python FastAPI backend
│   ├── main.py                   # App entry point, CORS, routes
│   ├── ml/                       # ML model, predictor, preprocessing
│   ├── models/                   # Trained .joblib model file
│   ├── services/                 # Eligibility engine, skill matcher, recommendations
│   ├── schemas/                  # Pydantic request/response models
│   ├── data/                     # Training dataset
│   └── tests/                    # Pytest test suite
│
├── index.html                    # Vite HTML entry
├── vite.config.ts
├── package.json
├── render.yaml                   # Render deployment config
└── Procfile
```

---

## Getting started

### Prerequisites

- Node.js 18+
- Python 3.10+

### Frontend

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`. By default it'll call the production backend API — you can override this with a `.env.local` file:

```
VITE_PYTHON_API_URL=http://localhost:8000
```

### Backend

```bash
cd backend
pip install -r requirements.txt
cd ..
uvicorn backend.main:app --reload --port 8000
```

API docs will be at `http://localhost:8000/docs` (Swagger UI).

### Running tests

```bash
cd backend
pytest
```

---

## API

The backend exposes a single main endpoint:

```
POST /api/v1/evaluate-eligibility
```

**Request body:**

```json
{
  "fullName": "Jane Doe",
  "educationLevel": "Bachelor's Degree",
  "branch": "Computer Science",
  "cgpa": "8.5",
  "technicalSkills": ["Python", "FastAPI", "Docker", "PostgreSQL"],
  "yearsOfExperience": "2",
  "certifications": ["AWS Cloud Practitioner"],
  "targetRole": "python-developer"
}
```

**Response** includes overall score, tier classification, per-dimension scores, matched/missing/bonus skills, and prioritized action recommendations.

Other endpoints:
- `GET /` — service info
- `GET /health` — health check + model status

---

## Deployment

The repo is set up for split deployment:

- **Frontend → Vercel** — auto-detected as a Vite project, builds to `dist/`
- **Backend → Render** — uses `render.yaml` for config, runs `uvicorn backend.main:app`

The key env vars you need:

| Where | Variable | Value |
|-------|----------|-------|
| Vercel | `VITE_PYTHON_API_URL` | Your Render/backend URL |
| Render | `PYTHON_VERSION` | `3.12.0` |
| Render | `CORS_ORIGINS` | Your Vercel/frontend URL |

---

## License

MIT
# Job Eligibility Checker
