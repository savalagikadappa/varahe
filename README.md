# 🗳️ Varahe - Indian Election Data Visualization Dashboard

A full-stack analytics platform for exploring Indian General Elections (1991–2019) using interactive visualizations, advanced filtering, and a PostgreSQL-backed API.

***

### Table of Contents
- Features
- Architecture & Tech Stack
- Data & Preprocessing
- Local Setup (Backend, Frontend, DB)
- API Reference
- Dashboard Modules
- Project Structure
- Troubleshooting
- Production Deployment
- License & Acknowledgments

***

## Features

### Core Analytics

- **6 interactive visualizations**: party seat share, turnout map, gender representation, vote share, victory margins, and constituency-level table.[3][1]
- **End-to-end drilldowns** from national trends → state → constituency → candidate history using shared filters and search.[4][1]
- **Temporal analysis** over 8 Lok Sabha elections (1991–2019), enabling longitudinal comparisons of parties, turnout, and representation.[1][3]

### Filtering & UX

- **Global filter panel**: year range, state multi-select, party multi-select, gender chips, winners-only toggle, constituency search.[2][4]
- **Fast UX**: React Query caching, debounced text inputs, pagination for large result sets, and responsive layout for mobile/desktop.[5][6]
- **Accessible UI**: keyboard-focusable controls, semantic loading and error states, and clear empty-state messaging for charts and tables.[7][5]

***

## Architecture & Tech Stack

### High-Level Architecture

- **Data layer**: Lok Dhaba candidate-level election data loaded into PostgreSQL (`election_data` table).[3][1]
- **Backend API**: Node.js + Express, parameterized SQL with `pg`, validation via Joi, exposed as `/api/*` endpoints.[8][9]
- **Frontend**: React 18 + Vite dashboard consuming the backend via a configurable `VITE_API_BASE_URL`.[6][5]

### Tech Stack Details

| Layer      | Technologies                                                                                |
|-----------|---------------------------------------------------------------------------------------------|
| Frontend  | React 18, Vite, TailwindCSS, Recharts, React Query, React Simple Maps, React Select        |
| Backend   | Node.js 18+, Express 5, PostgreSQL 14+, `pg`, Joi, CORS                                     |
| Data      | Python 3.10+, Pandas, SQLAlchemy, psycopg2                                                  |
| Tooling   | ESLint, nodemon, Git, npm                                                                   |  

[5][6]

***

## Data & Preprocessing

### Dataset

- **Source**: Lok Dhaba (TCPD, Ashoka University), candidate-level Lok Sabha data.[4][1]
- **Temporal coverage**: General Elections 1991–2019, filtered from the full Lok Dhaba dataset.[10][3]
- **Granularity**: One row per candidate–constituency–year with votes, electors, turnout, party, gender, margins, and TCPD party metadata.[3][4]

### Preprocessing Pipeline (`data_preprocessing/preprocessing.py`)

The script performs the following operations before loading into PostgreSQL:[10][3]

1. **Year filter**: keep elections with `Year ∈ [1991, 2019]`.[10][3]
2. **Gender cleanup**: normalize to `MALE`, `FEMALE`, `O`, `UNKNOWN` and fill missing as `UNKNOWN`.[11][3]
3. **Party normalization**: fill missing parties as `INDEPENDENT` and uppercase all party labels.[4][3]
4. **Numeric coercion**: convert votes, electors, margins to integers; blanks become `0`.[3][10]
5. **Turnout recomputation**: `Turnout_Percentage = (Valid_Votes / Electors) × 100` with capping at 100.[10][3]
6. **Text standardization**: uppercase state/constituency/candidate names, strip whitespace, normalize legacy state names.[4][3]
7. **Vote share**: compute `Vote_Share_Percentage` per candidate in each constituency.[3][10]
8. **Winner flag**: set `Is_Winner = true` where `Position = 1`, else `false`.[4][3]
9. **Export & load**: write `cleaned_election_data.csv` and bulk-load into PostgreSQL table `election_data`.[10][3]

### Database Schema (`election_data`)

Typical columns (aligned with the Lok Dhaba codebook):[3][4]

| Column                 | Type      | Description                                   |
|------------------------|-----------|-----------------------------------------------|
| Year                   | INTEGER   | Election year (1991–2019)                    |
| State_Name             | VARCHAR   | Normalized state name                        |
| Constituency_Name      | VARCHAR   | Constituency name                            |
| Constituency_No        | INTEGER   | Constituency number                          |
| Party                  | VARCHAR   | Candidate party abbreviation                 |
| Candidate              | VARCHAR   | Candidate name                               |
| Sex                    | VARCHAR   | `MALE`, `FEMALE`, `O`, `UNKNOWN`             |
| Votes                  | INTEGER   | Candidate votes                              |
| Valid_Votes            | INTEGER   | Valid votes in constituency                  |
| Electors               | INTEGER   | Registered voters                            |
| Turnout_Percentage     | NUMERIC   | Turnout in percent                           |
| Vote_Share_Percentage  | NUMERIC   | Candidate’s vote share (%)                   |
| Margin                 | INTEGER   | Victory margin for winners                   |
| Position               | INTEGER   | Rank (1 = winner)                            |
| Is_Winner              | BOOLEAN   | True if rank = 1                             |
| Party_Type_TCPD        | VARCHAR   | Party classification by TCPD                 |
| MyNeta_education       | VARCHAR   | Education level (if available)               |  

