"""
BusSafe MM - Test Database Connection
=======================================
Run this script to verify your Supabase connection is working.
It checks that environment variables are set and the database responds.

Usage:
    cd backend
    python test_connection.py
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

def test_connection():
    """Test the Supabase connection step by step."""
    
    print("=" * 50)
    print("BusSafe MM - Database Connection Test")
    print("=" * 50)
    
    # Step 1: Check environment variables
    print("\n1. Checking environment variables...")
    
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_PUBLISHABLE_KEY")
    database_url = os.getenv("DATABASE_URL")
    
    if supabase_url:
        print(f"   ✓ SUPABASE_URL is set: {supabase_url[:30]}...")
    else:
        print("   ✗ SUPABASE_URL is MISSING!")
        print("   → Add it to your .env file")
        return False
    
    if supabase_key:
        print(f"   ✓ SUPABASE_PUBLISHABLE_KEY is set: {supabase_key[:20]}...")
    else:
        print("   ✗ SUPABASE_PUBLISHABLE_KEY is MISSING!")
        print("   → Add it to your .env file")
        return False
    
    if database_url:
        print(f"   ✓ DATABASE_URL is set: {database_url[:30]}...")
    else:
        print("   ⚠ DATABASE_URL is not set (optional for Supabase client)")
    
    # Step 2: Test Supabase client connection
    print("\n2. Testing Supabase client connection...")
    
    try:
        from supabase import create_client
        supabase = create_client(supabase_url, supabase_key)
        print("   ✓ Supabase client created successfully!")
    except Exception as e:
        print(f"   ✗ Failed to create Supabase client: {e}")
        return False
    
    # Step 3: Try to query a table
    print("\n3. Testing database query...")
    
    try:
        result = supabase.table("users_profile").select("id").limit(1).execute()
        print(f"   ✓ Query executed successfully!")
        print(f"   → Found {len(result.data or [])} user(s) in users_profile table")
    except Exception as e:
        error_msg = str(e)
        if "does not exist" in error_msg.lower() or "relation" in error_msg.lower():
            print(f"   ⚠ Table 'users_profile' does not exist yet")
            print(f"   → Run supabase_schema.sql in your Supabase SQL Editor first!")
        else:
            print(f"   ✗ Query failed: {e}")
            return False
    
    print("\n" + "=" * 50)
    print("✓ Connection test PASSED! Your setup is working.")
    print("=" * 50)
    return True


if __name__ == "__main__":
    success = test_connection()
    sys.exit(0 if success else 1)