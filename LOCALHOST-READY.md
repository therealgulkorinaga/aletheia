# ✅ Localhost Demo Ready!

Your Aletheia prototype is **ready to run locally** with zero setup.

---

## What You Have

✅ **Full UI working** — Landing page, login, dashboard, navigation  
✅ **Mock authentication** — 4 demo users, no database required  
✅ **Role-based access** — Each user sees different sidebar items  
✅ **Professional design** — Crimson Pro + IBM Plex Sans + JetBrains Mono  
✅ **Phase 1 complete** — Foundation ready, 4 more phases to go  

---

## Quick Start

### Option 1: One Command (Easiest)

```bash
cd /Users/arkoganguli/Projects/LegalAIprototype/aletheia
./test-local.sh
```

Browser opens automatically at http://localhost:3000

### Option 2: Manual

```bash
cd /Users/arkoganguli/Projects/LegalAIprototype/aletheia
npm install
npm run dev
```

Then open: http://localhost:3000

---

## Test the Demo

### 1. Landing Page
- Open http://localhost:3000
- See hero: "Turn board authority into executable AI governance"
- Click **Sign In**

### 2. Login as Each Role

Click the demo credential buttons to auto-fill, then **Sign In**:

| Role | Email | What You'll See |
|------|-------|-----------------|
| **OPERATOR** | operator@demo.com | Dashboard, Workflows, New Workflow |
| **APPROVER** | approver@demo.com | Dashboard, Approval Inbox |
| **COMPLIANCE** | compliance@demo.com | Dashboard, Workflows, Ledger, Reports |
| **ADMIN** | admin@demo.com | Dashboard, Policies, Users, Authorities |

Password for all: `password123`

### 3. Explore

- Click sidebar navigation items
- View dashboard metrics (stubbed data)
- Click user dropdown (top right) to logout
- Login as different user to see different navigation

---

## What's Working

✅ Landing page with professional design  
✅ Login with 4 demo users  
✅ Role-based sidebar navigation  
✅ Dashboard with 4 metric cards  
✅ User dropdown with logout  
✅ All stub pages for future phases  
✅ Fonts loaded via Next.js optimization  
✅ Mock auth (no Supabase required)  

---

## What's NOT Working Yet

These require Phases 2-5 (see `NEXT-STEPS.md`):

❌ Policy Manager (Phase 2)  
❌ Workflow creation (Phase 3)  
❌ Approvals (Phase 4)  
❌ Ledger/PDF (Phase 4-5)  
❌ Real database (using mock data)  

---

## Design Highlights

### Typography
- **Headings:** Crimson Pro (serif) — legal authority
- **Body:** IBM Plex Sans (sans-serif) — governmental trust
- **Code:** JetBrains Mono (monospace) — technical precision

### Color Palette
- Base: Slate (neutral, professional)
- Primary: Muted blue-gray
- Accent: Amber (warnings)
- Role badges: Blue, Amber, Purple, Gray

### Layout
- Dense information design
- Minimal rounded corners
- Serious, audit-ready aesthetic
- **Not** consumer SaaS playful

---

## Server Details

**Running:** http://localhost:3000  
**Port:** 3000 (change with `npm run dev -- -p 3001`)  
**Mode:** Development (with hot reload)  
**Auth:** Mock (cookie-based, no Supabase)  

---

## Troubleshooting

### Port 3000 already in use
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

### Fonts not loading
Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

### Build errors
```bash
rm -rf .next node_modules
npm install
npm run dev
```

### Can't login
- Use demo credential buttons
- Password is always: `password123`
- Check browser console for errors

---

## Demo Script (2 minutes)

Perfect for showing someone:

1. Open http://localhost:3000
2. "This is Aletheia — a governance platform for AI workflows in banks."
3. Click **Sign In**
4. Click **OPERATOR** button → **Sign In**
5. "Operators create workflows — notice role-specific navigation."
6. Click **Workflows** in sidebar
7. "This placeholder shows what Phase 3 will build."
8. Click user dropdown → **Log out**
9. Login as **ADMIN**
10. "Admins see Policies, Users, Authorities — different navigation."
11. Click **Policies**
12. "Phase 2 will build the policy editor here."

---

## What's Next?

### To Continue Development

**After** testing localhost demo:

1. Read `NEXT-STEPS.md` for Phase 2-5 overview
2. Setup real Supabase (optional, see `CHECKLIST.md`)
3. Build Policy Manager (paste Prompt 2 into AI)
4. Build RFP Workflow (paste Prompt 3)
5. Build Approvals (paste Prompt 4)
6. Build Dashboard + PDF (paste Prompt 5)

**Timeline:** ~10-11 hours total across 5 phases

### To Just Explore

Click around as each user! Every route has a placeholder showing what will be built.

---

## Key Documents

- **START-HERE.md** — Main navigation
- **QUICKSTART.md** — Quick start guide (this file's detailed version)
- **PROJECT-SUMMARY.md** — Full project overview
- **PHASE1-COMPLETE.md** — What's built so far
- **NEXT-STEPS.md** — How to proceed to Phase 2-5
- **SCREENS.md** — Visual mockups
- **PHASES-REFERENCE.md** — Quick reference for all phases

---

## Stop Server

Press **Ctrl+C** in terminal

---

**You now have a working localhost demo!**

Open http://localhost:3000 and click around as different users.

**Aletheia — Confidential**
