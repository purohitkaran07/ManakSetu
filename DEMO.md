# SIH 2026 Evaluation & Demonstration Guide

Welcome, Smart India Hackathon (SIH) Evaluators and Reviewers.

This guide provides **six ready-to-test demonstration scenarios** designed to showcase ManakSetu's core capabilities: deterministic requirement extraction, semantic Indian Standards discovery, normative reference traversal, strict version intelligence, and zero-hallucination protection.

---

## Live Prototype Access

- **Production Frontend:** Vercel Deployment (or local `http://localhost:5173`)
- **Production Backend API:** `https://manaksetu-api.onrender.com` (or local `http://127.0.0.1:8000`)
- **Interactive Swagger Documentation:** `http://127.0.0.1:8000/docs`

---

## Demonstration Scenarios

### Scenario 1: Complete Public Procurement Tender
Demonstrates full parameter extraction, primary standard recommendation, and normative safety traversal.

- **Navigation:** Open `/analyze` (or click *Requirement Analyzer* in the navbar).
- **Paste Input:**
  ```text
  500 wall-mounted 25 litre electric storage water heaters for government hostels
  ```
- **Click:** *Analyze Requirement*
- **Expected Results:**
  - **Extracted Entities:**
    - Product: `Electric Storage Water Heater`
    - Quantity: `500`
    - Specifications: `capacity: 25 litre`, `installation: wall-mounted`
    - Installation: `wall-mounted`
    - Application: `hostel`
    - Context: `government`
  - **Primary Recommendation:**
    - `IS 2082:2018` (*Stationary storage type electric water heaters - Specification*) — **High Confidence** (~82% relevance).
    - `IS 302 (Part 2/Sec 21):2024` (*Safety Particular Requirements - Storage Water Heaters*) — **High Confidence** (~76% relevance).
  - **Candidate Standards (Normatively Traced):**
    - `IS 302 (Part 1):2024` (*General Safety Requirements*) — Referenced by Part 2/Sec 21.
    - `IS/IEC 60730 (Part 1):1999` (*Automatic Electrical Controls*) — Referenced by Part 2/Sec 21.
  - **Negative Control Status:** `IS 16923 (Part 1):2018` (Thermocouples) is correctly excluded.
- **Judge Takeaway:** The system translates natural language into structured technical specifications, identifies the mandatory product standard, and automatically surfaces safety companion standards.

---

### Scenario 2: Minimal Natural-Language Requirement (No Fabrication)
Demonstrates that the engine does not hallucinate missing specifications when given sparse text.

- **Paste Input:**
  ```text
  Need water heaters.
  ```
- **Click:** *Analyze Requirement*
- **Expected Results:**
  - **Extracted Entities:**
    - Product: `Electric Storage Water Heater`
    - Quantity: `null` (None)
    - Capacity: `null` (None)
    - Installation: `null` (None)
  - **Primary Recommendation:** `IS 2082:2018` is still identified via semantic matching on the core product domain.
  - **No Speculation:** Extracted fields remain clean without invented quantities or assumptions.
- **Judge Takeaway:** Anti-hallucination design ensures tender auditors see only what the tender actually states.

---

### Scenario 3: Tender Citing an Obsolete / Superseded Standard
Demonstrates proactive version intelligence and legal compliance protection.

- **Paste Input:**
  ```text
  Procure stationary storage water heaters complying with IS 302 (Part 2/Sec 21):2018 for railway quarters.
  ```
- **Click:** *Analyze Requirement*
- **Expected Results:**
  - **Explicit Standard Detected:** Verbatim extraction of `IS 302 (Part 2/Sec 21):2018`.
  - **Prominent Version Alert (`NEWER_VERSION`):**
    > **Alert:** *"Your requirement explicitly mentions IS 302 (Part 2/Sec 21):2018. Note that this edition is superseded by IS 302 (Part 2/Sec 21):2024, which is available in the Indian Standards knowledge base."*
  - **Recommendation Behavior:** The engine refuses to recommend the superseded 2018 edition as primary, directing the procurement officer to the 2024 edition.
- **Judge Takeaway:** Prevents government tenders from being published with obsolete standards, avoiding vendor disputes, audit objections, and tender cancellations.

---

### Scenario 4: Clean General Requirement (Zero False Version Alarms)
Demonstrates that version alarms are not triggered indiscriminately.

- **Paste Input:**
  ```text
  We need a 25 litre electric water heater for residential quarters.
  ```
- **Click:** *Analyze Requirement*
- **Expected Results:**
  - **Version Alerts:** `[]` (None). No false version alarms appear because no outdated standard was cited.
  - **Primary Recommendation:** Recommends active `IS 2082:2018` and active `IS 302 (Part 2/Sec 21):2024`.
- **Judge Takeaway:** Precision engineering eliminates warning fatigue for procurement officers.

---

### Scenario 5: Out-of-Domain Query (Zero-Match / Hallucination Rejection)
Demonstrates strict negative controls when requirements fall outside the indexed standards slice.

- **Paste Input:**
  ```text
  300 bags of grade 43 ordinary portland cement for boundary wall construction.
  ```
- **Click:** *Analyze Requirement*
- **Expected Results:**
  - **Extracted Entities:**
    - Product: `Ordinary Portland Cement`
    - Quantity: `300`
    - Specifications: `grade 43`
  - **Primary Recommendations:** **0 standards recommended.**
  - **Candidate Standards:** **0 candidates.**
- **Judge Takeaway:** Unlike generative chatbots that hallucinate plausible standard numbers for cement, ManakSetu recognizes that cement standards are outside its current knowledge slice and returns zero false matches.

---

### Scenario 6: Knowledge Graph Exploration
Demonstrates interactive visual standards lineage and normative dependency exploration.

- **Navigation:** Click *Knowledge Graph* in the top navigation bar (`/knowledge-graph`).
- **Interactive Steps:**
  1. Inspect the graph canvas powered by `@xyflow/react`.
  2. Locate the central product standard: `IS 2082:2018`.
  3. Follow the `REFERENCES` edge to `IS 302 (Part 2/Sec 21):2024`.
  4. Notice the `SUPERSEDES` edge pointing to `IS 302 (Part 2/Sec 21):2018` (highlighted in amber/red for superseded status).
  5. Click on any node to view its detailed side panel containing formal scope, committee name, and classification.
- **Judge Takeaway:** Transforms opaque numerical standards codes into an intuitive visual compliance dependency map.

---

## Summary of Evaluator Key Checkpoints

| Checkpoint | Tested Feature | Expected Outcome |
| :--- | :--- | :--- |
| **Accuracy** | 500 units, 25L water heater | Matches `IS 2082:2018` and `IS 302 (Part 2/Sec 21):2024` |
| **Completeness** | Normative traversal | Surfaces companion general safety (`IS 302 Part 1`) and controls (`IS/IEC 60730`) |
| **Integrity** | Outdated edition citation | Emits clear `NEWER_VERSION` alert |
| **Precision** | Portland cement | Zero false recommendations (anti-hallucination) |
| **Traceability** | Grounded evidence | Explains *why* standard applies based on scope and classification |
