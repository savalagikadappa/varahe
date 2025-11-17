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
cp .env.example .env
npm install
npm run dev
```

The API listens on `http://localhost:4000` by default. Adjust `.env` for database credentials (defaults match the provided `varahe` database).

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
