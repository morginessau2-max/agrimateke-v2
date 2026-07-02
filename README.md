# 🌱 AgriMateKE
### Smart Farming Companion for Kenyan Farmers

AgriMateKE is an AI-powered farm management web application built specifically for Kenyan smallholder farmers. It helps farmers track crops, manage livestock, record sales and expenses, access real-time weather, get market prices, and consult an AI farming assistant — all in one place.

![AgriMateKE](https://img.shields.io/badge/Version-2.0-green) ![License](https://img.shields.io/badge/License-MIT-blue) ![Built with React](https://img.shields.io/badge/Built%20with-React-61dafb)

---

## 🚀 Live Demo
👉 [agrimateke-v2.netlify.app](https://agrimateke-v2.netlify.app)

---

## 📋 Table of Contents
- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Integrations](#api-integrations)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## About
AgriMateKE was born from a simple observation: Kenyan farmers are hardworking and resourceful but lack access to the digital tools that could multiply their productivity and income. Most existing farming apps are built for Western markets and don't understand the Kenyan context — local crops, local markets, local challenges.

AgriMateKE is built from the ground up for Kenya:
- Kenyan crop varieties and farming seasons
- Local market prices (Wakulima, Marikiti, Kongowea)
- Kenya government grants and programs (AFC, KALRO, e-Voucher)
- Kenyan veterinary directory
- AI assistant trained on Kenyan agricultural context
- M-Pesa payment integration (coming Phase 5)
- Swahili language support (coming Phase 5)

---

## ✨ Features

### Phase 2 (Current)
| Module | Description |
|--------|-------------|
| 📊 Dashboard | Real-time farm metrics — revenue, profit, active crops, pending tasks |
| 🌿 My Crops | Track crops through growth stages from seedling to harvest |
| 🐄 Livestock | Manage animal groups, record milk and egg production |
| 💰 Sales & Expenses | Record income and costs, view net profit |
| ✅ Tasks | Farm task manager with priority levels and due dates |
| 🌦️ Weather | Real-time weather with farming advice based on conditions |
| 📈 Market Prices | Indicative produce prices across Kenyan markets |
| 🤖 Shamba Bot | AI farming assistant powered by Claude (Anthropic) |
| 🏥 Vet Directory | Find veterinarians across Kenya by county |
| 📋 Govt Grants | Available funding programs for Kenyan farmers |
| ⚙️ Settings | Profile management and plan information |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** — Component-based UI library
- **Vite** — Fast build tool and development server
- **JSX** — JavaScript XML for component templating
- **CSS-in-JS** — Inline styles for component-scoped styling

### Backend / Serverless
- **Netlify Functions** — Serverless functions for API proxying
- **Node.js** — Runtime for serverless functions

### APIs & Services
- **Anthropic Claude API** — Powers Shamba Bot AI assistant
- **Open-Meteo API** — Free weather forecast data
- **Nominatim (OpenStreetMap)** — Free reverse geocoding

### DevOps
- **Netlify** — Hosting, CI/CD, serverless functions
- **GitHub** — Version control and source code management
- **Git** — Local version control

---

## 🏁 Getting Started

### Prerequisites
Make sure you have the following installed:
- Node.js v18 or higher
- npm v9 or higher
- Netlify CLI

### Installation

1. Clone the repository
```bash
git clone https://github.com/morginessau2-max/agrimateke-v2.git
cd agrimateke-v2
```

2. Install dependencies
```bash
npm install
```

3. Install Netlify CLI globally
```bash
sudo npm install -g netlify-cli
```

4. Set up environment variables
```bash
cp .env.example .env
```
Then open `.env` and fill in your actual values.

5. Log in to Netlify
```bash
netlify login
```

6. Link to your Netlify project
```bash
netlify init
```

7. Set environment variables in Netlify
```bash
netlify env:set VITE_ANTHROPIC_API_KEY your_key_here
```

8. Start the development server
```bash
netlify dev
```

The app will be available at `http://localhost:8888`

---

## 🔐 Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
# Anthropic API Key — powers Shamba Bot AI
# Get yours at: https://console.anthropic.com
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Supabase — coming in Phase 3
# VITE_SUPABASE_URL=your_supabase_url_here
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

> ⚠️ Never commit your `.env` file to GitHub. It is already in `.gitignore`.

---

## 📁 Project Structure
agrimateke-v2/
├── netlify/
│   └── functions/
│       └── chat.js          # Serverless function — Anthropic API proxy
├── public/
│   └── vite.svg
├── src/
│   ├── App.jsx              # Main application — all components
│   ├── App.css              # Global styles
│   ├── index.css            # Root styles
│   └── main.jsx             # React entry point
├── .env                     # Local environment variables (not committed)
├── .env.example             # Environment variable template
├── .gitignore               # Git ignore rules
├── index.html               # HTML entry point
├── netlify.toml             # Netlify configuration
├── package.json             # Dependencies and scripts
├── README.md                # This file
└── vite.config.js           # Vite configuration

---

## 🔌 API Integrations

### Anthropic Claude API
- **Endpoint:** `POST /v1/messages`
- **Model:** `claude-sonnet-4-20250514`
- **Purpose:** Powers Shamba Bot farming assistant
- **Auth:** API key via serverless function (never exposed to client)
- **Cost:** ~$0.01 per conversation

### Open-Meteo API
- **Endpoint:** `GET https://api.open-meteo.com/v1/forecast`
- **Purpose:** Real-time weather and 7-day forecast
- **Auth:** None required (free, no API key)
- **Parameters:** latitude, longitude, current conditions, daily forecast, Africa/Nairobi timezone

### Nominatim (OpenStreetMap)
- **Endpoint:** `GET https://nominatim.openstreetmap.org/reverse`
- **Purpose:** Convert GPS coordinates to human-readable location name
- **Auth:** None required (free, no API key)

---

## 🗺️ Roadmap

### ✅ Phase 1 — Prototype (Complete)
- Static HTML/CSS/JS prototype
- All UI modules designed
- Deployed to Netlify

### ✅ Phase 2 — React Frontend (Complete)
- Migrated to React + Vite
- All 11 modules built and functional
- Real weather API integration
- Shamba Bot AI integration (requires Anthropic credits)
- Netlify serverless functions
- GitHub CI/CD pipeline

### 🔄 Phase 3 — Backend & Auth (In Progress)
- Supabase authentication (email + phone OTP)
- PostgreSQL database for data persistence
- User profiles and farm data saved to cloud
- Admin dashboard for vet directory verification
- Crop disease scanner (Claude Vision API)

### 📅 Phase 4 — Monetisation (Planned)
- M-Pesa Daraja API integration
- Stripe for card payments
- Free / Pro / Cooperative Pro tier enforcement
- Cooperative Head dashboard
- 20-farmer management system

### 📅 Phase 5 — Growth (Planned)
- Full Swahili language support
- PWA — offline capability
- SMS alerts via Africa's Talking
- Android/iOS app (React Native)
- Expansion beyond Kenya 🌍

---

## 💰 Pricing Plans

| Feature | Free | Pro (KSh 500/mo) | Cooperative Pro (KSh 8,000/mo) |
|---------|------|-------------------|-------------------------------|
| Dashboard | ✅ | ✅ | ✅ |
| Crops | ✅ | ✅ | ✅ |
| Livestock | ✅ | ✅ | ✅ |
| Sales & Expenses | ✅ | ✅ | ✅ |
| Tasks | ✅ | ✅ | ✅ |
| Weather | ✅ | ✅ | ✅ |
| Market Prices | ✅ | ✅ | ✅ |
| Shamba Bot | Limited | Unlimited | Unlimited |
| Vet Directory | ✅ | ✅ | ✅ |
| Govt Grants | ✅ | ✅ | ✅ |
| Export Reports | ❌ | ✅ | ✅ |
| SMS Alerts | ❌ | ✅ | ✅ |
| Cooperative Dashboard | ❌ | ❌ | ✅ |
| Farmers Managed | 1 | 1 | 20 |

---

## 🤝 Contributing
AgriMateKE is currently in active development. Contributions, ideas and feedback are welcome.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Author
**Essau Morgin**
- GitHub: [@morginessau2-max](https://github.com/morginessau2-max)
- Built with ❤️ for Kenyan farmers

---

## 📄 License
This project is licensed under the MIT License.

---

*Built with ❤️ for Kenyan farmers 🌱*