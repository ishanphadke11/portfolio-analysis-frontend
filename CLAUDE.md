# Claude Instructions — FactorLens React Frontend

You are assisting with the FactorLens React frontend — a Fama-French Factor Analysis Platform.

## Project Overview

FactorLens lets users sign up, add stock holdings (ticker + quantity), run a Fama-French five-factor analysis, and view results. The backend (Spring Boot 4.0.1, Java 21) and analysis service (Python Flask) are complete. This frontend consumes their APIs.

## Architecture

```
React Frontend (port 3000) ──► Spring Boot API (port 8080) ──► PostgreSQL
                                        │
                                        ▼
                               Python Flask (port 5001)
```

The frontend only talks to Spring Boot. It never calls Flask directly.

## Backend API Reference

Base URL: `http://localhost:8080`

All endpoints except auth require a JWT token in the `Authorization: Bearer <token>` header.

### Auth Endpoints (public)

**POST /api/v1/auth/register**
```json
// Request
{ "email": "user@example.com", "password": "password123" }
// Response (201 Created)
{ "token": "eyJhbG...", "email": "user@example.com" }
```

**POST /api/v1/auth/login**
```json
// Request
{ "email": "user@example.com", "password": "password123" }
// Response (200 OK)
{ "token": "eyJhbG...", "email": "user@example.com" }
```

### Holdings Endpoints (authenticated)

**GET /api/v1/holdings** → `200 OK`
```json
[
  { "id": 1, "ticker": "AAPL", "quantity": 10.5 },
  { "id": 2, "ticker": "TSLA", "quantity": 5.0 }
]
```

**POST /api/v1/holdings** → `201 Created`
```json
// Request
{ "ticker": "AAPL", "quantity": 10.5 }
// Response
{ "id": 1, "ticker": "AAPL", "quantity": 10.5 }
```

**PUT /api/v1/holdings/{id}** → `200 OK`
```json
// Request
{ "ticker": "AAPL", "quantity": 25.0 }
// Response
{ "id": 1, "ticker": "AAPL", "quantity": 25.0 }
```

**DELETE /api/v1/holdings/{id}** → `204 No Content`

### Analysis Endpoints (authenticated)

**POST /api/v1/analysis/run** → `200 OK`
Optional query params: `?startDate=2022-01-01&endDate=2025-01-01` (defaults: endDate=today, startDate=3 years ago)
```json
{
  "id": 1,
  "analysisDate": "2025-02-11T15:30:00",
  "alpha": 0.000234,
  "betaMkt": 0.856420,
  "betaSmb": 0.123456,
  "betaHml": -0.045678,
  "betaRmw": 0.032145,
  "betaCma": -0.012345,
  "rSquared": 0.876543,
  "tStats": {
    "alpha": 1.2345,
    "mkt": 15.6789,
    "smb": 2.3456,
    "hml": -0.9876,
    "rmw": 1.5432,
    "cma": -0.6543
  }
}
```

**GET /api/v1/analysis/history** → `200 OK`
```json
[
  {
    "id": 1,
    "analysisDate": "2025-02-11T15:30:00",
    "alpha": 0.000234,
    "betaMkt": 0.856420,
    "betaSmb": 0.123456,
    "betaHml": -0.045678,
    "betaRmw": 0.032145,
    "betaCma": -0.012345,
    "rSquared": 0.876543,
    "tStats": null
  }
]
```
Note: `tStats` is only present on fresh analysis results from `/run`. Historical results have `tStats: null`.

**GET /api/v1/analysis/{id}** → `200 OK`
Same shape as a single item from history.

### Error Responses

All errors follow this shape:
```json
{ "error": "Human-readable error message" }
```

| Status | Meaning |
|--------|---------|
| 400 | Bad request (validation, no holdings, etc.) |
| 401 | Unauthorized (missing/invalid JWT) |
| 404 | Not found (invalid ticker, no data for date range) |
| 502 | Flask service unavailable |

### The Five Factors (for display/labels)

| Field | Factor | Display Name | Description |
|-------|--------|-------------|-------------|
| betaMkt | Mkt-RF | Market | Exposure to overall market movements |
| betaSmb | SMB | Size | Small vs large company exposure |
| betaHml | HML | Value | Value vs growth stock exposure |
| betaRmw | RMW | Profitability | Profitable company exposure |
| betaCma | CMA | Investment | Conservative vs aggressive spenders |
| alpha | Alpha | Alpha | Excess return (stock-picking skill) |
| rSquared | R² | R-Squared | Model fit (0-1, how much factors explain) |

## Tech Stack

- React 18, Vite, React Router, Axios, Recharts
- Tailwind CSS v4 (via @tailwindcss/vite plugin)
- No backend framework needed — pure API consumer

## Planned Pages/Features

### Core Features
1. **Login/Register** — auth forms, store JWT
2. **Dashboard** — holdings table, add/edit/delete holdings, "Run Analysis" button
3. **Results** — factor exposure bar chart (Recharts), summary table with alpha, betas, R²

### Optional Features
4. **Analysis History** — list past analysis results
5. **Risk Decomposition** — pie chart (systematic vs idiosyncratic risk)

### Ticker Autocomplete
- When adding a holding, the ticker input shows a dropdown of matching tickers as the user types
- Uses a **static JSON file** bundled in the app (Option A) — no external API dependency
- JSON contains `{ "symbol": "AAPL", "name": "Apple Inc." }` entries for major US-listed stocks
- Filters on both symbol and company name

## Workflow Preferences
- **Suggest, don't implement**: Only tell the user what to add/modify — do NOT write code directly unless explicitly asked
- The user will manually implement the suggested changes
- Only write/edit code when the user says something like "implement this" or "make the changes yourself"

## User Context
- The user is **new to / unfamiliar with React, JavaScript, and Tailwind CSS**
- All suggested code must have **clear, easy-to-understand comments on every line**
- Explain React concepts (components, hooks, JSX, state, props, routing, etc.) as they come up
- Prioritize clarity and learning over brevity

## Output Style
- **Detailed explanations**: For every step, explain:
  1. What we are doing right now
  2. Why we are doing it
  3. How it connects to what we've built before
- Show diffs or file-level changes when modifying code
- Suggest improvements only when safe and relevant

## Progress Tracking

### Milestone 1: Project Setup & Foundation
- [x] Step 1 — Scaffold Vite + React app with Tailwind CSS v4
- [x] Step 2 — Project folder structure & Axios API client
- [ ] Step 3 — React Router & basic layout

### Milestone 2: Authentication
- [x] Login & Register pages, JWT storage, protected routes

### Milestone 3: Dashboard & Holdings Management
- [x] Holdings table, add/edit/delete, ticker autocomplete

### Milestone 4: Factor Analysis & Results
- [x] Run analysis, summary table

### Milestone 5: Analysis History
- [ ] List past analyses, view details

### Milestone 6: Polish & Optional Features
- [ ] Error handling, loading states, risk decomposition pie chart
