"""
BusSafe MM - Check Database Tables
=====================================
Run this script to verify all 4 required tables exist in your Supabase database.
It queries each table and reports whether it exists and how many rows it has.

Usage:
    cd backend
    python check_tables.py
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# All tables that BusSafe MM needs
REQUIRED_TABLES = [
    "users_profile",
    "trusted_contacts",
    "safety_alerts",
    "risk_reports",
]


def check_tables():
    """Check if all required tables exist in the database."""
    
    print("=" * 50)
    print("BusSafe MM - Database Tables Check")
    print("=" * 50)
    
    # Create Supabase client
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_PUBLISHABLE_KEY")
    
    if not supabase_url or not supabase_key:
        print("\n✗ Missing Supabase credentials!")
        print("  → Check your .env file has SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY")
        return False
    
    try:
        from supabase import create_client
        supabase = create_client(supabase_url, supabase_key)
    except Exception as e:
        print(f"\n✗ Failed to connect to Supabase: {e}")
        return False
    
    print(f"\nConnected to: {supabase_url[:30]}...\n")
    
    # Check each table
    all_ok = True
    results = []
    
    for table_name in REQUIRED_TABLES:
        try:
            result = supabase.table(table_name).select("id", count="exact").limit(0).execute()
            row_count = result.count if result.count is not None else len(result.data or [])
            status = "✓ EXISTS"
            results.append((table_name, status, row_count))
        except Exception as e:
            error_msg = str(e)
            if "does not exist" in error_msg.lower() or "relation" in error_msg.lower() or "404" in error_msg:
                status = "✗ MISSING"
                results.append((table_name, status, 0))
                all_ok = False
            else:
                status = f"⚠ ERROR: {error_msg[:50]}"
                results.append((table_name, status, 0))
                all_ok = False
    
    # Print results table
    print(f"{'Table Name':<25} {'Status':<15} {'Rows':<10}")
    print("-" * 50)
    for name, status, rows in results:
        print(f"{name:<25} {status:<15} {rows:<10}")
    
    print("-" * 50)
    
    if all_ok:
        print("\n✓ All 4 tables exist and are accessible!")
        print("  Your database is ready for BusSafe MM.")
    else:
        missing = [name for name, status, _ in results if "MISSING" in status]
        if missing:
            print(f"\n✗ Missing tables: {', '.join(missing)}")
            print("  → Run supabase_schema.sql in your Supabase SQL Editor")
    
    return all_ok


if __name__ == "__main__":
    success = check_tables()
    sys.exit(0 if success else 1)