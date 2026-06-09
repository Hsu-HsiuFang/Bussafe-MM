# BusSafe MM — Myanmar Bus Safety Application

A safety application for Myanmar bus passengers. Send safety alerts, save trusted contacts, report bus route risks, and record safety incidents.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + TypeScript + Vite + Tailwind CSS 4 |
| **Backend** | Python FastAPI |
| **Database** | Supabase (PostgreSQL) |
| **Deployment** | Vercel |

## Project Structure

```
bussafe-mm/
├── backend/                    # Python FastAPI Backend
│   ├── main.py                 #   All API endpoints (9 total)
│   ├── database.py             #   Supabase client connection
│   ├── models.py               #   Pydantic data models
│   ├── requirements.txt        #   Python dependencies
│   ├── .env                    #   Environment secrets (gitignored)
│   ├── .env.example            #   Template for .env
│   ├── supabase_schema.sql     #   Database schema + RLS policies
│   ├── test_connection.py      #   Test database connection
│   ├── check_tables.py         #   Verify all tables exist
│   └── README.md               #   Backend documentation
├── frontend/                   # React Frontend
│   ├── src/                    #   Source code
│   ├── public/                 #   Static assets
│   ├── index.html              #   Entry HTML
│   ├── package.json            #   Node.js dependencies
│   └── vite.config.ts          #   Vite configuration
├── vercel.json                 # Vercel deployment config
└── README.md                   # This file
```

## Quick Start

### Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Create virtual environment
python3 -m venv venv

# 3. Activate virtual environment
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Test database connection
python test_connection.py

# 6. Check tables exist
python check_tables.py

# 7. Run the backend server
python main.py
```

Backend runs at **http://localhost:8000**
API docs at **http://localhost:8000/docs**

### Frontend Setup

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev
```

Frontend runs at **http://localhost:5173**

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/auth/signup` | Create account |
| `POST` | `/auth/login` | Login |
| `POST` | `/contacts?user_id=xxx` | Add trusted contact |
| `GET` | `/contacts?user_id=xxx` | Get contacts |
| `POST` | `/alerts?user_id=xxx` | Create safety alert |
| `GET` | `/alerts?user_id=xxx` | Get alerts |
| `POST` | `/risk-reports?user_id=xxx` | Submit risk report |
| `GET` | `/risk-reports?user_id=xxx` | Get risk reports |

## Database Tables

1. **users_profile** — User accounts (id, email, full_name, phone)
2. **trusted_contacts** — Emergency contacts (contact_name, contact_phone, relationship)
3. **safety_alerts** — Safety alerts (route_name, bus_number, alert_type, status)
4. **risk_reports** — Risk reports (route_name, location, risk_type, description)

## Security

- Passwords hashed with **bcrypt** — never stored in plaintext
- All secrets in `.env` files — never committed to Git
- **Row Level Security (RLS)** policies on all tables
- Input validation via Pydantic (backend) and TypeScript (frontend)