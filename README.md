# MANAKSETU (मानकसेतु)
### *From Requirement to the Right Standard*

**SIH 2026 Prototype • AI Standards Decision Support System**

---

## 1. Project Purpose & Positioning

ManakSetu is an AI-powered decision-support platform designed to bridge the gap between natural-language procurement requirements and technical Indian Standards. 

> **Core Positioning:**  
> *"BIS provides the authoritative standards discovery layer. ManakSetu is the AI decision-support layer that understands a procurement requirement, retrieves candidate standards, determines applicability, traces related standards, checks version/regulatory context, and explains the recommendation with evidence."*

### Authoritative Reference Knowledge Notice
- **ManakSetu is NOT an official BIS or Government of India portal.**
- ManakSetu does not claim official government endorsement or provide legal compliance guarantees.
- Standard designations: *AI Standards Decision Support*, *BIS Reference Knowledge*, *Indian Standards Intelligence*, *Evidence-Based Recommendations*, *Potentially Applicable Standards*.

---

## 2. System Architecture

```
USER PROCUREMENT REQUIREMENT (Natural Language)
                     │
                     ▼
       AI REQUIREMENT ANALYZER
   (Deterministic Rule & Pattern Engine)
   ├─ Entity Extraction (Product, Qty, Capacity, Specs)
   ├─ Context Parsing (Application, Installation, Procurement)
   └─ Explicit Standard Number Extraction (Verbatim)
                     │
                     ▼
          STRUCTURED REQUIREMENT
                     │
                     ▼
           SEMANTIC RETRIEVER
   (sentence-transformers/all-MiniLM-L6-v2)
   ├─ 384-dimensional Vector Embeddings
   ├─ Cosine Vector Similarity
   └─ Strict 9-Field Fingerprint Vector Caching
                     │
                     ▼
            CANDIDATE STANDARDS
                     │
                     ▼
        EVIDENCE EVALUATION ENGINE
   ├─ Title & Scope Alignment
   ├─ Product Classification & Type Match
   ├─ Normative References Traversal
   └─ Strict Version Intelligence (NEWER_VERSION Alerts)
                     │
                     ▼
   EXPLAINABLE RECOMMENDATIONS & KNOWLEDGE GRAPH
```

---

## 3. Technology Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Bundler:** Vite 6
- **Styling:** Tailwind CSS (Government Navy & Institutional Blue Design System)
- **Routing:** React Router v6
- **Graph Visualization:** `@xyflow/react` (React Flow v12)
- **Icons:** `lucide-react`
- **HTTP Client:** `axios`

### Backend
- **Framework:** Python 3 with FastAPI
- **Data Validation:** Pydantic v2
- **ORM / Database:** SQLAlchemy 2.x with SQLite (`backend/data/manaksetu.db`)
- **Web Server:** Uvicorn

### AI & Retrieval
- **Embedding Model:** `sentence-transformers/all-MiniLM-L6-v2`
- **Vector Dimension:** 384 dimensions
- **Vector Similarity:** L2-normalized Cosine Dot-Product Similarity
- **Vector Cache:** `backend/data/vector_cache.npy` and `backend/data/vector_index.json`
- **Fingerprint Invalidation:** SHA-256 hash over 9 fields: `id`, `standard_number`, `title`, `scope`, `standard_type`, `classification`, `certification_status`, `status`, `year`, `model_name`, `embedding_dim`.

---

## 4. Initial Seed Knowledge Base

The prototype is seeded with verified Indian Standards and normative relationships:

1. **IS 2082:2018** — *Stationary storage type electric water heaters - Specification* (Product Specification, Active)
2. **IS 302 (Part 2/Sec 21):2024** — *Household and Similar Electrical Appliances-Safety Part 2 Particular Requirements Section 21 Storage Water Heaters* (Safety Standard, Active)
3. **IS 302 (Part 2/Sec 21):2018** — *Household and Similar Electrical Appliances-Safety Part 2 Particular Requirements Section 21 Storage Water Heaters* (Safety Standard, Superseded)
4. **IS 302 (Part 1):2024** — *Household and similar electrical appliances - Safety - Part 1: General requirements* (General Safety Standard, Active)
5. **IS/IEC 60730 (Part 1):1999** — *Automatic Electrical Controls for Household and Similar Use - Part 1: General Requirements* (Control Standard, Active)
6. **IS 16923 (Part 1):2018** — *Thermocouples Part 1 — EMF Specifications and Tolerances* (Measurement Standard, Active — domain negative test)

### Seeded Relationships
- `IS 302 (Part 2/Sec 21):2024` **SUPERSEDES** `IS 302 (Part 2/Sec 21):2018`
- `IS 302 (Part 2/Sec 21):2024` **REFERENCES** `IS 302 (Part 1):2024`
- `IS 302 (Part 2/Sec 21):2024` **REFERENCES** `IS/IEC 60730 (Part 1):1999`
- `IS 2082:2018` **REFERENCES** `IS 302 (Part 2/Sec 21):2024`

---

## 5. Setup & Running Instructions

### Prerequisites
- Python 3.10+ (tested with Python 3.14)
- Node.js v18+ and npm

### Backend Setup
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run backend test suite (16 passing tests)
pytest tests -v

