# Pulse REST API Documentation

Base URL: `http://localhost:8000`  
Interactive Docs: `http://localhost:8000/docs`

---

## CORS Headers
CORS allowed origins are configured for localhost ports 5173/5174. Custom origins should be appended to the CORS origins array in main.py.

## Authentication

All protected endpoints require a **Bearer token** in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

---

### POST /api/auth/login

Authenticate a user and receive an access token.

**Request Body**
```json
{
  "email": "sneha@ashoka.com",
  "password": "password123"
}
```

**Response** `200 OK`
```json
{
  "access_token": "eyJhbGci...",
  "token_type": "bearer",
  "user_id": "u3",
  "active_role": "manager"
}
```

**Error** `401 Unauthorized`
```json
{ "detail": "Invalid credentials" }
```

---

### GET /api/auth/me

Returns the profile of the currently authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response** `200 OK`
```json
{
  "id": "u3",
  "company_id": "ashoka",
  "department_id": "<uuid>",
  "name": "Sneha Iyer",
  "title": "Design Lead",
  "email": "sneha@ashoka.com",
  "initials": "SI",
  "manager_id": "u1",
  "join_date": "2021-06-01",
  "roles": ["manager", "employee"]
}
```

---

### POST /api/auth/logout

Clears the session (client-side token removal).

**Response** `200 OK`
```json
{ "message": "Logged out successfully" }
```

---

## Companies

### GET /api/companies

List all companies (admin/HR only in production).

**Response** `200 OK`
```json
[
  {
    "id": "ashoka",
    "name": "Ashoka Textiles",
    "theme": "theme-ashoka",
    "logo": "AT",
    "tagline": "Crafting futures, thread by thread."
  },
  {
    "id": "brightpath",
    "name": "Bright Path Consulting",
    "theme": "theme-brightpath",
    "logo": "BP",
    "tagline": "Clarity in every decision."
  }
]
```

---

### GET /api/companies/{company_id}

Get a single company by ID.

**Response** `200 OK`
```json
{
  "id": "ashoka",
  "name": "Ashoka Textiles",
  "theme": "theme-ashoka",
  "logo": "AT",
  "tagline": "Crafting futures, thread by thread."
}
```

---

## Employee

### GET /api/employee/dashboard

Returns the authenticated employee's growth dashboard.

**Headers:** `Authorization: Bearer <token>`

**Response** `200 OK`
```json
{
  "user": { "id": "u7", "name": "Sampath Kumar", "roles": ["employee"], "..." : "..." },
  "latest": {
    "id": "ev6",
    "month": "June",
    "year": 2024,
    "status": "locked",
    "overall_score": 4.4,
    "dimensions": [
      { "parameter_id": "ownership", "score": 5, "comment": "..." }
    ]
  },
  "history": [
    { "month": "May", "score": 0.0 },
    { "month": "June", "score": 4.4 }
  ],
  "dimensionTrends": [],
  "evaluations": ["..."]
}
```

---

### GET /api/employee/history?employee_id={id}

Get all evaluations for a specific employee.

**Response** `200 OK` — Array of `EvaluationSchema`

---

## Manager

### GET /api/manager/dashboard

Returns the authenticated manager's coaching dashboard including team members, pending evaluations, and coaching insights.

**Headers:** `Authorization: Bearer <token>`

**Response** `200 OK`
```json
{
  "manager": { "id": "u3", "name": "Sneha Iyer", "..." : "..." },
  "team": [
    { "id": "u4", "name": "Rahul Verma", "title": "Product Designer", "..." : "..." }
  ],
  "priorities": [
    {
      "member": { "id": "u4", "name": "Rahul Verma", "..." : "..." },
      "evaluation": { "id": "ev1", "status": "draft", "..." : "..." },
      "status": "draft",
      "progress": 20
    }
  ],
  "stats": {
    "totalReports": 1,
    "completed": 0,
    "pending": 1,
    "completionRate": 0
  },
  "insights": {
    "completionRate": 0,
    "avgWordCount": 0,
    "reviewsWithActionable": 0
  }
}
```

---

### GET /api/manager/team-overview

Returns all team members with their latest evaluation scores.

**Response** `200 OK`
```json
{
  "team": [
    {
      "member": { "id": "u4", "name": "Rahul Verma", "..." : "..." },
      "latest": { "id": "ev1", "status": "draft", "..." : "..." },
      "overallScore": 0.0,
      "dimensions": []
    }
  ]
}
```

---

## Evaluations (Conversations)

### GET /api/evaluations/{id}

Fetch a single evaluation (conversation) by ID.

