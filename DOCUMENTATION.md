# AgriMateKE — Full Technical Documentation
## Phase 1 & Phase 2

**Project:** AgriMateKE — Smart Farming Companion for Kenyan Farmers  
**Author:** Essau Morgin  
**Version:** 2.0  
**Date:** July 2026  
**Status:** Phase 2 Complete  

---

# TABLE OF CONTENTS

1. Executive Summary
2. Project Overview
3. Problem Statement
4. Solution
5. Phase 1 — Prototype
6. Phase 2 — React Application
7. System Architecture
8. Module Documentation
9. API Documentation
10. Database Schema (Phase 3 Preview)
11. Security
12. Deployment
13. Testing
14. Known Issues & Technical Debt
15. Roadmap
16. Glossary

---

# 1. EXECUTIVE SUMMARY

AgriMateKE is a web-based smart farming companion application built for Kenyan smallholder farmers. The application provides farm management tools including crop tracking, livestock management, financial recording, weather forecasting, market price information, and an AI-powered farming assistant called Shamba Bot.

The project was developed in two phases:
- Phase 1 produced a fully functional HTML prototype demonstrating all planned features
- Phase 2 migrated the prototype to a production-grade React application with real API integrations and serverless backend functions

The application is currently deployed on Netlify and targets the 4.5 million smallholder farmers in Kenya as its primary market.

---

# 2. PROJECT OVERVIEW

| Item | Detail |
|------|--------|
| Project Name | AgriMateKE |
| Tagline | Smart Farming Companion for Kenyan Farmers |
| Current Version | 2.0 (Phase 2) |
| Repository | github.com/morginessau2-max/agrimateke-v2 |
| Live URL | agrimateke-v2.netlify.app |
| Primary Language | JavaScript (JSX) |
| Framework | React 18 + Vite |
| Hosting | Netlify |
| Target Market | Kenyan smallholder farmers |
| Pricing Model | Freemium (Free / Pro / Cooperative Pro) |

---

# 3. PROBLEM STATEMENT

Kenyan smallholder farmers face several critical challenges:

**Information Gap**
Farmers lack access to real-time market prices, leading to exploitation by middlemen who buy produce cheaply and resell at high margins. A farmer in Eldoret may sell maize at KSh 30/kg without knowing the Nairobi wholesale price is KSh 45/kg.

**Poor Record Keeping**
Most farmers keep no financial records. They cannot calculate their actual profit or loss per season, making it impossible to make data-driven decisions about what to plant and when to sell.

**Crop Disease & Pest Management**
Farmers often misdiagnose crop diseases, applying wrong treatments and losing entire harvests. Access to agricultural extension officers is limited especially in rural areas.

**Livestock Health**
Finding a qualified veterinarian quickly during a disease outbreak is difficult. By the time a farmer locates a vet, significant livestock losses may have occurred.

**Weather Risk**
Climate change has made traditional farming calendars unreliable. Farmers need real-time weather data and farming advice to make planting and harvesting decisions.

**Cooperative Management**
Agricultural cooperatives in Kenya manage dozens of member farmers but lack digital tools to monitor individual farmer performance and aggregate data.

---

# 4. SOLUTION

AgriMateKE addresses these challenges through an integrated digital platform:

- **Crop Tracking** — Monitor every crop from planting to harvest
- **Livestock Management** — Track animals and production records
- **Financial Recording** — Record all sales and expenses, view net profit
- **Task Management** — Plan and track farm activities
- **Real-Time Weather** — Location-based forecasts with farming advice
- **Market Prices** — Crowdsourced produce prices from Kenyan markets
- **Shamba Bot** — AI assistant for instant farming advice in English and Swahili
- **Vet Directory** — Find verified veterinarians by county
- **Government Grants** — Discover available funding programs
- **Cooperative Dashboard** — (Phase 4) Head farmer monitors all member farmers

---

# 5. PHASE 1 — PROTOTYPE

## 5.1 Overview
Phase 1 was a fully functional prototype built in a single HTML file. The goal was to design and validate all user interface modules before committing to a full framework migration.

