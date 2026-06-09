"""
BusSafe MM - Database Connection
================================
This file connects to Supabase using the Python client library.
It reads credentials from environment variables (never hardcoded).

Beginner notes:
  - "os.getenv()" reads an environment variable from the system
  - "dotenv" loads variables from a .env file when running locally
  - The Supabase client is the bridge between Python and your database
"""

import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load .env file (only works locally, Vercel uses its own env system)
load_dotenv()

# ============================================
# READ SECRETS FROM ENVIRONMENT VARIABLES
# ============================================

# These come from your .env file (local) or Vercel settings (deployed)
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_PUBLISHABLE_KEY", "")
DATABASE_URL = os.getenv("DATABASE_URL", "")


# ============================================
# CREATE SUPABASE CLIENT
# ============================================

def get_supabase() -> Client:
    """
    Create and return a Supabase client.
    
    This client lets you query your Supabase database tables
    using Python instead of raw SQL.
    
    Returns:
        Client: A connected Supabase client instance
    
    Raises:
        ValueError: If environment variables are missing
    """
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError(
            "Missing Supabase credentials! "
            "Make sure SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY are set in .env"
        )
    return create_client(SUPABASE_URL, SUPABASE_KEY)


# ============================================
# TABLE NAMES (constants to avoid typos)
# ============================================
# Using constants means if you rename a table, you only change it here

TABLE_USERS = "users_profile"
TABLE_CONTACTS = "trusted_contacts"
TABLE_ALERTS = "safety_alerts"
TABLE_RISK_REPORTS = "risk_reports"