# Start FastAPI server (runs on http://127.0.0.1:8000)
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Frontend Setup
```bash
cd frontend

# Install npm packages
npm install

# Run TypeScript check and production build
npm run build

# Start Vite development server (runs on http://localhost:5173)
npm run dev
```

---

## 5.1. Running from Visual Studio Code

### Option 1: One-Click Task (`Ctrl + Shift + B`)
1. Open the folder `D:\ManakSetu` in VS Code (`File` → `Open Folder...`).
2. Press **`Ctrl + Shift + B`** (or go to menu: `Terminal` → `Run Build Task...`).
3. Select **`Run Full Application (Backend + Frontend)`**.
   - This automatically launches both the FastAPI backend and Vite frontend concurrently in dedicated background terminal panels.
4. Open your browser at **`http://localhost:5173`**.

### Option 2: Using VS Code Integrated Split Terminal
1. Open `D:\ManakSetu` in VS Code.
2. Open the terminal (**`Ctrl + \``** or `Terminal` → `New Terminal`).
3. In **Terminal 1 (Backend)**:
   ```powershell
   cd backend
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
4. Click the **Split Terminal** icon (`Ctrl + Shift + 5` or the split icon on top-right of terminal panel) to open **Terminal 2 (Frontend)**:
   ```powershell
   cd frontend
   $env:PATH = "D:\JIET\Node;$env:PATH"
   npm run dev
   ```
5. Open your browser at **`http://localhost:5173`**.

### Option 3: Direct Double-Click (`run_dev.bat`)
- Simply double-click [`D:\ManakSetu\run_dev.bat`](file:///D:/ManakSetu/run_dev.bat) in File Explorer or run it from any command prompt. It will open two console windows running both servers simultaneously.

---

## 6. API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health, standards count, vector model status |
| `POST` | `/api/analyze` | Natural language requirement analysis & recommendations |
| `GET` | `/api/standards` | List indexed standards with search & filters |
| `GET` | `/api/standards/{id}` | Standard detail, technical scope & relationships |
| `GET` | `/api/standards/{id}/relationships` | Direct incoming & outgoing standard relationships |
| `GET` | `/api/graph` | Knowledge graph nodes and edges for React Flow |
| `GET` | `/api/history` | Historical requirement analysis log |

---

## 7. Important Test Scenarios Verified

1. **Full Procurement Specification:**
   - Input: *"We need to procure 500 wall-mounted 25 litre electric storage water heaters for government hostels."*
   - Outcome: Extracts product, 500 qty, 25L capacity, wall-mounted, government hostels. Recommends `IS 2082:2018` and `IS 302 (Part 2/Sec 21):2024` with high semantic confidence. Candidate standards include referenced general and controls standards. `IS 16923` is not recommended.
2. **Minimal Requirement Without Fabrication:**
   - Input: *"Need water heaters."*
   - Outcome: Extracts product without fabricating non-existent quantities, capacity, or applications.
3. **Outdated Explicit Standard Citation:**
   - Input: *"We need a water heater according to IS 302 (Part 2/Sec 21):2018."*
   - Outcome: Verbatim extraction of 2018 edition, triggers prominent `NEWER_VERSION` alert citing `IS 302 (Part 2/Sec 21):2024`. Original text is not silently converted.
4. **General Requirement Without False Alerts:**
   - Input: *"We need a 25 litre electric water heater."*
   - Outcome: `version_alerts = []` (no false version alarms).
5. **Zero-Match Domain Control:**
   - Input: *"We need Portland cement."*
   - Outcome: Returns zero recommendations because cement standard is absent from the prototype slice. The engine never fabricates non-existent standards.

---

## 8. Knowledge Base Scope & Limitations

### Curated Prototype Scope
The current prototype is seeded with a verified slice of Indian Standards centering on electric storage water heaters, general electrical appliance safety, automatic electrical controls, and thermoelectric measurements. This slice demonstrates:
- Product specification discovery (`IS 2082:2018`)
- Normative safety traversal (`IS 302 (Part 2/Sec 21):2024` & `IS 302 (Part 1):2024`)
- Component-level control requirements (`IS/IEC 60730 (Part 1):1999`)
- Strict version intelligence and deprecation alerts (`IS 302 (Part 2/Sec 21):2018` superseded)
- Unrelated domain negative controls (`IS 16923 (Part 1):2018` thermocouples, cement, etc.)

### Limitations
- **Selective Coverage:** The demonstration knowledge base contains 6 curated standards and 4 verified normative relationships. It does not index the full corpus of 20,000+ Indian Standards.
- **Decision-Support Only:** ManakSetu provides AI-assisted discovery, evidence grounding, and candidate ranking. It is not an automated certification authority or regulatory mandate engine.

---

## 9. Authoritative BIS Verification Disclaimer

> **IMPORTANT NOTICE:**  
> ManakSetu is an AI decision-support prototype created for Smart India Hackathon (SIH) 2026. The prototype uses a limited curated knowledge base and is **not a replacement for the authoritative BIS standards catalogue or official gazette notifications**.
> 
> All recommendations represent *potentially applicable standards* identified by semantic retrieval and normative traversal. Final compliance, certification status, Quality Control Orders (QCOs), and conformity assessments must be verified against official publications issued by the **Bureau of Indian Standards (BIS)** and the relevant Line Ministries of the Government of India.
