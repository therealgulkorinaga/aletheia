-- Verification Script for Aletheia Setup
-- Run this in Supabase SQL Editor to check your setup

-- 1. Check if users table exists
SELECT
  'users table exists' as check_name,
  CASE WHEN EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'users'
  ) THEN '✓ PASS' ELSE '✗ FAIL' END as status;

-- 2. Check if auth users exist
SELECT
  'auth users created' as check_name,
  CASE WHEN (SELECT COUNT(*) FROM auth.users) >= 4
  THEN '✓ PASS (' || (SELECT COUNT(*) FROM auth.users) || ' users)'
  ELSE '✗ FAIL (only ' || (SELECT COUNT(*) FROM auth.users) || ' users)' END as status;

-- 3. Check if user profiles are linked
SELECT
  'user profiles linked' as check_name,
  CASE WHEN (SELECT COUNT(*) FROM users) >= 4
  THEN '✓ PASS (' || (SELECT COUNT(*) FROM users) || ' profiles)'
  ELSE '✗ FAIL (only ' || (SELECT COUNT(*) FROM users) || ' profiles)' END as status;

-- 4. List all users with their roles
SELECT
  email,
  name,
  role,
  department,
  CASE
    WHEN id IN (SELECT id FROM auth.users) THEN '✓ linked'
    ELSE '✗ orphaned'
  END as auth_status
FROM users
ORDER BY
  CASE role
    WHEN 'ADMIN' THEN 1
    WHEN 'COMPLIANCE' THEN 2
    WHEN 'APPROVER' THEN 3
    WHEN 'OPERATOR' THEN 4
  END;

-- 5. Check RLS policies
SELECT
  schemaname,
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'users';
