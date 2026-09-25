# Developer & Contributor Guide

This guide provides instructions for configuring your local development environment, seeding the standards knowledge base, executing test suites, and building the production artifacts.

---

## 1. Prerequisites

Ensure the following runtimes and tools are installed on your workstation:

| Runtime / Tool | Minimum Version | Recommended Version | Verification Command |
| :--- | :--- | :--- | :--- |
| **Python** | 3.10+ | 3.11 or 3.12 | `python --version` |
| **Node.js** | 18.0+ | 20.x LTS | `node --version` |
| **npm** | 9.0+ | 10.x | `npm --version` |
| **Git** | 2.30+ | Latest | `git --version` |

---

## 2. Clone & Environment Configuration

### 2.1. Clone Repository
```bash
git clone https://github.com/purohitkaran07/ManakSetu.git
cd ManakSetu
```

### 2.2. Environment File
Create a `.env` file from the provided template:
```bash
cp .env.example .env
```

Default values in `.env.example` are pre-configured to work locally out-of-the-box:
```ini
DATABASE_URL=sqlite:///./backend/data/manaksetu.db
PORT=8000
LLM_PROVIDER=none
```

---

## 3. Backend Setup

### 3.1. Virtual Environment & Dependencies
It is recommended to use a Python virtual environment:

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Windows (CMD):
.\venv\Scripts\activate.bat
# Linux / macOS:
source venv/bin/activate

# Upgrade pip and install backend dependencies
pip install --upgrade pip
pip install -r backend/requirements.txt
```

### 3.2. Database Seeding
Initialize the SQLite database schema and seed the verified Indian Standards and normative relationships:

```bash
python scripts/seed_database.py
```

Expected output:
```
============================================================
  MANAKSETU: Seeding Database with Indian Standards
============================================================
Creating tables (if not already existing)...
Populating verified standards and relationships...

[SUCCESS] Database seeded successfully!
  - Total Standards:     6
  - Total Relationships: 4
```

### 3.3. Semantic Vector Cache Generation
Precompute the 384-dimensional embeddings for the standards corpus:

```bash
python scripts/build_vectors.py
```

Expected output:
```
============================================================
  MANAKSETU: Building Semantic Vector Cache
============================================================
Found 6 standards in database. Computing embeddings...
Fingerprint (SHA-256): 70295ea23008681f7924c47d6e671ca1dfb388cc7ea313363c598a69c5a97b3b

[SUCCESS] Vector cache generated successfully!
  - Embeddings matrix shape: (6, 384)
  - Indexed standard IDs:    [1, 2, 3, 4, 5, 6]
```

### 3.4. Running Backend Server
Start the FastAPI application with auto-reloading:

```bash
python -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000 --reload
```
- API Base URL: `http://127.0.0.1:8000`
- Swagger UI: `http://127.0.0.1:8000/docs`
- Redoc: `http://127.0.0.1:8000/redoc`

---

## 4. Frontend Setup

### 4.1. Install Dependencies
```bash
cd frontend
npm install
```

### 4.2. Running Frontend Development Server
```bash
npm run dev
```
- The Vite development server launches at `http://localhost:5173`.
- In development mode, requests to `/api/*` are automatically proxied to `http://127.0.0.1:8000` via Vite's proxy configured in `frontend/vite.config.ts`.

---

## 5. One-Click Launch (Windows)

For Windows developers, a portable launch script is provided at the repository root:

```cmd
run_dev.bat
```
This script validates your Python and Node.js environments and launches both backend and frontend servers in separate terminal windows.

---

## 6. Running Tests

### 6.1. Backend Pytest Suite
The backend test suite verifies requirement extraction, semantic similarity thresholds, version alert detection, and API endpoints:

```bash
# Run all tests
python -m pytest backend/tests -v

# Run a specific test module
python -m pytest backend/tests/test_api.py -v
```

All 16 tests should pass:
- `test_analyzer.py` (Rule and pattern extraction)
- `test_api.py` (FastAPI route validation)
- `test_audit_and_traceability.py` (Evidence grounding)
- `test_health.py` (Health check endpoint)
- `test_recommendations.py` (Candidate ranking and scoring)
- `test_semantic_retriever.py` (Vector similarity calculations)
- `test_version_alerts.py` (Superseded version intelligence)

---

## 7. Frontend Verification & Production Build

### 7.1. TypeScript Type Checking
```bash
cd frontend
npx tsc --noEmit
```
Ensures 0 type errors across all components, pages, and API hooks.

### 7.2. Production Bundle Build
```bash
cd frontend
npm run build
```
Compiles and minifies assets into `frontend/dist`.

### 7.3. Preview Production Bundle Locally
```bash
cd frontend
npm run preview -- --port 5173
```

---

## 8. Code Formatting & Hygiene

- **Python:** Adhere to PEP 8 standards. Ensure type annotations are used for service and API interfaces.
- **TypeScript:** Strict type checking is enabled in `tsconfig.json`. Avoid `any` where typed domain schemas exist.
- **Git Commit Messages:** Use imperative, conventional commit messages:
  - `feat: add specification extraction for motor ratings`
  - `fix: correct CORS regex pattern for preview deployments`
  - `docs: update API response schema in docs/api.md`