[4][3]

***

## Local Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/varahe.git
cd varahe
```


### 2. Prepare PostgreSQL

1. Start PostgreSQL using your OS-specific method.[12][9]
2. Create database and user (choose your own secure credentials):[8][9]

```sql
CREATE DATABASE varahe;
CREATE USER varahe_user WITH PASSWORD 'your_strong_password';
GRANT ALL PRIVILEGES ON DATABASE varahe TO varahe_user;
```

3. Optionally verify: `psql -l | grep varahe`. [9][12]  

### 3. Prepare Dataset

1. Download the Lok Sabha CSV from Lok Dhaba and save as `data_preprocessing/All_States_GE.csv`.[1][4]
2. (Recommended) create virtual environment and install dependencies:[10][3]

```bash
cd data_preprocessing
python3 -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install pandas sqlalchemy psycopg2-binary
```

3. Configure DB credentials in `preprocessing.py` (host, port, db name, user, password) but never commit real secrets.[12][9]
4. Run preprocessing and import:[3][10]

```bash
python3 preprocessing.py
```

5. Alternative manual import (after generating `cleaned_election_data.csv`):[4][3]

```sql
\copy election_data FROM 'cleaned_election_data.csv' CSV HEADER;
```

### 4. Backend API

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```


**.env (example – customize locally, never commit real passwords):**[12][9]

```env
NODE_ENV=development
PORT=4000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=varahe
DB_USER=varahe_user
DB_PASSWORD=your_strong_password
DB_SSL=false
```

**Health check:**  

```bash
curl "http://localhost:4000/api/elections?limit=1"
```


### 5. Frontend Dashboard

```bash
cd ../frontend
npm install
echo "VITE_API_BASE_URL=http://localhost:4000/api" > .env.local
npm run dev
```


Open: `http://localhost:5173` in a browser.[5][6]

***

## API Reference

Base URL (local):  

```text
http://localhost:4000/api
```


### 1. `GET /elections` – Paginated Election Records

- **Description**: Candidate-level records with filters and pagination.[3][4]
- **Query params**:[4][3]
  - `year`: `"2019"` or `"2014-2019"`  
  - `state_name`: e.g. `"Karnataka"`  
  - `party`: e.g. `"BJP"`, `"INC"`  
  - `sex`: `MALE`, `FEMALE`, `O`, `UNKNOWN`  
  - `constituency_name`: string match  
  - `page`: page number (default `1`)  
  - `limit`: page size (default `100`)  

**Example:**  

```bash
curl "http://localhost:4000/api/elections?year=2019&state_name=Karnataka&limit=20"
```


### 2. `GET /turnout/by-state` – State-wise Turnout

- **Description**: Average turnout percentage per state for a given year or year range.[3][4]
- **Params**: `year=2019` or `year=2004-2019`.[11][4]

**Example:**

```bash
curl "http://localhost:4000/api/turnout/by-state?year=2019"
```


### 3. `GET /party/seat-share` – Party Performance

- **Description**: Seats won per party per year (winners only).[4][3]
- **Params**: optional `year` range like `2009-2019`.[4][11]

**Example:**

```bash
curl "http://localhost:4000/api/party/seat-share?year=2014-2019"
```


### 4. `GET /gender/representation` – Gender Statistics

- **Description**: Candidate counts and percentages by gender across years.[3][4]
- **Params**: optional `year` range, default is full 1991–2019 range.[4][3]

**Example:**

```bash
curl "http://localhost:4000/api/gender/representation"
```


### 5. `GET /margin-distribution` – Victory Margin Histogram

- **Description**: Bucketed distribution of victory margins for winners.[4][3]
- **Params**: optional `year` or `year` range.[4][4]

**Example:**

```bash
curl "http://localhost:4000/api/margin-distribution?year=2019"
```


### 6. `GET /search/candidates` – Candidate Search

- **Description**: Text search over candidate names with aggregated career stats and per-election history.[11][3]
- **Params**:[11][3]
  - `q`: query string (min 2 characters)  
  - `limit`: max result count (default `25`)  

**Example:**

```bash
curl "http://localhost:4000/api/search/candidates?q=Gandhi&limit=5"
```


***

## Dashboard Modules

### Chart & UI Components

