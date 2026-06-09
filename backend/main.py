"""
BusSafe MM - Main API Server
==============================
This is the heart of the backend. It defines all API endpoints that the
frontend calls to save and retrieve data.

Beginner notes:
  - FastAPI automatically creates interactive docs at /docs
  - Each function below handles one API endpoint
  - "@app.get()" = read data, "@app.post()" = create data
  - The "response_model" tells FastAPI what shape the response should be
"""

import os
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import bcrypt
from dotenv import load_dotenv
from mangum import Mangum

from database import get_supabase, TABLE_USERS, TABLE_CONTACTS, TABLE_ALERTS, TABLE_RISK_REPORTS
from models import (
    SignupRequest, LoginRequest, AuthResponse, UserResponse,
    ContactCreateRequest, ContactResponse, ContactsListResponse,
    AlertCreateRequest, AlertResponse, AlertsListResponse,
    RiskReportCreateRequest, RiskReportResponse, RiskReportsListResponse,
    ApiResponse,
)

# Load environment variables from .env file
load_dotenv()

# ============================================
# CREATE THE FASTAPI APP
# ============================================

app = FastAPI(
    title="BusSafe MM API",
    description="Backend API for BusSafe MM — Myanmar Bus Safety Application",
    version="1.0.0",
)

# ============================================
# CORS MIDDLEWARE (allows frontend to call this API)
# ============================================
# CORS = Cross-Origin Resource Sharing
# Without this, the browser blocks requests from a different URL

# Get allowed frontend URLs from environment
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",        # Vite dev server
        "http://localhost:3000",        # Alternative local port
        FRONTEND_URL,                   # Deployed frontend URL
        "*",                            # Allow all for development (restrict in production)
    ],
    allow_credentials=True,
    allow_methods=["*"],                # Allow GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],                # Allow all headers
)

# ============================================
# PASSWORD HASHING SETUP
# ============================================
# bcrypt is a secure hashing algorithm — passwords are never stored as plain text
#
# Beginner notes:
#   - We use the bcrypt library directly (not passlib) for compatibility
#   - bcrypt.hashpw() creates a salted hash of the password
#   - bcrypt.checkpw() verifies a password against a stored hash
#   - The 72-byte limit is handled by bcrypt 5.x automatically via
#     pre-hashing with SHA-256 when needed, so normal passwords always work


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt.
    Returns the hash as a UTF-8 string suitable for storing in the database.
    """
    # bcrypt 5.x handles passwords of any length safely
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain-text password against a stored bcrypt hash.
    Returns True if the password matches, False otherwise.
    """
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8"),
    )


# ============================================
# ENDPOINT 1: HEALTH CHECK
# ============================================

@app.get("/health", tags=["System"])
def health_check():
    """
    GET /health
    Check if the API server is running.
    
    Returns a simple JSON message confirming the server is alive.
    Use this to verify deployment worked correctly.
    """
    return {
        "status": "healthy",
        "service": "BusSafe MM API",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat(),
    }


# ============================================
# ENDPOINT 2: SIGNUP (Create Account)
# ============================================

@app.post("/auth/signup", response_model=AuthResponse, tags=["Authentication"])
def signup(request: SignupRequest):
    """
    POST /auth/signup
    Create a new user account.
    
    Request body:
    {
        "email": "user@example.com",
        "full_name": "Aung Aung",
        "phone": "09123456789",
        "password": "securepass123"
    }
    
    Steps:
    1. Check if email is already registered
    2. Hash the password (never store plain text!)
    3. Save user to Supabase database
    4. Return user data (without password)
    """
    try:
        supabase = get_supabase()

        # Step 1: Check if email already exists
        existing = supabase.table(TABLE_USERS).select("id").eq("email", request.email).execute()
        if existing.data and len(existing.data) > 0:
            return AuthResponse(
                success=False,
                message="An account with this email already exists."
            )

        # Step 2: Hash the password using bcrypt
        hashed_password = hash_password(request.password)

        # Step 3: Insert new user into database
        result = supabase.table(TABLE_USERS).insert({
            "email": request.email.strip().lower(),
            "full_name": request.full_name.strip(),
            "phone": request.phone.strip(),
            "password_hash": hashed_password,
        }).execute()

        # Step 4: Return success with user data (no password!)
        if result.data and len(result.data) > 0:
            user = result.data[0]
            return AuthResponse(
                success=True,
                message="Account created successfully!",
                user=UserResponse(
                    id=str(user["id"]),
                    email=user["email"],
                    full_name=user["full_name"],
                    phone=user["phone"],
                    created_at=str(user.get("created_at", "")),
                ),
            )

        return AuthResponse(success=False, message="Failed to create account.")

    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        error_msg = str(e)
        if "duplicate key" in error_msg.lower():
            return AuthResponse(success=False, message="Email already registered.")
        raise HTTPException(status_code=500, detail=f"Signup failed: {error_msg}")