## 5.2 Technology Used
- Pure HTML5
- CSS3 (inline styles)
- Vanilla JavaScript (ES6)
- No external libraries or frameworks
- No build tools required

## 5.3 Features Built
All 11 modules were designed and implemented as UI prototypes:
- Dashboard with hardcoded sample data
- Crops module with add/edit/delete
- Livestock module with production records
- Sales and Expenses with financial summary
- Task manager
- Weather (hardcoded sample data)
- Market Prices (hardcoded)
- Shamba Bot (keyword-based responses, not real AI)
- Vet Directory (sample data)
- Government Grants (real program data)
- Settings

## 5.4 Limitations
- All data stored in JavaScript variables — lost on page refresh
- No real API integrations — all data was hardcoded or simulated
- Shamba Bot used keyword matching, not real AI
- Single file architecture — not scalable for production
- No authentication or user accounts

## 5.5 Outcome
Phase 1 successfully validated the user interface design and module structure. The prototype was deployed to Netlify as a live demo and served as the complete specification for Phase 2 development.

---

# 6. PHASE 2 — REACT APPLICATION

## 6.1 Overview
Phase 2 migrated the Phase 1 prototype to a production-grade React application using Vite as the build tool. Real API integrations were implemented for weather data and the AI assistant.

## 6.2 Technology Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.x | UI component library |
| Vite | 5.x | Build tool and dev server |
| JSX | — | Component templating |
| JavaScript ES6+ | — | Application logic |

### Backend (Serverless)
| Technology | Version | Purpose |
|-----------|---------|---------|
| Netlify Functions | — | Serverless API proxy |
| Node.js | 20.x | Function runtime |

### External Services
| Service | Purpose | Cost |
|---------|---------|------|
| Anthropic Claude API | Shamba Bot AI | ~$0.01/conversation |
| Open-Meteo API | Weather data | Free |
| Nominatim API | Reverse geocoding | Free |

### DevOps
| Tool | Purpose |
|------|---------|
| Git | Version control |
| GitHub | Remote repository |
| Netlify | Hosting and CI/CD |
| Netlify CLI | Local development and deployment |

## 6.3 Architecture Overview

CLIENT (Browser)
│
▼
React Application (Vite SPA)
│
├── Static modules (no server needed)
│   ├── Dashboard
│   ├── Crops
│   ├── Livestock
│   ├── Sales & Expenses
│   ├── Tasks
│   ├── Market Prices
│   ├── Vet Directory
│   ├── Govt Grants
│   └── Settings
│
├── External API calls (direct from client)
│   ├── Open-Meteo (Weather)
│   └── Nominatim (Geocoding)
│
└── Serverless Function calls
└── /api/chat
│
▼
Netlify Function (chat.js)
│
▼
Anthropic API (Claude)

## 6.4 State Management

React useState hooks with state lifted to the root App component:

```javascript
// Shared state — all modules read and write here
const [crops,     setCrops]     = useState([])
const [tasks,     setTasks]     = useState([])
const [sales,     setSales]     = useState([])
const [expenses,  setExpenses]  = useState([])
const [livestock, setLivestock] = useState([])
const [userName,  setUserName]  = useState('Farmer')
```

State is passed down to child components as props. No external state management library (Redux/Zustand) was used — prop drilling is acceptable at this scale.

## 6.5 Routing

Client-side routing implemented without React Router — a simple switch/case pattern on a page state variable:

```javascript
const [page, setPage] = useState('dashboard')

function renderPage() {
  switch (page) {
    case 'dashboard': return <Dashboard ... />
    case 'crops':     return <Crops ... />
    // etc
  }
}
```

This decision keeps the bundle size small and avoids URL-based navigation which is unnecessary before authentication is implemented.

---

# 7. SYSTEM ARCHITECTURE

## 7.1 Component Hierarchy

App (root)
├── Sidebar
├── Topbar
└── Main Content Area
├── Dashboard
│   └── MetricCard (×4)
├── Crops
├── Livestock
├── Sales
├── Tasks
├── Weather
├── MarketPrices
├── ShambaBot
├── VetDirectory
├── GovtGrants
├── Settings
└── ComingSoon (fallback)

