# Aletheia Setup Guide

## Quick Start (5 minutes)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to initialize (~2 minutes)

### 2. Run Database Migration

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy and paste the entire contents of `supabase-setup.sql`
4. Click **Run** or press `Ctrl/Cmd + Enter`

### 3. Create Demo Users

1. Go to **Authentication** → **Users** in Supabase dashboard
2. Click **Add user** → **Create new user**
3. Create each user:

```
Email: operator@demo.com
Password: password123
✓ Auto Confirm User
```

```
Email: approver@demo.com
Password: password123
✓ Auto Confirm User
```

```
Email: compliance@demo.com
Password: password123
✓ Auto Confirm User
```

```
Email: admin@demo.com
Password: password123
✓ Auto Confirm User
```

### 4. Link Users to Database

After creating auth users, you need to insert their profiles:

1. Go back to **SQL Editor**
2. Run this query to get the UUIDs:

```sql
SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 4;
```

3. Copy the UUIDs and run the insert (replace the UUIDs):

```sql
INSERT INTO users (id, email, name, role, department)
VALUES
  ('uuid-of-operator', 'operator@demo.com', 'Sarah Chen', 'OPERATOR', 'Operations'),
  ('uuid-of-approver', 'approver@demo.com', 'Michael Roberts', 'APPROVER', 'Legal'),
  ('uuid-of-compliance', 'compliance@demo.com', 'Emily Watson', 'COMPLIANCE', 'Compliance'),
  ('uuid-of-admin', 'admin@demo.com', 'James Anderson', 'ADMIN', 'Administration');
```

### 5. Get API Keys

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** (e.g., `https://abcdefgh.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

### 6. Configure Environment

1. Open `.env.local` in the project root
2. Replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-key-here
```

### 7. Start the App

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Testing Role-Based Access

Login with each demo user to test role-based navigation:

### Operator (operator@demo.com)
- Can see: Dashboard, Workflows, New Workflow
- Use case: Create and manage RFP response workflows

### Approver (approver@demo.com)
- Can see: Dashboard, Approval Inbox
- Use case: Review and approve workflow decisions

### Compliance (compliance@demo.com)
- Can see: Dashboard, Workflows (read-only), Ledger, Reports
- Use case: Audit trail and reporting

### Admin (admin@demo.com)
- Can see: Everything including Policies, Users, Authorities
- Use case: Configure governance rules and manage system

---

## Troubleshooting

### "Invalid credentials" error
- Verify users were created in Supabase Authentication
- Check that `.env.local` has correct URL and key
- Ensure user records exist in the `users` table

### Navigation broken / 404 errors
- Check that all route pages exist
- Verify dashboard layout is wrapping routes correctly

### Fonts not loading
- Check console for blocked cross-origin requests
- Verify Google Fonts URL is accessible

### Database errors
- Confirm `supabase-setup.sql` ran successfully
- Check SQL Editor for any error messages
- Verify RLS policies are created

---

## Next: Phase 2

Once Phase 1 is working, you're ready for:
- Policy Manager (Prompt 2)
- RFP Workflow (Prompt 3)
- Approval System (Prompt 4)
- Evidence Sealing & PDF (Prompt 5)

**Aletheia — Confidential**
