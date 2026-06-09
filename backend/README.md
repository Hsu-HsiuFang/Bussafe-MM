# BusSafe MM — Backend API

Python FastAPI backend connected to Supabase PostgreSQL database.

## Tech Stack

- **FastAPI** — Modern Python web framework
- **Supabase** — PostgreSQL database with REST API
- **bcrypt** — Password hashing (never store plain text!)
- **Pydantic** — Data validation

## Quick Start

```bash
# 1. Create virtual environment
python3 -m venv venv

# 2. Activate virtual environment
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Test database connection
python test_connection.py

# 5. Check tables exist
python check_tables.py

# 6. Run the server
python main.py
```

Server starts at **http://localhost:8000**

Interactive API docs at **http://localhost:8000/docs**

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/auth/signup` | Create account |
| `POST` | `/auth/login` | Login |
| `POST` | `/contacts?user_id=xxx` | Add trusted contact |
| `GET` | `/contacts?user_id=xxx` | Get user's contacts |
| `POST` | `/alerts?user_id=xxx` | Create safety alert |
| `GET` | `/alerts?user_id=xxx` | Get user's alerts |
| `POST` | `/risk-reports?user_id=xxx` | Submit risk report |
| `GET` | `/risk-reports?user_id=xxx` | Get user's risk reports |

## Database Tables

1. **users_profile** — User accounts
2. **trusted_contacts** — Emergency contacts
3. **safety_alerts** — Safety alert events
4. **risk_reports** — Risk reports for routes/locations

## Environment Variables

All secrets are stored in `.env` (never committed to Git).

See `.env.example` for the required variables.

## File Structure

```
backend/
├── main.py              # FastAPI app with all endpoints
├── database.py          # Supabase client connection
├── models.py            # Pydantic data models
├── requirements.txt     # Python dependencies
├── .env                 # Your secrets (gitignored)
├── .env.example         # Template for .env
├── supabase_schema.sql  # Database schema (run in Supabase)
├── test_connection.py   # Test database connection
├── check_tables.py      # Verify all tables exist
└── README.md            # This file