**Response** `200 OK` — `EvaluationSchema`

---

### POST /api/evaluations/{id}/draft

Save a draft of dimension scores for an in-progress evaluation.

**Request Body** — Array of dimension updates:
```json
[
  { "parameter_id": "ownership",     "score": 4, "comment": "Great ownership this month." },
  { "parameter_id": "communication", "score": 3, "comment": "Improving steadily." },
  { "parameter_id": "quality",       "score": 4, "comment": "High quality output." },
  { "parameter_id": "collaboration", "score": 5, "comment": "Excellent team player." },
  { "parameter_id": "initiative",    "score": 3, "comment": "Room to grow here." }
]
```

**Response** `200 OK` — Updated `EvaluationSchema`

---

### POST /api/evaluations/{id}/submit

Submit an evaluation. Computes overall score from dimension scores and marks status as `submitted`.

**Request Body** — Same as `/draft`

**Response** `200 OK` — Updated `EvaluationSchema` with `overall_score` computed

---

### POST /api/evaluations/create?employee_id={id}&month={month}&year={year}

Create a new evaluation for an employee.

**Query Parameters:**
- `employee_id` — Target employee ID
- `month` — Month name (e.g. `July`)
- `year` — Year (e.g. `2024`)

**Response** `200 OK` — Newly created `EvaluationSchema`

---

## HR

### GET /api/hr/dashboard

Returns HR-level organizational health data.

**Headers:** `Authorization: Bearer <token>`

**Response** `200 OK`
```json
{
  "stats": {
    "completed": 2,
    "pending": 1,
    "overdue": 1,
    "drafts": 1,
    "total": 10,
    "completionRate": 20
  },
  "managersPending": [
    {
      "manager": { "id": "u2", "name": "Rohan Menon", "title": "Engineering Lead" },
      "pendingCount": 1
    }
  ],
  "deptProgress": [
    { "name": "Design",      "progress": 50 },
    { "name": "Engineering", "progress": 0  }
  ],
  "trend": [
    { "month": "Feb", "rate": 58 },
    { "month": "Jul", "rate": 20 }
  ],
  "waitingManagers": 1
}
```

---

### GET /api/hr/org-tree

Returns the full organizational hierarchy tree rooted at the company head.

**Response** `200 OK`
```json
{
  "id": "u1",
  "name": "Priya Sharma",
  "title": "Founder & CEO",
  "roles": ["hr", "admin"],
  "children": [
    {
      "id": "u2",
      "name": "Rohan Menon",
      "title": "Engineering Lead",
      "children": [
        { "id": "u5", "name": "Arjun Mehta", "children": [] },
        { "id": "u7", "name": "Sampath Kumar", "children": [] }
      ]
    }
  ]
}
```

---

## Common Schemas

### EvaluationSchema
| Field | Type | Description |
|---|---|---|
| `id` | string | Evaluation UUID |
| `company_id` | string | Company identifier |
| `employee_id` | string | Employee user ID |
| `manager_id` | string | Manager user ID |
| `month` | string | Month name (e.g. `July`) |
| `year` | integer | Year (e.g. `2024`) |
| `status` | enum | `draft` \| `pending` \| `submitted` \| `reviewed` \| `locked` |
| `due_date` | string | ISO date string |
| `overall_score` | float? | Computed average of dimension scores |
| `dimensions` | array | List of `DimensionScore` |

### EvaluationStatus Enum
| Value | Description |
|---|---|
| `draft` | Manager started but hasn't submitted |
| `pending` | Not yet started |
| `submitted` | Submitted, awaiting HR lock |
| `reviewed` | HR has reviewed |
| `locked` | Final, immutable |

---

## Error Codes

| Code | Meaning |
|---|---|
| `400` | Bad request / validation error |
| `401` | Missing or invalid token |
| `403` | Insufficient permissions for this role |
| `404` | Resource not found |
| `422` | Unprocessable entity (Pydantic validation) |
| `500` | Internal server error |

---

## Seed Credentials

| Role | Email | Password |
|---|---|---|
| HR / Admin (Ashoka) | `priya@ashoka.com` | `password123` |
| Manager (Ashoka) | `sneha@ashoka.com` | `password123` |
| Manager (Ashoka) | `rohan@ashoka.com` | `password123` |
| Employee (Ashoka) | `sampath@ashoka.com` | `password123` |
| Employee (Ashoka) | `rahul@ashoka.com` | `password123` |
| HR / Admin (Bright Path) | `founder@brightpath.com` | `password123` |
| Manager (Bright Path) | `divya@brightpath.com` | `password123` |

