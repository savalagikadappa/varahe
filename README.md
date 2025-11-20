# Varahe Election Analytics

Full-stack workspace for exploring Indian General Elections. The backend exposes a PostgreSQL-powered analytics API, while the frontend is a Vite/React dashboard that visualizes turnout, party performance, candidate history, and more.

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
