# REST API Reference

The ManakSetu backend provides a clean RESTful API built on FastAPI. All responses are encoded as JSON.

Base URL (Local): `http://127.0.0.1:8000`  
Base URL (Production): `https://manaksetu-api.onrender.com`  
Interactive Swagger Documentation: `http://127.0.0.1:8000/docs`

---

## 1. System Endpoints

### 1.1. Service Root
- **Method:** `GET`
- **Path:** `/`
- **Description:** Returns service name, tagline, and operational links.

**Response (200 OK):**
```json
{
  "service": "ManakSetu API",
  "tagline": "From Requirement to the Right Standard",
  "docs": "/docs",
  "health": "/api/health",
  "version": "1.0.0"
}
```

---

### 1.2. Health Check
- **Method:** `GET`
- **Path:** `/api/health`
- **Description:** Evaluates database connectivity, total indexed standards, and semantic model status.

**Response (200 OK):**
```json
{
  "status": "healthy",
  "database": "connected",
  "standards_count": 6,
  "model_status": "active",
  "version": "1.0.0"
}
```

---

## 2. Requirement Analysis & Decision Support

### 2.1. Extract Text from PDF Requirement
- **Method:** `POST`
- **Path:** `/api/extract-pdf`
- **Description:** Extracts selectable natural-language text from an uploaded tender or procurement requirement PDF. Operates entirely in-memory with strict validation (file type, 10 MB size limit, unencrypted check) and graceful error handling for scanned documents.

**Request Body (`multipart/form-data`):**
- `file`: PDF document file (`.pdf`, `application/pdf`)

**Response (200 OK):**
```json
{
  "text": "500 wall-mounted 25 litre electric storage water heaters for government hostels",
  "filename": "tender_clause.pdf",
  "pages_count": 1
}
```

**Error Responses:**
- `400 Bad Request`: When the PDF is empty, corrupted, password-protected, or scanned/image-only without selectable text (`"This PDF contains no selectable text. Please upload a text-based PDF or paste the requirement manually."`).

---

### 2.2. Analyze Requirement
- **Method:** `POST`
- **Path:** `/api/analyze`
- **Description:** Parses natural language procurement requirements, extracts parameters, computes semantic matches against Indian Standards, resolves normative references, detects version deprecations, and returns grounded evidence.


**Request Body (`application/json`):**
```json
{
  "text": "500 wall-mounted 25 litre electric storage water heaters for government hostels",
  "provider": "none"
}
```

**Parameters:**
| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `text` | string | Yes | Natural-language tender description or procurement clause (1 to 5,000 characters). |
| `provider` | string | No | Extraction engine provider (`none` uses deterministic pattern extraction). Defaults to `none`. |

**Response (200 OK):**
```json
{
  "id": "e4f5a6b7-8901-4bc3-9de2-f0123456789a",
  "original_requirement": "500 wall-mounted 25 litre electric storage water heaters for government hostels",
  "structured_requirement": {
    "product": "Electric Storage Water Heater",
    "product_category": "Electrical & Electronics",
    "quantity": 500,
    "specifications": {
      "capacity": "25 litre",
      "installation": "wall-mounted"
    },
    "application": "hostel",
    "installation": "wall-mounted",
    "procurement_context": "government",
    "explicitly_mentioned_standards": [],
    "inferred_fields": ["product_category"]
  },
  "recommendations": [
    {
      "standard": {
        "id": 1,
        "standard_number": "IS 2082:2018",
        "title": "Stationary storage type electric water heaters - Specification",
        "scope": "Covers stationary storage type electric water heaters for household and similar use intended for heating water on alternating current (ac) supply, having a rated storage capacity between 3 litres and 200 litres.",
        "standard_type": "Product Specification",
        "classification": "Electrical & Electronics",
        "certification_status": "Mandatory Certification (BIS Scheme-I)",
        "status": "Active",
        "year": 2018,
        "description": "Primary product specification standard for stationary storage type electric water heaters.",
        "source_reference": "BIS Product Manual for Stationary Storage Type Electric Water Heaters (IS 2082:2018) / BIS Conformity Assessment Scheme-I",
        "meta_info": {
          "capacity_range": "3L - 200L",
          "voltage_rating": "Up to 250V ac single phase",
          "committee": "Electrotechnical Department (ETD)",
          "certification_scheme": "BIS Scheme-I (Marking Fee & Product Manual)"
        }
      },
      "reason": "Direct technical match for Electric Storage Water Heater.",
      "evidence": [
        "Product domain 'Electric Storage Water Heater' aligns with standard title and scope.",
        "Standard classification 'Electrical & Electronics' matches requirement category.",
        "Standard provides primary product specifications and constructional requirements."
      ],
      "relevance": 0.8245,
      "confidence": "High",
      "certification_status": "Mandatory Certification (BIS Scheme-I)"
    },
    {
      "standard": {
        "id": 2,
        "standard_number": "IS 302 (Part 2/Sec 21):2024",
        "title": "Household and Similar Electrical Appliances-Safety Part 2 Particular Requirements Section 21 Storage Water Heaters",
        "scope": "Deals with the safety of stationary storage water heaters for household and similar purposes, their rated voltage being not more than 250 V for single-phase appliances and 480 V for other appliances.",
        "standard_type": "Safety Standard",
        "classification": "Electrical & Electronics",
        "certification_status": "Safety Standard",
        "status": "Active",
        "year": 2024,
        "description": "Current revised safety standard specifying electrical, thermal, and mechanical safety for storage water heaters.",
        "source_reference": "BIS Electrotechnical Department (ETD 32) / Normative Safety Reference under IS 2082:2018",
        "meta_info": {
          "section": "Part 2, Section 21",
          "voltage_limit": "250V single phase / 480V polyphase",
          "replaces_edition": "2018"
        }
      },
      "reason": "Direct technical match for Electric Storage Water Heater.",
      "evidence": [
        "Product domain 'Electric Storage Water Heater' aligns with standard title and scope.",
        "Standard classification 'Electrical & Electronics' matches requirement category.",
        "Standard provides essential safety requirements for appliance operation and protection."
      ],
      "relevance": 0.7631,
      "confidence": "High",
      "certification_status": "Safety Standard"
    }
  ],
  "candidate_standards": [
    {
      "standard": {
        "id": 4,
        "standard_number": "IS 302 (Part 1):2024",
        "title": "Household and similar electrical appliances - Safety - Part 1: General requirements",
        "scope": "Deals with the safety of electrical appliances for household and similar purposes, their rated voltage being not more than 250 V for single-phase appliances and 480 V for other appliances.",
        "standard_type": "Safety Standard",
        "classification": "Electrical & Electronics",
        "certification_status": "Horizontal Safety Standard",
        "status": "Active",
        "year": 2024
      },
      "reason": "Applicable safety requirements under Safety Standard.",
      "evidence": [
        "Normatively referenced by primary applicable standard."
      ],
      "relevance": 0.4000,
      "confidence": "Low",
      "certification_status": "Horizontal Safety Standard"
    },
    {
      "standard": {
        "id": 5,
        "standard_number": "IS/IEC 60730 (Part 1):1999",
        "title": "Automatic Electrical Controls for Household and Similar Use - Part 1: General Requirements",
        "scope": "Applies to automatic electrical controls for use in, on, or in association with equipment for household and similar use...",
        "standard_type": "Safety & Control Standard",
        "classification": "Electrical & Electronics",
        "certification_status": "Component Safety & Control Standard",
        "status": "Active",
        "year": 1999
      },
      "reason": "Candidate standard with semantic alignment score of 0.40.",
      "evidence": [
        "Normatively referenced by primary applicable standard.",
        "Standard specifies control and protective component requirements."
      ],
      "relevance": 0.4000,
      "confidence": "Low",
      "certification_status": "Component Safety & Control Standard"
    }
  ],
  "version_alerts": [],
  "created_at": "2026-09-24T18:00:00.000000+00:00"
}
```

