# Aletheia — AI Governance Platform

A governance platform for AI workflows in regulated enterprises. Turn board authority into executable AI governance.

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth

## Getting Started

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the contents of `supabase-setup.sql`
3. Go to Authentication → Email → Enable "Email provider"
4. Create 4 demo users manually in Authentication → Users:
   - operator@demo.com (password: password123)
   - approver@demo.com (password: password123)
   - compliance@demo.com (password: password123)
   - admin@demo.com (password: password123)
5. After creating auth users, go to SQL Editor and insert user records:

```sql
-- Replace UUIDs with actual auth.users IDs from the Authentication panel
INSERT INTO users (id, email, name, role, department)
VALUES
  ('YOUR-OPERATOR-UUID', 'operator@demo.com', 'Sarah Chen', 'OPERATOR', 'Operations'),
  ('YOUR-APPROVER-UUID', 'approver@demo.com', 'Michael Roberts', 'APPROVER', 'Legal'),
  ('YOUR-COMPLIANCE-UUID', 'compliance@demo.com', 'Emily Watson', 'COMPLIANCE', 'Compliance'),
  ('YOUR-ADMIN-UUID', 'admin@demo.com', 'James Anderson', 'ADMIN', 'Administration');
```

6. Copy your project URL and anon key from Settings → API

### 2. Environment Variables

Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Users

Login with any of these accounts (password: `password123`):

- **operator@demo.com** — Operations role, can create workflows
- **approver@demo.com** — Approver role, reviews workflow decisions
- **compliance@demo.com** — Compliance role, read-only workflow access, ledger, reports
- **admin@demo.com** — Administrator role, full system access including policies

## Features Implemented (Phase 1)

- ✅ Landing page with hero and three pillars
- ✅ Authentication with Supabase
- ✅ Role-based sidebar navigation
- ✅ Top bar with user menu
- ✅ Dashboard with metric cards (stubbed data)
- ✅ Professional design with Crimson Pro + IBM Plex Sans + JetBrains Mono

## Design Principles

**Typography:**
- Headings: Crimson Pro (serif) — legal authority
- Body: IBM Plex Sans — governmental trust
- Code/Data: JetBrains Mono — technical precision

**Color Palette:**
- Deep slate base
- Muted blue-gray primary
- Amber accents for warnings
- High information density

**Target Audience:**
General Counsels and Chief Risk Officers of banks and regulated enterprises.

## Next Steps

Phase 2 will add:
- Policy Manager (Admin role)
- RFP Workflow (Operator role)
- Approval Inbox (Approver role)
- Evidence sealing and ledger
- PDF evidence pack generation

---

**Aletheia — Confidential**