## 7.2 Data Flow
User Action (e.g. Add Crop)
│
▼
Child Component (Crops)
calls setCrops(prev => [...prev, newCrop])
│
▼
App State Updates (crops array)
│
▼
React re-renders all components
that receive crops as props
│
▼
Dashboard metrics automatically
update to reflect new crop

## 7.3 Serverless Function Flow
User sends message to Shamba Bot
│
▼
ShambaBot component
POST /api/chat (no API key)
│
▼
netlify.toml redirect:
/api/* → /.netlify/functions/*
│
▼
netlify/functions/chat.js
reads process.env.VITE_ANTHROPIC_API_KEY
│
▼
HTTPS request to api.anthropic.com/v1/messages
with farmer context in system prompt
│
▼
Claude AI generates farming advice
│
▼
Response returned to ShambaBot component
displayed in chat interface

---

# 8. MODULE DOCUMENTATION

## 8.1 Dashboard

**Purpose:** Provides an at-a-glance overview of the entire farm operation.

**Data Sources:** All metrics derived from shared state arrays — no hardcoded values.

**Key Metrics:**
- Total Revenue — sum of all sales
- Net Profit — total revenue minus total expenses
- Active Crops — crops not in harvested stage
- Pending Tasks — incomplete tasks

**Computed Values:**
```javascript
const activeCrops   = crops.filter(c => c.stage !== 'harvested').length
const pendingTasks  = tasks.filter(t => !t.done).length
const overdueTasks  = tasks.filter(t => !t.done && t.due && t.due < today).length
const totalRevenue  = sales.reduce((sum, s) => sum + s.total, 0)
const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
const netProfit     = totalRevenue - totalExpenses
```

**Features:**
- Time-based greeting (Good morning/afternoon/evening)
- Overdue task alert banner
- Today's task preview panel
- Shamba Bot teaser with navigation
- Financial summary (visible when data exists)

---

## 8.2 Crops Module

**Purpose:** Track all crops from planting through to harvest.

**Data Model:**
```javascript
{
  id:       number,    // Date.now() + Math.random()
  name:     string,    // e.g. "Maize"
  variety:  string,    // e.g. "H614D"
  acres:    number,    // e.g. 2.5
  planted:  string,    // ISO date e.g. "2026-03-15"
  harvest:  string,    // ISO date e.g. "2026-07-15"
  stage:    string,    // seedling|growing|flowering|ready|harvested
  notes:    string     // free text
}
```

**Stage Progression:**
seedling → growing → flowering → ready → harvested
**Features:**
- Add crop form with validation
- Stage update buttons on each crop card
- Visual stage badges with color coding
- Delete with confirmation
- Empty state with call to action

---

## 8.3 Livestock Module

**Purpose:** Manage animal groups and track production records.

**Data Model:**
```javascript
{
  id:      number,
  emoji:   string,    // e.g. "🐄"
  name:    string,    // e.g. "Main Herd"
  type:    string,    // Dairy|Beef|Layers|Broilers|Goats|Sheep|Pigs|Other
  count:   number,    // number of animals
  notes:   string,
  records: [          // production records array
    {
      id:   number,
      type: string,   // milk|eggs|weight|other
      qty:  number,
      date: string    // ISO date
    }
  ]
}
```

**Features:**
- Emoji picker for animal type selection
- Production recording form (milk, eggs, weight)
- Cumulative production totals per animal group
- Recent records display (last 3)
- Delete group with confirmation

---

## 8.4 Sales & Expenses Module

**Purpose:** Record all farm income and costs, view financial performance.

**Sale Data Model:**
```javascript
{
  id:    number,
  item:  string,    // e.g. "Maize"
  qty:   number,    // quantity sold
  price: number,    // price per unit
  total: number,    // total amount (auto-calculated or manual)
  buyer: string,    // e.g. "Wakulima Market"
  date:  string     // ISO date
}
```

**Expense Data Model:**
```javascript
{
  id:     number,
  desc:   string,   // description
  cat:    string,   // seeds|fertiliser|labour|equipment|veterinary|fuel|transport|other
  amount: number,
  date:   string
}
```

**Features:**
- Auto-calculation of total when qty × price entered
- Three tab views: Overview, Sales table, Expenses table
- Category badges for expenses
- Delete records with confirmation
- Financial summary cards (revenue, expenses, net profit)

---

## 8.5 Tasks Module

**Purpose:** Plan and track all farm activities with priority and due dates.

**Data Model:**
```javascript
{
  id:       number,
  title:    string,
  desc:     string,
  priority: string,   // low|medium|high
  category: string,   // general|crops|livestock|financial|maintenance|other
  due:      string,   // ISO date
  done:     boolean,
  created:  string    // ISO date
}
```

**Features:**
- Five filter views: All, Pending, Today, Overdue, Done
- Filter badge counts
- Priority color coding (blue/yellow/red)
- Overdue detection and visual highlighting
- One-click task completion toggle
- Category icons
- Overdue alert banner

---

## 8.6 Weather Module

**Purpose:** Display real-time weather and farming advice based on current conditions.

**API Used:** Open-Meteo (free, no API key required)

**API Endpoint:**

GET https://api.open-meteo.com/v1/forecast
?latitude={lat}
&longitude={lon}
&current=temperature_2m,relative_humidity_2m,
wind_speed_10m,precipitation,weather_code
&daily=temperature_2m_max,temperature_2m_min,
precipitation_sum,weather_code
&timezone=Africa/Nairobi
&forecast_days=7

**Location Detection Flow:**
1. Request GPS via navigator.geolocation
2. If granted → reverse geocode with Nominatim
3. If denied → default to Nairobi (-1.2921, 36.8219)

**Farming Advice Logic:**
```javascript
// Thunderstorm → shelter livestock
// Rain → hold off spraying
// Very hot (>32°C) → water crops early/late
// Very cold (<12°C) → protect seedlings
// Clear and dry → good for fieldwork
```

**Features:**
- Auto-detect location on module load
- Current conditions card (temperature, humidity, wind, precipitation)
- Dynamic farming advice based on weather code and temperature
- 7-day forecast grid
- Manual refresh button
- Graceful error handling with fallback location

---

## 8.7 Market Prices Module

**Purpose:** Provide indicative produce prices from Kenyan markets.

**Data Structure:**
```javascript
{
  id:       number,
  name:     string,    // e.g. "Maize (Dry)"
  category: string,    // cereals|vegetables|legumes|fruits|livestock|cash
  price:    number,    // price in KSh
  unit:     string,    // kg|litre|bunch|piece|tray|head
  market:   string,    // e.g. "Wakulima Market"
  county:   string,    // e.g. "Nairobi"
  trend:    string,    // up|down|stable
  change:   number     // price change amount
}
```

**Important Note:** Baseline prices are indicative estimates based on Kenyan market knowledge as of early 2026. They are not real-time and should be verified before making selling decisions. Phase 3 will implement a fully crowdsourced model with farmer-submitted prices.

**Features:**
- 18 baseline price entries across 6 categories
- Category filter buttons
- Search by crop, market or county
- Community price submission form
- Trend indicators (↑ ↓ →)
- Community badge for farmer-submitted prices

---

## 8.8 Shamba Bot Module

**Purpose:** AI-powered farming assistant that knows the farmer's actual farm data.

**AI Provider:** Anthropic Claude (claude-sonnet-4-20250514)

**Architecture:**

Client → POST /api/chat → Netlify Function → Anthropic API

**System Prompt Strategy:**
The system prompt includes:
1. Shamba Bot personality and expertise definition
2. Real-time farmer data (crops, livestock, tasks, financials)
3. Behavioral rules (language switching, price disclaimer)

**Farmer Context Injection:**
```javascript
function buildContext() {
  return `
FARMER: ${userName}
ACTIVE CROPS: ${activeCrops.map(c => 
  `${c.name} (${c.stage}, ${c.acres} acres)`).join(', ')}
LIVESTOCK: ${livestock.map(l => 
  `${l.name} - ${l.count} ${l.type}`).join(', ')}
PENDING TASKS: ${pendingTasks.map(t => t.title).join(', ')}
REVENUE: KSh ${totalRevenue.toLocaleString()}
NET PROFIT: KSh ${netProfit.toLocaleString()}
  `
}
```

**Conversation History:** Last 10 messages sent with each request for context continuity.

**Features:**
- Real Claude AI responses (not keyword matching)
- Farm-aware responses using actual farmer data
- Suggestion chips for common questions
- Typing indicator animation
- Auto-scroll to latest message
- Bilingual (English/Swahili based on user's language)

**Requirement:** Anthropic API credits (approx $5 minimum)

---

## 8.9 Vet Directory Module

**Purpose:** Help farmers find veterinarians quickly by county and speciality.

**Data Model:**
```javascript
{
  id:          number,
  name:        string,    // e.g. "Dr. James Mutua"
  phone:       string,    // e.g. "0712 345 678"
  county:      string,    // e.g. "Nairobi"
  speciality:  string,    // e.g. "Dairy Cattle"
  location:    string,    // e.g. "Kasarani"
  available:   boolean
}
```

**Important Note:** Current vet data is sample data for demonstration purposes. Real vets have not been verified. Phase 3 will implement an admin verification system requiring Kenya Veterinary Board (KVB) registration numbers.

**Features:**
- 12 sample vet entries across 10 counties
- Search by name, speciality or location
- Filter by county dropdown
- Availability badge (Available/Unavailable)
- Direct call button using tel: protocol
- Community submission form
- "Community Added" badge for unverified entries

---

## 8.10 Government Grants Module

**Purpose:** Help farmers discover available funding programs.

**Data:** 10 real Kenyan government and international funding programs including:
- AFC Agricultural Loan
- KALRO Research Grants
- e-Voucher Subsidy Program
- Youth in Agribusiness Fund
- Women Enterprise Fund
- USAID Kenya Crops & Dairy
- Greenhouse Horticulture Grant
- Livestock Insurance Subsidy
- IFC Agri-Finance Program
- Drip Irrigation Subsidy

**Important Note:** Program details (amounts, deadlines) should be verified directly with the organization before applying as they may change.

**Features:**
- Filter by grant/loan/subsidy type
- Full-text search
- Eligibility information
- Amount and deadline display
- Direct link to organization website
- Disclaimer banner

---

## 8.11 Settings Module

**Purpose:** Manage user profile and view plan information.

**Features:**
- Edit farmer name (updates Dashboard greeting in real-time)
- Farm name input
- County selector (all 47 Kenyan counties)
- Phone number input
- Language selector (English / Kiswahili — coming Phase 5)
- Save confirmation feedback
- Current plan display (Free)
- Pro plan upgrade card with M-Pesa CTA
- About AgriMateKE section

---

# 9. API DOCUMENTATION

## 9.1 Serverless Function: /api/chat

**Endpoint:** POST /api/chat  
**Handler:** netlify/functions/chat.js  
**Purpose:** Secure proxy for Anthropic Claude API

**Request Body:**
```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 1024,
  "system": "System prompt with farmer context",
  "messages": [
    {"role": "user", "content": "User message"},
    {"role": "assistant", "content": "Previous response"}
  ]
}
```

**Response Body:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "Claude's response text"
    }
  ]
}
```

**Error Responses:**
```json
{"error": "NO API KEY FOUND IN ENVIRONMENT"}
{"error": "Error message from Anthropic"}
```

**Security:**
- API key stored in Netlify environment variables
- Key never exposed to client
- Function validates HTTP method (POST only)

---

## 9.2 Open-Meteo Weather API

**Endpoint:** GET https://api.open-meteo.com/v1/forecast  
**Authentication:** None required  
**Rate Limit:** 10,000 requests/day (free tier)

**Parameters Used:**

latitude          float    GPS latitude
longitude         float    GPS longitude
current           string   Comma-separated current variables
daily             string   Comma-separated daily variables
timezone          string   Africa/Nairobi
forecast_days     int      7

---

## 9.3 Nominatim Geocoding API

**Endpoint:** GET https://nominatim.openstreetmap.org/reverse  
**Authentication:** None required  
**Usage Policy:** Maximum 1 request/second

**Parameters:**

lat     float    GPS latitude
lon     float    GPS longitude
format  string   json

---

# 10. DATABASE SCHEMA (Phase 3 Preview)

The following Supabase PostgreSQL schema is planned for Phase 3:

```sql
-- Users (handled by Supabase Auth)
-- profiles extends auth.users
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name   TEXT,
  farm_name   TEXT,
  county      TEXT,
  phone       TEXT,
  plan        TEXT DEFAULT 'free', -- free|pro|cooperative_pro
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Crops
CREATE TABLE crops (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  variety     TEXT,
  acres       DECIMAL,
  planted     DATE,
  harvest     DATE,
  stage       TEXT DEFAULT 'seedling',
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Livestock
CREATE TABLE livestock (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  emoji       TEXT,
  name        TEXT NOT NULL,
  type        TEXT,
  count       INTEGER DEFAULT 0,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Livestock Production Records
CREATE TABLE livestock_records (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  livestock_id  UUID REFERENCES livestock(id) ON DELETE CASCADE,
  type          TEXT,  -- milk|eggs|weight|other
  qty           DECIMAL,
  recorded_date DATE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Sales
CREATE TABLE sales (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  item        TEXT NOT NULL,
  qty         DECIMAL,
  price       DECIMAL,
  total       DECIMAL NOT NULL,
  buyer       TEXT,
  sale_date   DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Expenses
CREATE TABLE expenses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES profiles(id) ON DELETE CASCADE,
  description   TEXT,
  category      TEXT,
  amount        DECIMAL NOT NULL,
  expense_date  DATE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks
CREATE TABLE tasks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  priority    TEXT DEFAULT 'medium',
  category    TEXT DEFAULT 'general',
  due_date    DATE,
  done        BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Vets (admin verified)
CREATE TABLE vets (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  phone         TEXT NOT NULL,
  county        TEXT NOT NULL,
  speciality    TEXT,
  location      TEXT,
  kvb_number    TEXT,          -- Kenya Veterinary Board registration
  available     BOOLEAN DEFAULT TRUE,
  verified      BOOLEAN DEFAULT FALSE,  -- admin must verify
  submitted_by  UUID REFERENCES profiles(id),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Market Prices (crowdsourced)
CREATE TABLE market_prices (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_name     TEXT NOT NULL,
  category      TEXT,
  price         DECIMAL NOT NULL,
  unit          TEXT,
  market        TEXT NOT NULL,
  county        TEXT,
  submitted_by  UUID REFERENCES profiles(id),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Cooperatives
CREATE TABLE cooperatives (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  county      TEXT,
  head_id     UUID REFERENCES profiles(id),  -- cooperative head
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Cooperative Members
CREATE TABLE cooperative_members (
  cooperative_id  UUID REFERENCES cooperatives(id) ON DELETE CASCADE,
  farmer_id       UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at       TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (cooperative_id, farmer_id)
);
```

---

# 11. SECURITY

## 11.1 API Key Management
- Anthropic API key stored in Netlify environment variables
- Key injected into serverless function at runtime via process.env
- Key never included in client-side JavaScript bundle
- .env file excluded from version control via .gitignore

## 11.2 GitHub Push Protection
GitHub's secret scanning detected and blocked a commit containing an exposed API key. The key was:
1. Immediately revoked at console.anthropic.com
2. Removed from git history using git filter-branch
3. A new key was generated and set via netlify env:set

## 11.3 Known Security Limitations (Phase 2)
- No authentication — any user can access any view
- No rate limiting on serverless function
- No input sanitization on form fields
- No CSRF protection

All above will be addressed in Phase 3 with Supabase Auth.

---

# 12. DEPLOYMENT

## 12.1 Development Environment
```bash
# Start development server with serverless functions
netlify dev
# Available at http://localhost:8888
```

## 12.2 Production Deployment
Deployment is automatic via Netlify CI/CD:
1. Push to main branch on GitHub
2. Netlify detects push via webhook
3. Netlify runs: npm run build
4. Built files from dist/ are deployed
5. Serverless functions from netlify/functions/ are deployed
6. Live in approximately 60 seconds

## 12.3 netlify.toml Configuration
```toml
[build]
  command = "npm run build"
  publish = "dist"

[dev]
  command = "npm run dev"
  port = 8888

[functions]
  directory = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

---

# 13. TESTING

## 13.1 Current Testing Approach
Phase 2 relied on manual testing of all modules. No automated tests are implemented.

**Manual Testing Checklist:**
- [ ] Dashboard metrics update when crops/tasks/sales are added
- [ ] Crops can be added, stage updated, and deleted
- [ ] Livestock groups can be added with production records
- [ ] Sales auto-calculate total from qty × price
- [ ] Task filters work correctly (all/pending/today/overdue/done)
- [ ] Weather loads and displays for current location
- [ ] Market price search and category filters work
- [ ] Shamba Bot sends and receives messages (requires API credits)
- [ ] Vet search and county filter work
- [ ] Grant search and type filter work
- [ ] Settings name change reflects in Dashboard and Shamba Bot

## 13.2 Phase 3 Testing Plan
- Unit tests with Vitest
- Component tests with React Testing Library
- End-to-end tests with Playwright
- API integration tests for serverless functions

---

# 14. KNOWN ISSUES & TECHNICAL DEBT

| Issue | Severity | Phase to Fix |
|-------|----------|-------------|
| No data persistence — resets on refresh | Critical | Phase 3 |
| No authentication | Critical | Phase 3 |
| Vet directory contains sample data | High | Phase 3 |
| Market prices are indicative not real-time | High | Phase 3 |
| All code in single App.jsx file | Medium | Phase 3 |
| No error boundaries | Medium | Phase 3 |
| No automated tests | Medium | Phase 3 |
| No loading skeletons | Low | Phase 3 |
| No offline support | Low | Phase 5 |
| Swahili not implemented | Low | Phase 5 |

---

# 15. ROADMAP

## Phase 3 — Backend & Authentication
**Target: 2026 Q3**
- Supabase project setup
- PostgreSQL database with schema above
- Supabase Auth (email + phone OTP)
- Data persistence — all farm data saved to cloud
- Admin dashboard for vet verification
- Crop disease scanner using Claude Vision API
- Split App.jsx into feature modules
- Error boundaries and loading states

## Phase 4 — Monetisation
**Target: 2026 Q4**
- M-Pesa Daraja API integration
- Stripe for card payments
- Plan tier enforcement (Free/Pro/Cooperative Pro)
- Cooperative Head dashboard
- 20-farmer management system
- Advanced analytics and reports

## Phase 5 — Growth
**Target: 2027 Q1**
- Full Swahili language support
- PWA — offline capability with service workers
- SMS alerts via Africa's Talking
- React Native mobile app
- Expansion to Uganda, Tanzania, Rwanda

---

# 16. GLOSSARY

| Term | Definition |
|------|-----------|
| React | JavaScript library for building user interfaces using reusable components |
| Vite | Fast frontend build tool and development server |
| JSX | JavaScript XML — allows HTML-like syntax inside JavaScript |
| Component | Reusable UI building block in React |
| Props | Data passed from parent to child component |
| State | Data that changes over time within a component |
| Hook | Special React function (useState, useEffect, useRef) |
| Serverless Function | Code that runs on a server without managing the server |
| API | Application Programming Interface — way for systems to talk to each other |
| REST API | API that uses HTTP requests to exchange data |
| Environment Variable | Secret configuration value stored outside the codebase |
| CI/CD | Continuous Integration/Continuous Deployment — automated build and deploy pipeline |
| PWA | Progressive Web App — web app that works like a native mobile app |
| CRUD | Create, Read, Update, Delete — basic data operations |
| UUID | Universally Unique Identifier — unique ID for database records |
| Supabase | Open-source Firebase alternative with PostgreSQL database |
| KVB | Kenya Veterinary Board — regulatory body for veterinarians in Kenya |
| AFC | Agricultural Finance Corporation — Kenya government lending institution |
| KALRO | Kenya Agricultural & Livestock Research Organization |
| M-Pesa | Safaricom mobile money platform dominant in Kenya |

---

*AgriMateKE Documentation v2.0*  
*Last Updated: July 2026*  
*Author: Essau Morgin*  
*Built with ❤️ for Kenyan farmers 🌱*

