-- ============================================
-- BusSafe MM - Supabase Database Schema
-- ============================================
-- HOW TO USE:
--   1. Go to https://supabase.com/dashboard
--   2. Select your project
--   3. Click "SQL Editor" in the left sidebar
--   4. Click "New Query"
--   5. Paste this entire file and click "Run"
-- ============================================

-- ============================================
-- TABLE 1: users_profile
-- Stores registered user accounts
-- ============================================

CREATE TABLE IF NOT EXISTS users_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- TABLE 2: trusted_contacts
-- Stores emergency contacts for each user
-- ============================================

CREATE TABLE IF NOT EXISTS trusted_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  relationship TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- TABLE 3: safety_alerts
-- Stores safety alerts sent by users
-- ============================================

CREATE TABLE IF NOT EXISTS safety_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  route_name TEXT NOT NULL,
  bus_number TEXT,
  current_location TEXT,
  alert_type TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'sent',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- TABLE 4: risk_reports
-- Stores risk reports submitted by users
-- ============================================

CREATE TABLE IF NOT EXISTS risk_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  route_name TEXT NOT NULL,
  location TEXT NOT NULL,
  risk_type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- INDEXES (speed up common queries)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_contacts_user ON trusted_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user ON safety_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_route ON safety_alerts(route_name);
CREATE INDEX IF NOT EXISTS idx_risk_user ON risk_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_risk_route ON risk_reports(route_name);
CREATE INDEX IF NOT EXISTS idx_users_email ON users_profile(email);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- RLS ensures users can only see/modify their own data.
-- Since we use the service role key from the backend,
-- RLS is bypassed for API calls. But it's good practice
-- to have these policies for direct client access.

-- Enable RLS on all tables
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE trusted_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_reports ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON users_profile FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users_profile FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Users can view their own contacts
CREATE POLICY "Users can view own contacts"
  ON trusted_contacts FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can add contacts for themselves
CREATE POLICY "Users can add own contacts"
  ON trusted_contacts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own contacts
CREATE POLICY "Users can delete own contacts"
  ON trusted_contacts FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Users can view their own alerts
CREATE POLICY "Users can view own alerts"
  ON safety_alerts FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can create alerts for themselves
CREATE POLICY "Users can create own alerts"
  ON safety_alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view their own risk reports
CREATE POLICY "Users can view own risk reports"
  ON risk_reports FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can create risk reports for themselves
CREATE POLICY "Users can create own risk reports"
  ON risk_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);