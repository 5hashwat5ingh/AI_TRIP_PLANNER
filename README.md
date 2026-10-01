# AI TravelOps — Multi-Agent Travel Planner

![AI TravelOps](https://img.shields.io/badge/AI-Multi--Agent_System-blue?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-v22+-green?style=for-the-badge)
![React](https://img.shields.io/badge/React_18-Vite-cyan?style=for-the-badge)
![Tailwind](https://img.shields.io/badge/TailwindCSS-v3.4-38bdf8?style=for-the-badge)

**AI TravelOps** is a production-quality full-stack travel planning platform powered by a collaborative network of **9 autonomous specialized AI agents**. Unlike single-prompt chatbots, AI TravelOps orchestrates parallel research, budget auditing, geographic route clustering, meteorological forecasting, constraint validation, and an automated replanning loop to construct personalized, day-by-day itineraries.

---

## 1. System Architecture & Multi-Agent Workflow

```mermaid
flowchart TD

USER([Traveler / User]) --> UI[React 18 + Vite UI]
UI --> ORCHESTRATOR[Master Trip Orchestrator]

ORCHESTRATOR --> PLANNER[Master Planner Agent]

subgraph PARALLEL_RESEARCH [Parallel Agent Execution]
  ORCHESTRATOR --> FLIGHT[Flight Agent]
  ORCHESTRATOR --> HOTEL[Hotel Agent]
  ORCHESTRATOR --> ACTIVITY[Activity Agent]
  ORCHESTRATOR --> WEATHER[Weather Agent]
end

FLIGHT --> TRANSPORT[Transportation Agent]
HOTEL --> TRANSPORT
ACTIVITY --> TRANSPORT

TRANSPORT --> BUDGET[Budget Agent]
FLIGHT --> BUDGET
HOTEL --> BUDGET
ACTIVITY --> BUDGET

BUDGET --> ITINERARY[Itinerary Agent]
WEATHER --> ITINERARY
ACTIVITY --> ITINERARY
HOTEL --> ITINERARY
FLIGHT --> ITINERARY
TRANSPORT --> ITINERARY

ITINERARY --> VALIDATOR[Validator Agent]

VALIDATOR -->|Valid Pass| FINAL([Final Itinerary & Dashboard])
VALIDATOR -->|Constraint Violation| REPLAN[Automated Replanning Engine]
REPLAN -->|Adjusts Tiers & Retries (Max 3)| ORCHESTRATOR
```

---

## 2. The 9 Specialized Agents

| # | Agent Name | Role | Responsibilities |
|---|------------|------|------------------|
| 1 | **Master Planner Agent** | Trip Architect & Intent Parser | Parses natural language or structured constraints, formats traveler requirements, and initializes the shared trip state. |
| 2 | **Flight Agent** | Aviation Route Optimizer | Evaluates airlines, flight durations, layovers, and luggage inclusions matching the traveler style and budget. |
| 3 | **Hotel Agent** | Hospitality Specialist | Scouts accommodations balancing guest reviews, nightly prices, amenities, and transit proximity to attractions. |
| 4 | **Activity Agent** | Experience Curator | Curates landmarks, hidden gems, and cultural experiences mapped to user interest tags. |
| 5 | **Transportation Agent** | Transit Strategist | Designs inter-city rail passes, subway tickets, airport transfers, and calculates transit durations. |
| 6 | **Weather Agent** | Meteorological Analyst | Forecasts climate temperatures and rain probabilities, ensuring outdoor adventures are scheduled on clear days. |
| 7 | **Budget Agent** | Financial Auditor | Aggregates all expense vectors (flights, lodging, dining, activities, transit, buffer) and verifies budget compliance. |
| 8 | **Itinerary Agent** | Master Timetable Synthesizer | Assembles a chronological day-by-day timetable with clustered geography and scheduled dining intervals. |
| 9 | **Validator Agent** | QA & Constraint Enforcer | Audits budget ceilings, schedule overlaps, transit distances, and triggers automatic replanning when necessary. |

---

## 3. Key Features

- **Multi-Agent Orchestration**: Independent parallel execution (`Promise.all`) with shared trip state.
- **Automated Replanning Loop**: Up to 3 iterations adjusting hotel/flight tiers if constraints fail.
- **Natural Language & Multi-Step Inputs**: Input via structured 7-step wizard or natural language prompts.
- **Targeted Itinerary Modification**: Tweak existing trips (*"Make this cheaper"*, *"Add more anime spots"*) without full regeneration.
- **Interactive Budget Visualizer**: Recharts analytics showing percentage breakdowns and cushion metrics.
- **Interactive Route & Location Map**: Visual GeoCluster waypoints for hotels, monuments, and activities.
- **Export & Shareability**: Download PDF format and shareable public links (`/share/trip/:id`).
- **Dark & Light Mode**: Complete theme system with glassmorphism and modern typography.
- **Zero-Config Local Execution**: Built-in mock adapters and in-memory store for instant offline running without paid APIs.

---

## 4. Technology Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Custom Design System
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js v22+
- **Framework**: Express.js
- **Validation**: Zod & JSON Schemas
- **Database**: MongoDB + Mongoose (with In-Memory Store fallback)
- **Auth**: JWT Authentication + bcryptjs
- **AI Integration**: OpenAI API + Autonomous Fallback Reasoning Engine

---

## 5. Folder Structure

```text
ai-travelops/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/               # Button, Card, Badge, Modal
│   │   │   ├── navbar/           # Sticky glassmorphism Navbar
│   │   │   ├── hero/             # Hero, HowItWorks, AgentFlow
│   │   │   ├── agents/           # AgentNetwork, AgentExecutionModal
│   │   │   └── trip/             # Overview, Timeline, Budget, Flights, Hotels, Map, Weather, etc.
│   │   ├── pages/                # Home, PlanTrip, TripResults, Dashboard, SavedTrips, SharedTripView, etc.
│   │   ├── context/              # AuthContext, ThemeContext
│   │   ├── services/             # Axios API Client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/
│   ├── agents/                   # 9 Autonomous Agent Implementations
│   │   ├── plannerAgent.js
│   │   ├── flightAgent.js
│   │   ├── hotelAgent.js
│   │   ├── activityAgent.js
│   │   ├── transportationAgent.js
│   │   ├── weatherAgent.js
│   │   ├── budgetAgent.js
│   │   ├── itineraryAgent.js
│   │   └── validatorAgent.js
│   ├── orchestration/
│   │   └── tripOrchestrator.js   # Orchestration & Replanning Engine
│   ├── services/                 # AI, Flight, Hotel, Places, Weather, Maps, Currency services
│   ├── models/                   # User & Trip Mongoose schemas + In-memory store fallback
│   ├── controllers/              # Auth & Trip controllers
│   ├── routes/                   # Express routes
│   ├── middleware/               # Auth & Error handling
│   ├── config/                   # MongoDB connection config
│   ├── tests/                    # Multi-agent unit & integration tests
│   └── server.js                 # Server entrypoint
│
├── .env.example
├── package.json
└── README.md
```

---

## 6. Getting Started Locally

### 1. Clone & Install Dependencies
```bash
# In the project root directory
npm run install:all
```

### 2. Environment Variables Configuration
Copy `.env.example` to `server/.env`:
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-travelops
JWT_SECRET=super_secret_ai_travelops_jwt_key_2026_secure
CLIENT_URL=http://localhost:5173

# Optional: Add OpenAI Key for live LLM reasoning (leave blank for autonomous built-in engine)
OPENAI_API_KEY=
USE_MOCK_SERVICES=true
```

### 3. Run Development Server (Both Client and Server concurrently)
```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

### 4. Run Automated Test Suite
```bash
npm test
```

---

## 7. API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new traveler account |
| `POST` | `/api/auth/login` | Login user & return JWT token |
| `GET`  | `/api/auth/me` | Fetch authenticated profile |
| `POST` | `/api/trips` | Orchestrate trip with 9 AI agents |
| `GET`  | `/api/trips` | List all trips for current session |
| `GET`  | `/api/trips/:id` | Fetch complete trip state & timeline |
| `PUT`  | `/api/trips/:id` | Update / bookmark trip |
| `DELETE`| `/api/trips/:id` | Delete an itinerary |
| `POST` | `/api/trips/:id/modify` | Apply natural language targeted modification |
| `POST` | `/api/trips/:id/replan` | Force full re-orchestration cycle |
| `GET`  | `/api/trips/share/:shareId` | Public read-only trip viewer |
| `GET`  | `/api/health` | Multi-agent engine health check |

---

## 8. License
MIT © 2026 AI TravelOps
