# 🗳️ Varahe - Indian Election Data Visualization Dashboard

A full-stack analytics platform for exploring Indian General Elections (1991-2019) using interactive visualizations, real-time filtering, and comprehensive data insights.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue) ![Python](https://img.shields.io/badge/Python-3.10+-yellow)

---

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start Guide](#-quick-start-guide)
- [API Documentation](#-api-documentation)
- [Dashboard Components](#-dashboard-components)
- [Data Processing](#-data-processing)
- [Project Structure](#-project-structure)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### 📊 **6 Interactive Visualizations**
1. **Party Seat Share** - Stacked bar chart showing seat distribution across parties per year
2. **State Turnout Map** - Interactive India choropleth map + horizontal bar chart
3. **Gender Representation** - Line chart tracking male/female/other candidate percentages
4. **Vote Share Distribution** - Donut chart of top parties by total votes
5. **Victory Margins** - Histogram showing close races vs landslides
6. **Constituency Results** - Sortable, paginated table with candidate search

### 🔍 **Advanced Filtering**
- Year range slider (1991-2019)
- Multi-select state and party filters
- Gender category chips (Male, Female, Other, Unknown)
- Constituency name search
- Winners-only toggle

### 🚀 **Performance Features**
- React Query caching for instant chart updates
- Debounced search inputs
- Pagination for large result sets
- Responsive design (desktop/tablet/mobile)

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, TailwindCSS, Recharts, React Query, React Simple Maps |
| **Backend** | Node.js 18+, Express 5, PostgreSQL 14+, Joi validation |
| **Data Processing** | Python 3.10+, Pandas, SQLAlchemy, psycopg2 |
| **Dev Tools** | ESLint, Git, npm, nodemon |

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Version | Installation Guide |
|------|---------|-------------------|
| **Node.js** | 18+ | [Download](https://nodejs.org/) or use `nvm install 18` |
| **PostgreSQL** | 14+ | [Download](https://www.postgresql.org/download/) or `brew install postgresql` (Mac) / `sudo apt install postgresql` (Linux) |
| **Python** | 3.10+ | [Download](https://www.python.org/downloads/) |
| **Git** | Latest | [Download](https://git-scm.com/downloads) |

### Verify Installations
```bash
node --version   # Should show v18 or higher
npm --version    # Should show 8+
psql --version   # Should show 14+
python3 --version # Should show 3.10+
```

---

## 🚀 Quick Start Guide

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/varahe.git
cd varahe
```

### Step 2: Set Up PostgreSQL Database

**Option A: Using psql (Recommended)**
```bash
# Start PostgreSQL service
sudo service postgresql start  # Linux
brew services start postgresql # macOS

# Create database and user
psql postgres
```

In the PostgreSQL prompt:
```sql
CREATE DATABASE varahe;
CREATE USER kadappa WITH PASSWORD 'kadappa';
GRANT ALL PRIVILEGES ON DATABASE varahe TO kadappa;
\q
```

**Option B: Using pgAdmin**
- Open pgAdmin
- Right-click "Databases" → Create → Database
- Name: `varahe`
- Owner: Create user `kadappa` with password `kadappa`

### Step 3: Process and Import Data

```bash
cd data_preprocessing

# Create Python virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # Mac/Linux
# OR
venv\Scripts\activate     # Windows

# Install Python dependencies
pip install pandas sqlalchemy psycopg2-binary

# Run preprocessing script (cleans CSV and loads into PostgreSQL)
python3 preprocessing.py
```

**Expected Output:**
```
Data cleaning complete. Filtered for 1991-2019.
Data stored in PostgreSQL table 'election_data'.
```

**Note:** If you see errors, verify your database credentials in `preprocessing.py` (lines 79-83):
```python
user = "kadappa"
password = "kadappa"
host = "localhost"
port = "5432"
database = "varahe"
```

### Step 4: Configure Backend

```bash
cd ../backend

# Install Node.js dependencies
npm install

# Create environment file
cp .env.example .env
```

**Edit `.env` file** (if your database credentials differ):
```env
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_USER=kadappa
DB_PASSWORD=kadappa
DB_NAME=varahe
DB_SSL=false
```

**Start Backend Server:**
```bash
npm run dev
```

**Expected Output:**
```
Server running on http://localhost:4000
Database connected!
```

**Test Backend:**
```bash
# In a new terminal
curl http://localhost:4000/api/elections?limit=1
# Should return JSON with 1 election record
```

### Step 5: Configure Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file (optional - uses default http://localhost:4000)
echo "VITE_API_BASE_URL=http://localhost:4000/api" > .env.local

# Start development server
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 6: Access Dashboard

Open your browser and navigate to:
```
http://localhost:5173
```

You should see the dashboard with all charts loaded! 🎉

---

## 📡 API Documentation

### Base URL
```
http://localhost:4000/api
```

### Endpoints

#### 1. **GET /elections** - Paginated Election Records

**Description:** Fetch election records with optional filters

**Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `year` | string | Single year or range | `2019` or `2014-2019` |
| `state_name` | string | State name (case-insensitive) | `Karnataka` |
| `party` | string | Party abbreviation | `BJP`, `INC` |
| `sex` | string | Gender filter | `MALE`, `FEMALE`, `O`, `UNKNOWN` |
| `constituency_name` | string | Constituency name | `Bangalore North` |
| `page` | integer | Page number (default: 1) | `2` |
| `limit` | integer | Records per page (default: 100) | `50` |

**Example Request:**
```bash
curl 'http://localhost:4000/api/elections?year=2019&state_name=Karnataka&limit=20'
```

**Response:**
```json
{
  "meta": {
    "total": 234,
    "page": 1,
    "limit": 20
  },
  "data": [
    {
      "Year": 2019,
      "State_Name": "KARNATAKA",
      "Constituency_Name": "BANGALORE NORTH",
      "Candidate": "D. V. SADANANDA GOWDA",
      "Party": "BJP",
      "Sex": "MALE",
      "Votes": 867862,
      "Turnout_Percentage": 68.45,
      "Vote_Share_Percentage": 56.23,
      "Margin": 123456,
      "Position": 1,
      "Is_Winner": true
    }
  ]
}
```

---

#### 2. **GET /turnout/by-state** - State-wise Turnout Analysis

**Description:** Get average voter turnout percentage by state

**Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `year` | string | Single year or range | `2014-2019` |

**Example Request:**
```bash
curl 'http://localhost:4000/api/turnout/by-state?year=2019'
```

**Response:**
```json
{
  "meta": {
    "yearRange": { "from": 2019, "to": 2019 }
  },
  "data": [
    {
      "state": "ANDHRA PRADESH",
      "avg_turnout": 79.73
    },
    {
      "state": "KARNATAKA",
      "avg_turnout": 69.25
    }
  ]
}
```

---

#### 3. **GET /party/seat-share** - Party Performance

**Description:** Seats won by each party per election year

**Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `year` | string | Year range (optional) | `2009-2019` |

**Example Request:**
```bash
curl 'http://localhost:4000/api/party/seat-share?year=2014-2019'
```

**Response:**
```json
{
  "meta": {
    "yearRange": { "from": 2014, "to": 2019 }
  },
  "data": [
    {
      "year": 2019,
      "party": "BJP",
      "seats_won": 303
    },
    {
      "year": 2019,
      "party": "INC",
      "seats_won": 52
    }
  ]
}
```

---

#### 4. **GET /gender/representation** - Gender Statistics

**Description:** Percentage of candidates by gender over time

**Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `year` | string | Year range (optional) | `1991-2019` |

**Example Request:**
```bash
curl 'http://localhost:4000/api/gender/representation'
```

**Response:**
```json
{
  "meta": {
    "yearRange": null
  },
  "data": [
    {
      "year": 2019,
      "sex": "MALE",
      "candidates": 8598,
      "percentage": 93.67
    },
    {
      "year": 2019,
      "sex": "FEMALE",
      "candidates": 581,
      "percentage": 6.33
    }
  ]
}
```

---

#### 5. **GET /margin-distribution** - Victory Margin Analysis

**Description:** Distribution of victory margins in histogram buckets

**Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `year` | string | Year range (optional) | `2019` |

**Example Request:**
```bash
curl 'http://localhost:4000/api/margin-distribution?year=2019'
```

**Response:**
```json
{
  "meta": {
    "yearRange": { "from": 2019, "to": 2019 }
  },
  "data": [
    {
      "bucket": "0-999",
      "races": 12
    },
    {
      "bucket": "1k-4.9k",
      "races": 45
    },
    {
      "bucket": "5k-9.9k",
      "races": 89
    },
    {
      "bucket": "10k-49.9k",
      "races": 234
    },
    {
      "bucket": "50k+",
      "races": 165
    }
  ]
}
```

---

#### 6. **GET /search/candidates** - Candidate Search

**Description:** Search candidates by name with full electoral history

**Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `q` | string | Search query (min 2 chars) | `Gandhi` |
| `limit` | integer | Max results (default: 25) | `10` |

**Example Request:**
```bash
curl 'http://localhost:4000/api/search/candidates?q=Gandhi&limit=5'
```

**Response:**
```json
{
  "meta": {
    "query": "Gandhi",
    "resultCount": 5
  },
  "data": [
    {
      "candidate_name": "RAHUL GANDHI",
      "total_elections": 4,
      "total_wins": 3,
      "states": ["UTTAR PRADESH", "KERALA"],
      "parties": ["INC"],
      "history": [
        {
          "year": 2019,
          "state": "KERALA",
          "constituency": "WAYANAD",
          "party": "INC",
          "votes": 706367,
          "position": 1,
          "is_winner": true
        }
      ]
    }
  ]
}
```

---

## 📊 Dashboard Components

### Charts Overview

| Component | Type | Data Source | Purpose |
|-----------|------|-------------|---------|
| **PartySeatShareChart** | Stacked Bar | `/party/seat-share` | Show seat distribution by party/year |
| **IndiaMap** | Choropleth | `/turnout/by-state` | Visualize state-wise turnout on map |
| **TurnoutChart** | Horizontal Bar | `/turnout/by-state` | Compare turnout across states |
| **GenderRepresentationChart** | Line Chart | `/gender/representation` | Track gender diversity trends |
| **VoteShareChart** | Donut | `/elections` (aggregated) | Display top parties by vote % |
| **MarginDistributionChart** | Histogram | `/margin-distribution` | Analyze victory margin ranges |
| **ConstituencyResultsTable** | Table | `/elections` | Browse/search election records |
| **CandidateSearch** | Cards | `/search/candidates` | Lookup candidate history |

### Filter Panel Features
- **Year Range Slider:** Adjust election year range (1991-2019)
- **State Multi-Select:** Filter by one or more states
- **Party Multi-Select:** Filter by party abbreviations
- **Gender Chips:** Toggle MALE, FEMALE, O, UNKNOWN
- **Winners Toggle:** Show only winning candidates
- **Constituency Search:** Find specific constituencies

---

## 🔄 Data Processing

### Preprocessing Steps Explained

The `data_preprocessing/preprocessing.py` script performs these operations:

1. **Filtered Years:** Kept rows only where Year is between 1991 and 2019
2. **Filled Missing Gender:** Replaced empty Sex values with "UNKNOWN"
3. **Filled Missing Parties:** Replaced empty Party values with "INDEPENDENT"
4. **Fixed Numbers:** Converted Votes, Electors, Margins to integers, replaced blanks with 0
5. **Recalculated Turnout:** Computed `Turnout_Percentage = (Valid_Votes / Electors) × 100`
6. **Capped Outliers:** Set any Turnout_Percentage over 100% back to 100
7. **Standardized Text:** Converted all names, states, parties to UPPERCASE, removed extra spaces
8. **Unified State Names:** Renamed old spellings (ORISSA → ODISHA, PONDICHERRY → PUDUCHERRY)
9. **Normalized Gender:** M/MALE → MALE, F/FEMALE → FEMALE, NOTA → UNKNOWN
10. **Calculated Vote Share:** Created `Vote_Share_Percentage` column for every candidate
11. **Flagged Winners:** Created `Is_Winner` column (True/False) for Position 1 candidates
12. **Exported Data:** Saved cleaned dataset to PostgreSQL `election_data` table

### Database Schema

**Table:** `election_data`

| Column | Type | Description |
|--------|------|-------------|
| Year | INTEGER | Election year (1991-2019) |
| State_Name | VARCHAR | State name (normalized) |
| Constituency_Name | VARCHAR | Constituency name |
| Constituency_No | INTEGER | Constituency number |
| Party | VARCHAR | Party abbreviation (BJP, INC, etc.) |
| Candidate | VARCHAR | Candidate name |
| Sex | VARCHAR | Gender (MALE, FEMALE, O, UNKNOWN) |
| Votes | INTEGER | Votes received by candidate |
| Valid_Votes | INTEGER | Total valid votes in constituency |
| Electors | INTEGER | Total registered voters |
| Turnout_Percentage | NUMERIC | Voter turnout % |
| Vote_Share_Percentage | NUMERIC | Candidate's vote share % |
| Margin | INTEGER | Victory margin (for winners) |
| Position | INTEGER | Candidate's rank (1 = winner) |
| Is_Winner | BOOLEAN | True if Position = 1 |
| Party_Type_TCPD | VARCHAR | National/Regional/State party |
| MyNeta_education | VARCHAR | Candidate education level |

**Total Records:** 64,748

---

## 📁 Project Structure

```
varahe/
├── backend/                    # Node.js Express API
│   ├── src/
│   │   ├── app.js              # Express app configuration
│   │   ├── server.js           # Server bootstrap
│   │   ├── config/             # Environment config
│   │   ├── controllers/        # API business logic
│   │   │   ├── analyticsController.js    # Charts endpoints
│   │   │   ├── electionController.js     # Elections CRUD
│   │   │   └── searchController.js       # Candidate search
│   │   ├── routes/             # Express routers
│   │   ├── middleware/         # Validation & error handling
│   │   ├── utils/              # Filter & pagination helpers
│   │   ├── validation/         # Joi schemas
│   │   └── db/                 # PostgreSQL connection pool
│   ├── package.json
│   └── .env.example
│
├── frontend/                   # React Vite Dashboard
│   ├── src/
│   │   ├── components/
│   │   │   ├── charts/         # Recharts visualizations
│   │   │   │   ├── PartySeatShareChart.jsx
│   │   │   │   ├── IndiaMap.jsx
│   │   │   │   ├── TurnoutChart.jsx
│   │   │   │   ├── GenderRepresentationChart.jsx
│   │   │   │   ├── VoteShareChart.jsx
│   │   │   │   └── MarginDistributionChart.jsx
│   │   │   ├── table/          # Data table components
│   │   │   ├── search/         # Candidate search
│   │   │   └── common/         # Shared UI components
│   │   ├── context/            # React Context (filters)
│   │   ├── hooks/              # Custom hooks
│   │   ├── services/           # API client
│   │   └── utils/              # Formatters
│   ├── package.json
│   └── .env.local (create this)
│
├── data_preprocessing/         # Python data pipeline
│   ├── preprocessing.py        # Data cleaning script
│   ├── analyze.py              # Optional analysis script
│   ├── All_States_GE.csv       # Raw dataset (download separately)
│   ├── cleaned_election_data.csv  # Output CSV
│   └── venv/                   # Python virtual environment
│
└── README.md                   # This file
```

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### 1. **Database Connection Failed**

**Error:** `ECONNREFUSED` or `password authentication failed`

**Solution:**
- Verify PostgreSQL is running: `sudo service postgresql status`
- Check credentials in `backend/.env` match your database
- Ensure database `varahe` exists: `psql -l | grep varahe`
- Grant permissions: `GRANT ALL PRIVILEGES ON DATABASE varahe TO kadappa;`

#### 2. **Python Dependencies Error**

**Error:** `ModuleNotFoundError: No module named 'pandas'`

**Solution:**
```bash
cd data_preprocessing
source venv/bin/activate  # Make sure venv is activated
pip install --upgrade pip
pip install pandas sqlalchemy psycopg2-binary
```

#### 3. **Port Already in Use**

**Error:** `EADDRINUSE: address already in use :::4000`

**Solution:**
```bash
# Find process using port 4000
lsof -ti:4000

# Kill the process
kill -9 $(lsof -ti:4000)

# Or change port in backend/.env
PORT=4001
```

#### 4. **Charts Not Loading**

**Error:** Charts show empty or "No data available"

**Solution:**
- Check browser console (F12) for API errors
- Verify backend is running: `curl http://localhost:4000/api/elections?limit=1`
- Clear React Query cache: Hard refresh (Ctrl+Shift+R)
- Check year filter - ensure at least one year is selected

#### 5. **CSV File Not Found**

**Error:** `FileNotFoundError: All_States_GE.csv`

**Solution:**
- Download dataset from [Lok Dhaba Portal](https://lokdhaba.ashoka.edu.in/browse-data)
- Place in `data_preprocessing/All_States_GE.csv`
- Verify file exists: `ls -lh data_preprocessing/All_States_GE.csv`

---

## 🚀 Production Deployment

### Build for Production

**Backend:**
```bash
cd backend
npm start  # Uses production mode
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview  # Test production build locally
```

### Environment Variables for Production

**Backend (.env):**
```env
NODE_ENV=production
PORT=4000
DB_HOST=your-production-db-host
DB_SSL=true  # Enable for cloud databases
```

**Frontend (.env.production):**
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### Deployment Platforms

- **Backend:** Heroku, Railway, Render, AWS EC2
- **Frontend:** Vercel, Netlify, GitHub Pages
- **Database:** AWS RDS, Supabase, Heroku Postgres

---

## 📄 License

This project is created for educational purposes as part of an Engineering Talent Program assignment.

## 👨‍💻 Author

[Your Name]
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Dataset: [Lok Dhaba (TCPD)](https://lokdhaba.ashoka.edu.in/) - Ashoka University
- India Map TopoJSON: React Simple Maps
- Charts Library: Recharts

---

**Happy Analyzing! 📊🗳️**

## 🛠️ Prerequisites

| Tool | Version (min) | Notes |
| --- | --- | --- |
| Node.js + npm | 18+ | Required for both backend and frontend. |
| PostgreSQL | 14+ | Stores the `election_data` table consumed by the API. |
| Python | 3.10+ | Used by the optional preprocessing script to clean/import CSV data. |

> Tip: macOS/Linux users can install Node via `nvm` and Postgres via `brew`, `apt`, or Docker. Windows users can rely on the official installers or WSL.

## 🗃️ Prepare the election dataset

1. Download the raw CSV into `data_preprocessing/All_States_GE.csv` (already present if you cloned the data bundle).
2. (Optional but recommended) Create a Python virtual environment:
	```bash
	cd data_preprocessing
	python -m venv .venv
	source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
	pip install pandas sqlalchemy psycopg2-binary
	```
3. Run the cleaning + import script (update the credentials inside `preprocessing.py` if they differ from your local Postgres user):
	```bash
	python preprocessing.py
	```
	This produces `cleaned_election_data.csv` and loads it into the `election_data` table of the `varahe` database.
4. Alternatively, import the CSV manually:
	```sql
	\copy election_data FROM 'cleaned_election_data.csv' CSV HEADER;
	```

Ensure the database user referenced in the backend `.env` has rights to query the table.

## 🚦 Running everything locally

1. **Backend API**
	```bash
	cd backend
	cp .env.example .env  # edit DB_* values if needed
	npm install
	npm run dev
	```
	The server boots on `http://localhost:4000` (configurable via `PORT`). Use `npm start` for a production-style run.

2. **Frontend dashboard** (in a second terminal)
	```bash
	cd frontend
	npm install
	echo "VITE_API_BASE_URL=http://localhost:4000/api" > .env.local  # optional override
	npm run dev
	```
	Visit `http://localhost:5173`. The dashboard automatically proxies requests to the backend URL specified by `VITE_API_BASE_URL`.

3. **Health check**
	- Hit `http://localhost:4000/api/elections?limit=1` to confirm the API can read Postgres.
	- Load the dashboard and tweak filters to ensure charts/table refresh.

4. **Production builds**
	```bash
	cd backend && npm start             # uses compiled Node runtime
	cd frontend && npm run build && npm run preview
	```

## Varahe Election Analytics Backend

This repository contains a PostgreSQL-backed Node.js API that powers an interactive dashboard for Indian General Election insights. The backend exposes filterable and aggregated election metrics for rapid visualization and analysis.

### 📦 Tech Stack
- Node.js + Express 5
- PostgreSQL (`pg` connection pool)
- Joi for request validation
- CORS-enabled JSON APIs

### 🚀 Quickstart
```bash
cd backend
cp .env.example .env  # or create manually if you deploy elsewhere
npm install
npm run dev
```

The API listens on `http://localhost:4000` by default. Adjust `.env` for database credentials (defaults match the provided `varahe` database). Key environment variables:

```
PORT=4000
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=varahe_user
DB_PASSWORD=change_me
DB_NAME=varahe
DB_SSL=false
```

### 🔌 Available Endpoints (all prefixed with `/api`)
| Method | Path | Description |
| --- | --- | --- |
| GET | `/elections` | Paginated election records with filters for year, state, party, sex, and constituency. |
| GET | `/turnout/by-state` | Average turnout percentage grouped by state for a year or range. |
| GET | `/party/seat-share` | Seats won per party per year (winners only). |
| GET | `/gender/representation` | Candidate share (%) by sex per election year. |
| GET | `/margin-distribution` | Histogram buckets describing victory margins. |
| GET | `/search/candidates` | Candidate lookup with full performance history. |

### 🧪 Example Requests
```bash
curl 'http://localhost:4000/api/elections?year=2019&state_name=Karnataka&limit=20'

curl 'http://localhost:4000/api/turnout/by-state?year=2004-2019'

curl 'http://localhost:4000/api/search/candidates?q=Gandhi&limit=25'
```

Each endpoint responds with structured JSON including metadata (pagination or year range) plus the requested data payload. Detailed inline comments in the controllers (`backend/src/controllers`) highlight the SQL queries and expected response shapes.

### 🛡️ Validation & Security
- All parameters are validated and sanitized with Joi before hitting the database.
- Queries use bound parameters to block SQL injection.
- Errors are normalized through custom middleware for consistent client handling.

### 🗂️ Project Structure (backend)
```
src/
	app.js               # Express app wiring
	server.js            # Bootstrap + DB readiness check
	config/              # Environment configuration
	controllers/         # Business logic & SQL
	routes/              # Express routers per feature set
	middleware/          # Validation & error handlers
	utils/               # Filter + pagination helpers
	validation/          # Joi schemas
```

### ✅ Next Steps
- Plug the API into the visualization frontend.
- Add caching or materialized views if aggregate queries become heavy.
- Layer in automated tests (Jest or node:test) for controllers and utilities.

Happy hacking!

---

## Varahe Election Analytics Frontend

The `/frontend` directory hosts a Vite-powered React 18 dashboard that consumes the backend APIs to provide rich visual analytics, filtering, and search utilities.

### 🧰 Frontend Stack
- React 18 with functional components & hooks
- Vite for dev/build
- React Query for API caching
- Recharts for all visualizations
- React Select for multi-select controls
- Custom context for global filter state

### ▶️ Running the dashboard
```bash
cd frontend
npm install
npm run dev
```

The dev server defaults to `http://localhost:5173` and expects the backend API at `http://localhost:4000`. Override via `.env` or `VITE_API_BASE_URL` if needed.

### 🧭 Key UI Building Blocks
| Component | Purpose |
| --- | --- |
| `FilterPanel` | Year sliders, multi-selects for state/party, gender chips, constituency search, winners toggle. |
| `PartySeatShareChart` | Stacked bars for seats won per party/year. |
| `TurnoutChart` | Horizontal bars summarizing state-level turnout. |
| `GenderRepresentationChart` | Line chart showing male/female/unknown candidate share over time. |
| `MarginDistributionChart` | Histogram buckets for margin-of-victory analysis. |
| `VoteShareChart` | Donut chart of top parties by vote share (derived from filtered results). |
| `ConstituencyResultsTable` | Paginated, sortable table synced with active filters. |
| `CandidateSearch` | Debounced lookup with full performance history cards. |

All charts automatically refetch when the year filter changes, while the table, vote-share chart, and search respect the entire filter state for drill-down workflows.

### 📱 Responsiveness & Accessibility
- CSS grid/flex layouts adapt from widescreen dashboards down to phones.
- Keyboard-focusable controls (chips, toggles, dropdowns) plus semantic status messaging for loading/error states.
- React Query handles request deduping, caching, retries, and inline spinners.

### 🧩 Environment variables
- `VITE_API_BASE_URL` (default `http://localhost:4000/api`) – set this when hosting backend separately.

With both backend and frontend running, you’ll have an end-to-end analytics experience for the Indian General Elections dataset.
