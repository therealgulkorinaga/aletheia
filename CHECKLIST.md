# Aletheia Setup Checklist

Complete this checklist before testing Phase 1.

## Prerequisites

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm or yarn installed
- [ ] Git installed (optional, for version control)
- [ ] Web browser (Chrome, Firefox, Safari, Edge)
- [ ] Supabase account (free tier is fine)

---

## Database Setup

### 1. Create Supabase Project

- [ ] Go to [supabase.com](https://supabase.com)
- [ ] Click "New project"
- [ ] Enter project details:
  - [ ] Name: `aletheia-demo` (or your choice)
  - [ ] Database Password: (save this, you'll need it)
  - [ ] Region: (choose closest to you)
- [ ] Click "Create new project"
- [ ] Wait ~2 minutes for database provisioning

### 2. Run Database Migration

- [ ] In Supabase dashboard, go to **SQL Editor** (left sidebar)
- [ ] Click **New query**
- [ ] Open `supabase-setup.sql` in your code editor
- [ ] Copy the entire contents
- [ ] Paste into Supabase SQL Editor
- [ ] Click **Run** (or press Cmd/Ctrl + Enter)
- [ ] Verify: Should see "Success. No rows returned"

### 3. Create Demo Users

Go to **Authentication** → **Users** in Supabase:

- [ ] Click **Add user** → **Create new user**
- [ ] User 1:
  - Email: `operator@demo.com`
  - Password: `password123`
  - ✓ Auto Confirm User
  - Click **Create user**
- [ ] User 2:
  - Email: `approver@demo.com`
  - Password: `password123`
  - ✓ Auto Confirm User
- [ ] User 3:
  - Email: `compliance@demo.com`
  - Password: `password123`
  - ✓ Auto Confirm User
- [ ] User 4:
  - Email: `admin@demo.com`
  - Password: `password123`
  - ✓ Auto Confirm User

### 4. Link User Profiles

- [ ] Go back to **SQL Editor**
- [ ] Run this query to get UUIDs:
  ```sql
  SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 4;
  ```
- [ ] Copy the 4 UUIDs
- [ ] Run this insert (replace UUIDs with actual values):
  ```sql
  INSERT INTO users (id, email, name, role, department)
  VALUES
    ('uuid-1', 'operator@demo.com', 'Sarah Chen', 'OPERATOR', 'Operations'),
    ('uuid-2', 'approver@demo.com', 'Michael Roberts', 'APPROVER', 'Legal'),
    ('uuid-3', 'compliance@demo.com', 'Emily Watson', 'COMPLIANCE', 'Compliance'),
    ('uuid-4', 'admin@demo.com', 'James Anderson', 'ADMIN', 'Administration');
  ```
- [ ] Verify: Should see "Success. 4 rows affected"

### 5. Get API Credentials

- [ ] Go to **Settings** → **API** in Supabase
- [ ] Copy **Project URL** (e.g., `https://abcd1234.supabase.co`)
- [ ] Copy **anon public** key (long string starting with `eyJ...`)

---

## Local Setup

### 6. Configure Environment

- [ ] Open the `aletheia` project folder in your code editor
- [ ] Copy `.env.example` to `.env.local`:
  ```bash
  cp .env.example .env.local
  ```
- [ ] Edit `.env.local` and replace:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL` with your Project URL
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` with your anon key
- [ ] Save the file

### 7. Install Dependencies

- [ ] Open terminal in project folder
- [ ] Run:
  ```bash
  npm install
  ```
- [ ] Wait for installation to complete (~1-2 minutes)
- [ ] Verify: Should see no errors

### 8. Verify Setup

Optional but recommended:

- [ ] In Supabase SQL Editor, run `scripts/verify-setup.sql`
- [ ] Check that all lines show `✓ PASS`
- [ ] If any show `✗ FAIL`, review the corresponding step above

---

## First Run

### 9. Start Development Server

- [ ] In terminal, run:
  ```bash
  npm run dev
  ```
- [ ] Wait for "Ready" message
- [ ] Should see: `Local: http://localhost:3000`

### 10. Test Landing Page

- [ ] Open browser to `http://localhost:3000`
- [ ] Verify:
  - [ ] "Aletheia" logo appears
  - [ ] Hero text: "Turn board authority into executable AI governance"
  - [ ] Three pillar cards visible
  - [ ] "Sign In" button works

### 11. Test Login

- [ ] Click **Sign In**
- [ ] Should redirect to `/auth/login`
- [ ] Verify:
  - [ ] Login form appears
  - [ ] 4 demo credential buttons visible
  - [ ] Click **OPERATOR** button
  - [ ] Email/password auto-fill
  - [ ] Click **Sign In**
  - [ ] Should redirect to `/dashboard`

### 12. Test Dashboard

- [ ] Should see:
  - [ ] Dark sidebar on left with "Aletheia" logo
  - [ ] Top bar with "Sarah Chen [OPERATOR]" and dropdown
  - [ ] 4 metric cards (12, 3, 2, 4.2h)
  - [ ] Sidebar shows: Dashboard, Workflows, New Workflow
- [ ] Click user dropdown (top right)
- [ ] Verify: Shows name, email, "Log out" option
- [ ] **Don't log out yet**

### 13. Test Navigation

- [ ] Click **Workflows** in sidebar
- [ ] Should see: Placeholder page "Phase 2: Workflow list will appear here"
- [ ] Click **New Workflow** in sidebar
- [ ] Should see: Similar placeholder
- [ ] Click **Dashboard** to return

### 14. Test Role-Based Access

Log out and test each user:

- [ ] **Operator** (`operator@demo.com`):
  - Sees: Dashboard, Workflows, New Workflow
  
- [ ] **Approver** (`approver@demo.com`):
  - Sees: Dashboard, Approval Inbox
  
- [ ] **Compliance** (`compliance@demo.com`):
  - Sees: Dashboard, Workflows, Ledger, Reports
  
- [ ] **Admin** (`admin@demo.com`):
  - Sees: Dashboard, Policies, Users, Authorities

---

## Troubleshooting

### Can't login / "Invalid credentials"

- [ ] Check `.env.local` has correct Supabase URL and key
- [ ] Verify users exist in Supabase Authentication panel
- [ ] Verify user profiles exist in `users` table (run verify-setup.sql)
- [ ] Try restarting dev server (`Ctrl+C`, then `npm run dev`)

### 404 errors on navigation

- [ ] Check all page files exist in `app/` folder
- [ ] Restart dev server

### Fonts look wrong

- [ ] Check browser console for errors
- [ ] Verify Google Fonts URL is accessible
- [ ] Clear browser cache

### Build errors

- [ ] Run `npm install` again
- [ ] Delete `.next` folder: `rm -rf .next`
- [ ] Run `npm run dev` again

### Supabase errors

- [ ] Check all SQL migrations ran successfully
- [ ] Verify RLS policies were created
- [ ] Check Supabase logs in dashboard

---

## Success!

If all checkboxes above are ✓, you have successfully completed Phase 1.

**Next:** Read `NEXT-STEPS.md` to proceed to Phase 2 (Policy Manager).

---

**Questions?**

- Review `README.md` for quick start
- Review `SETUP.md` for detailed setup
- Review `SCREENS.md` for visual reference
- Review `PROJECT-SUMMARY.md` for overview

**Aletheia — Confidential**