| Component                      | Type           | Backing Endpoint          | Purpose                                          |
|-------------------------------|----------------|---------------------------|--------------------------------------------------|
| `PartySeatShareChart`         | Stacked Bar    | `/party/seat-share`      | Seats by party and year                         |
| `IndiaMap`                    | Choropleth Map | `/turnout/by-state`      | State-level turnout on a map                    |
| `TurnoutChart`                | Horizontal Bar | `/turnout/by-state`      | Turnout comparison across states                |
| `GenderRepresentationChart`   | Line Chart     | `/gender/representation` | Gender diversity over time                      |
| `VoteShareChart`              | Donut          | `/elections` (aggregated)| Top parties by vote share in current filters    |
| `MarginDistributionChart`     | Histogram      | `/margin-distribution`   | Close races vs landslides                       |
| `ConstituencyResultsTable`    | Table          | `/elections`             | Detailed candidate-level results                 |
| `CandidateSearch`             | Cards          | `/search/candidates`     | Candidate lookup with history                   |  

[13][5]

### Filter Panel

- **Year range slider** for 1991–2019.[3][4]
- **State & party multi-select** based on distinct values from the dataset.[1][4]
- **Gender chips** (`MALE`, `FEMALE`, `O`, `UNKNOWN`) plus winners-only toggle.[11][3]
- **Constituency search** with debounced input to avoid over-fetching.[14][5]

***

## Project Structure

```text
varahe/
├── backend/
│   ├── src/
│   │   ├── app.js               # Express app wiring
│   │   ├── server.js            # Server bootstrap + DB readiness
│   │   ├── config/              # Env and DB config
│   │   ├── controllers/         # Business logic + SQL
│   │   ├── routes/              # API route modules
│   │   ├── middleware/          # Validation + error handling
│   │   ├── utils/               # Filters, pagination helpers
│   │   └── validation/          # Joi schemas
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── charts/          # All Recharts components
│   │   │   ├── table/           # Results table
│   │   │   ├── search/          # Candidate search UI
│   │   │   └── common/          # Shared UI (layout, inputs)
│   │   ├── context/             # Global filter context
│   │   ├── hooks/               # React Query hooks
│   │   ├── services/            # API client wrappers
│   │   └── utils/               # Formatting helpers
│   └── package.json
│
├── data_preprocessing/
│   ├── preprocessing.py         # Primary ETL script
│   ├── analyze.py               # Optional ad-hoc analysis
│   ├── All_States_GE.csv        # Raw dataset (not versioned here)
│   ├── cleaned_election_data.csv# Derived output (local)
│   └── venv/                    # Local virtual env (gitignored)
│
└── README.md
```


***

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running and reachable on `DB_HOST:DB_PORT`.[16][19]
- Confirm `DB_NAME`, `DB_USER`, `DB_PASSWORD` in `.env` match your local DB setup.[8][9]
- Check privileges: `GRANT ALL PRIVILEGES ON DATABASE varahe TO your_user;`.[16][19]

### Python / ETL Errors

- `ModuleNotFoundError`: confirm venv is activated and dependencies installed.[10][3]
- `FileNotFoundError: All_States_GE.csv`: ensure the CSV path and file name are correct.[1][4]

### Port Already in Use

- Find and kill process: `lsof -ti:4000 | xargs kill -9` (Linux/macOS). [12][9]  
- Or change `PORT` in backend `.env` and update frontend `VITE_API_BASE_URL`.[19][16]

### Blank Charts or Errors in UI

- Open browser dev tools and inspect failing API calls.[13][5]
- Hit `http://localhost:4000/api/elections?limit=1` directly to confirm backend health.[8][9]
- Check year and filter selections are not excluding all data.[4][3]

***

## Production Deployment

### Backend

- Build and run in production mode:[12][9]

```bash
cd backend
npm install
npm start
```

- Example production `.env` (use real secrets in your hosting platform, not in git):[9][12]

```env
NODE_ENV=production
PORT=4000
DB_HOST=your-prod-host
DB_PORT=5432
DB_NAME=varahe
DB_USER=prod_user
DB_PASSWORD=prod_password
DB_SSL=true
```

### Frontend

```bash
cd frontend
npm install
npm run build
npm run preview   # sanity check
```


- Configure:  

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### Hosting Options

- **Backend**: Render, Railway, Fly.io, AWS EC2, or any Node-friendly PaaS.[12][9]
- **Database**: Managed Postgres (Supabase, RDS, Render/Neon, etc.).[9][4]
- **Frontend**: Vercel, Netlify, or static hosting behind a CDN.[13][5]

***

## License & Acknowledgments

- Built for educational purposes as part of an engineering talent program assignment.[15][10]
- Dataset: Lok Dhaba / TCPD Indian Elections Dataset, Ashoka University.[1][4]
- India map topology: React Simple Maps compatible India TopoJSON.[5][13]
- Charts: Recharts-based visualizations customized for this dataset.[14][5]

**Happy analyzing!** 📊🗳️[2][1]