# ============================================
# ENDPOINT 3: LOGIN
# ============================================

@app.post("/auth/login", response_model=AuthResponse, tags=["Authentication"])
def login(request: LoginRequest):
    """
    POST /auth/login
    Authenticate a user with email and password.
    
    Request body:
    {
        "email": "user@example.com",
        "password": "securepass123"
    }
    
    Steps:
    1. Find user by email
    2. Verify password against stored hash
    3. Return user data on success
    """
    try:
        supabase = get_supabase()

        # Step 1: Look up user by email
        result = supabase.table(TABLE_USERS).select("*").eq("email", request.email).execute()
        if not result.data or len(result.data) == 0:
            return AuthResponse(success=False, message="No account found with this email.")

        user = result.data[0]

        # Step 2: Verify password against stored hash
        if not verify_password(request.password, user["password_hash"]):
            return AuthResponse(success=False, message="Incorrect password.")

        # Step 3: Login successful!
        return AuthResponse(
            success=True,
            message="Login successful!",
            user=UserResponse(
                id=str(user["id"]),
                email=user["email"],
                full_name=user["full_name"],
                phone=user["phone"],
                created_at=str(user.get("created_at", "")),
            ),
        )

    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")


# ============================================
# ENDPOINT 4: ADD TRUSTED CONTACT
# ============================================

@app.post("/contacts", response_model=ApiResponse, tags=["Trusted Contacts"])
def add_contact(request: ContactCreateRequest, user_id: str):
    """
    POST /contacts?user_id=xxx
    Add a new trusted contact for a user.
    
    Query parameter:
    - user_id: The ID of the user adding the contact
    
    Request body:
    {
        "contact_name": "Ma Mya",
        "contact_phone": "09987654321",
        "relationship": "Mother"
    }
    """
    try:
        supabase = get_supabase()

        result = supabase.table(TABLE_CONTACTS).insert({
            "user_id": user_id,
            "contact_name": request.contact_name.strip(),
            "contact_phone": request.contact_phone.strip(),
            "relationship": request.relationship.strip(),
        }).execute()

        if result.data and len(result.data) > 0:
            return ApiResponse(success=True, message=f"{request.contact_name} added to trusted contacts!")

        return ApiResponse(success=False, message="Failed to add contact.")

    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add contact: {str(e)}")


# ============================================
# ENDPOINT 5: GET TRUSTED CONTACTS
# ============================================

@app.get("/contacts", response_model=ContactsListResponse, tags=["Trusted Contacts"])
def get_contacts(user_id: str):
    """
    GET /contacts?user_id=xxx
    Retrieve all trusted contacts for a specific user.
    
    Query parameter:
    - user_id: The ID of the user whose contacts to fetch
    
    Returns a list of contacts sorted by creation date.
    """
    try:
        supabase = get_supabase()

        result = (
            supabase.table(TABLE_CONTACTS)
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=False)
            .execute()
        )

        contacts = [
            ContactResponse(
                id=str(c["id"]),
                user_id=str(c["user_id"]),
                contact_name=c["contact_name"],
                contact_phone=c["contact_phone"],
                relationship=c.get("relationship", ""),
                created_at=str(c.get("created_at", "")),
            )
            for c in (result.data or [])
        ]

        return ContactsListResponse(success=True, contacts=contacts)

    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch contacts: {str(e)}")


# ============================================
# ENDPOINT 6: CREATE SAFETY ALERT
# ============================================

