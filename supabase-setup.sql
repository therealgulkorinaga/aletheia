-- Aletheia Database Setup
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('OPERATOR', 'APPROVER', 'COMPLIANCE', 'ADMIN')),
  department TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- Seed demo users
-- Note: You'll need to create these users in Supabase Auth first, then insert their records here
-- For demo purposes, after creating auth users, insert with their actual UUIDs:

-- INSERT INTO users (id, email, name, role, department)
-- VALUES
--   ('UUID-FROM-AUTH-USER-1', 'operator@demo.com', 'Sarah Chen', 'OPERATOR', 'Operations'),
--   ('UUID-FROM-AUTH-USER-2', 'approver@demo.com', 'Michael Roberts', 'APPROVER', 'Legal'),
--   ('UUID-FROM-AUTH-USER-3', 'compliance@demo.com', 'Emily Watson', 'COMPLIANCE', 'Compliance'),
--   ('UUID-FROM-AUTH-USER-4', 'admin@demo.com', 'James Anderson', 'ADMIN', 'Administration');

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, department)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'OPERATOR'),
    NEW.raw_user_meta_data->>'department'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