---

## 3. Standards Directory Endpoints

### 3.1. List Standards
- **Method:** `GET`
- **Path:** `/api/standards`
- **Query Parameters:**
  - `search` (string, optional): Substring match on standard number or title.
  - `category` (string, optional): Filter by classification (e.g., `Electrical & Electronics`).
  - `status` (string, optional): Filter by status (`Active` or `Superseded`).

**Example Request:**
```bash
curl "http://127.0.0.1:8000/api/standards?status=Active"
```

**Response (200 OK):** Array of Standard objects.

---

### 3.2. Get Standard Details
- **Method:** `GET`
- **Path:** `/api/standards/{id}`
- **Path Parameter:** `id` (integer, required) - Primary key of the standard.

**Response (200 OK):** Complete Standard object including scope, technical metadata, and committee details.  
**Response (404 Not Found):** `{"detail": "Standard not found"}`

---

### 3.3. Get Standard Relationships
- **Method:** `GET`
- **Path:** `/api/standards/{id}/relationships`
- **Description:** Returns direct outgoing and incoming normative relationships for a standard.

**Response (200 OK):**
```json
{
  "standard_id": 1,
  "standard_number": "IS 2082:2018",
  "outgoing_relationships": [
    {
      "relationship_type": "REFERENCES",
      "target_standard_id": 2,
      "target_standard_number": "IS 302 (Part 2/Sec 21):2024",
      "target_title": "Household and Similar Electrical Appliances-Safety..."
    }
  ],
  "incoming_relationships": []
}
```

---

## 4. Knowledge Graph Endpoint

### 4.1. Get Graph Network
- **Method:** `GET`
- **Path:** `/api/graph`
- **Description:** Generates node and edge structures tailored for `@xyflow/react` (React Flow) rendering.

**Response (200 OK):**
```json
{
  "nodes": [
    {
      "id": "1",
      "data": {
        "label": "IS 2082:2018",
        "title": "Stationary storage type electric water heaters - Specification",
        "type": "Product Specification",
        "status": "Active",
        "classification": "Electrical & Electronics"
      },
      "position": { "x": 100, "y": 200 }
    }
  ],
  "edges": [
    {
      "id": "e-1-2",
      "source": "1",
      "target": "2",
      "label": "REFERENCES",
      "animated": false
    }
  ]
}
```

---

## 5. History Endpoint

### 5.1. List Analysis History
- **Method:** `GET`
- **Path:** `/api/history`
- **Description:** Returns chronological list of requirement analyses stored in the database.

**Response (200 OK):**
```json
[
  {
    "id": "e4f5a6b7-8901-4bc3-9de2-f0123456789a",
    "original_requirement": "500 wall-mounted 25 litre electric storage water heaters for government hostels",
    "created_at": "2026-09-24T18:00:00+00:00",
    "recommendations_count": 2
  }
]
```