@app.post("/alerts", response_model=AlertsListResponse, tags=["Safety Alerts"])
def create_alert(request: AlertCreateRequest, user_id: str):
    """
    POST /alerts?user_id=xxx
    Create a new safety alert.
    
    Query parameter:
    - user_id: The ID of the user sending the alert
    
    Request body:
    {
        "route_name": "Yangon-Mandalay Express",
        "bus_number": "YGN-1234",
        "current_location": "Near Pyin Oo Lwin junction",
        "alert_type": "emergency",
        "message": "Feeling unsafe on this bus"
    }
    """
    try:
        supabase = get_supabase()

        # Insert the alert
        result = supabase.table(TABLE_ALERTS).insert({
            "user_id": user_id,
            "route_name": request.route_name.strip(),
            "bus_number": request.bus_number.strip() if request.bus_number else None,
            "current_location": request.current_location.strip() if request.current_location else None,
            "alert_type": request.alert_type.strip(),
            "message": request.message.strip() if request.message else None,
            "status": "sent",
        }).execute()

        if result.data and len(result.data) > 0:
            # Return all alerts for this user (including the new one)
            all_alerts = (
                supabase.table(TABLE_ALERTS)
                .select("*")
                .eq("user_id", user_id)
                .order("created_at", desc=True)
                .execute()
            )
            alerts = [
                AlertResponse(
                    id=str(a["id"]),
                    user_id=str(a["user_id"]),
                    route_name=a["route_name"],
                    bus_number=a.get("bus_number"),
                    current_location=a.get("current_location"),
                    alert_type=a["alert_type"],
                    message=a.get("message"),
                    status=a.get("status", "sent"),
                    created_at=str(a.get("created_at", "")),
                )
                for a in (all_alerts.data or [])
            ]
            return AlertsListResponse(success=True, alerts=alerts)

        return AlertsListResponse(success=False, alerts=[])

    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create alert: {str(e)}")


# ============================================
# ENDPOINT 7: GET SAFETY ALERTS
# ============================================

@app.get("/alerts", response_model=AlertsListResponse, tags=["Safety Alerts"])
def get_alerts(user_id: str):
    """
    GET /alerts?user_id=xxx
    Retrieve all safety alerts for a specific user.
    
    Query parameter:
    - user_id: The ID of the user whose alerts to fetch
    
    Returns alerts sorted by most recent first.
    """
    try:
        supabase = get_supabase()

        result = (
            supabase.table(TABLE_ALERTS)
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )

        alerts = [
            AlertResponse(
                id=str(a["id"]),
                user_id=str(a["user_id"]),
                route_name=a["route_name"],
                bus_number=a.get("bus_number"),
                current_location=a.get("current_location"),
                alert_type=a["alert_type"],
                message=a.get("message"),
                status=a.get("status", "sent"),
                created_at=str(a.get("created_at", "")),
            )
            for a in (result.data or [])
        ]

        return AlertsListResponse(success=True, alerts=alerts)

    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch alerts: {str(e)}")


# ============================================
# ENDPOINT 8: CREATE RISK REPORT
# ============================================

@app.post("/risk-reports", response_model=ApiResponse, tags=["Risk Reports"])
def create_risk_report(request: RiskReportCreateRequest, user_id: str):
    """
    POST /risk-reports?user_id=xxx
    Submit a risk report for a bus route or location.
    
    Query parameter:
    - user_id: The ID of the user submitting the report
    
    Request body:
    {
        "route_name": "Yangon Circular",
        "location": "Hledan junction bus stop",
        "risk_type": "theft",
        "description": "Pickpockets active during evening rush hour"
    }
    """
    try:
        supabase = get_supabase()

        result = supabase.table(TABLE_RISK_REPORTS).insert({
            "user_id": user_id,
            "route_name": request.route_name.strip(),
            "location": request.location.strip(),
            "risk_type": request.risk_type.strip(),
            "description": request.description.strip() if request.description else None,
        }).execute()

        if result.data and len(result.data) > 0:
            return ApiResponse(success=True, message="Risk report submitted. Thank you for helping keep others safe!")

        return ApiResponse(success=False, message="Failed to submit risk report.")

    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to submit report: {str(e)}")


# ============================================
# ENDPOINT 9: GET RISK REPORTS
# ============================================

@app.get("/risk-reports", response_model=RiskReportsListResponse, tags=["Risk Reports"])
def get_risk_reports(user_id: str):
    """
    GET /risk-reports?user_id=xxx
    Retrieve all risk reports submitted by a specific user.
    
    Query parameter:
    - user_id: The ID of the user whose reports to fetch
    
    Returns reports sorted by most recent first.
    """
    try:
        supabase = get_supabase()

        result = (
            supabase.table(TABLE_RISK_REPORTS)
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )

        reports = [
            RiskReportResponse(
                id=str(r["id"]),
                user_id=str(r["user_id"]),
                route_name=r["route_name"],
                location=r["location"],
                risk_type=r["risk_type"],
                description=r.get("description"),
                created_at=str(r.get("created_at", "")),
            )
            for r in (result.data or [])
        ]

        return RiskReportsListResponse(success=True, reports=reports)

    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch reports: {str(e)}")


# ============================================
# VERCEL SERVERLESS HANDLER
# ============================================
# Mangum wraps FastAPI so it can run on Vercel's serverless platform

handler = Mangum(app)


# ============================================
# LOCAL DEVELOPMENT: Run with uvicorn
# ============================================
# This block only runs when you execute "python main.py" directly
# It starts the server at http://localhost:8000

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)