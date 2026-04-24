# Quick Start — Local Demo (No Setup Required!)

Run Aletheia locally in **under 2 minutes** with mock authentication. No Supabase setup needed.

---

## One-Command Start

```bash
cd /Users/arkoganguli/Projects/LegalAIprototype/aletheia
./test-local.sh
```

This will:
- Install dependencies
- Start dev server
- Open browser automatically

---

## Manual Start (alternative)

```bash
cd /Users/arkoganguli/Projects/LegalAIprototype/aletheia
npm install
npm run dev
```

Then open: **http://localhost:3000**

---

## Test (1 minute)

### 1. Open Browser
Go to: **http://localhost:3000**

### 2. View Landing Page
- See professional hero: "Turn board authority into executable AI governance"
- Three pillar cards (Problem, Solution, Audience)
- Click **Sign In**

### 3. Login as Operator
- Click the **OPERATOR** demo button (auto-fills credentials)
- Click **Sign In**
- Redirects to `/dashboard`

### 4. Explore Dashboard
- See 4 metric cards (stubbed data)
- Left sidebar shows:
  - Dashboard
  - Workflows
  - New Workflow
- Click around

### 5. Test Other Roles

**Logout** (user menu top right) → **Log out**

Login as each:

| Button | Email | Role | Sees |
|--------|-------|------|------|
| **OPERATOR** | operator@demo.com | OPERATOR | Dashboard, Workflows, New Workflow |
| **APPROVER** | approver@demo.com | APPROVER | Dashboard, Approval Inbox |
| **COMPLIANCE** | compliance@demo.com | COMPLIANCE | Dashboard, Workflows, Ledger, Reports |
| **ADMIN** | admin@demo.com | ADMIN | Dashboard, Policies, Users, Authorities |

**Password for all:** `password123`

---

## What's Working

✅ Landing page  
✅ Login with 4 demo users  
✅ Role-based sidebar navigation  
✅ Dashboard with metric cards  
✅ User dropdown with logout  
✅ All stub pages (click around!)  

---

## What's NOT Working Yet

❌ Real database (using mock data)  
❌ Policy Manager (Phase 2)  
❌ Workflow creation (Phase 3)  
❌ Approvals (Phase 4)  
❌ Ledger/PDF (Phase 4-5)  

These require Phases 2-5 (see `NEXT-STEPS.md`).

---

## Design Details to Notice

### Typography
- **Headings:** Crimson Pro (serif) — notice the legal authority feel
- **Body:** IBM Plex Sans — clean, governmental
- **Code/IDs:** JetBrains Mono — technical precision

### Colors
- Slate base (not bright white or black)
- Muted blue-gray buttons
- Amber accents for warnings
- Role badges: Blue (Operator), Amber (Approver), Purple (Compliance), Gray (Admin)

### Layout
- Dense information layout
- Minimal rounded corners
- Serious, audit-ready aesthetic
- **Not** consumer SaaS playful

---

## Troubleshooting

### Port 3000 already in use
```bash
# Kill the process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Fonts not loading
- Check browser console for errors
- Try hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

### Build errors
```bash
# Clean and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

### Can't login
- Check all 4 demo buttons work
- Password is always: `password123`
- If stuck, restart dev server

---

## What's Next?

### To Continue Development

1. **Read:** `NEXT-STEPS.md`
2. **Setup:** Real Supabase (follow `CHECKLIST.md`)
3. **Build:** Phase 2 (Policy Manager)

### To Just Explore

Click around as different users! Every route has a placeholder page showing what will be built in future phases.

---

## Demo Script (for showing someone)

**"Let me show you Aletheia — a governance platform for AI workflows in banks."**

1. Open http://localhost:3000
2. "This landing page is what a General Counsel would see."
3. Click **Sign In**
4. Click **OPERATOR** button
5. Click **Sign In**
6. "Operators create workflows — notice the sidebar navigation is role-specific."
7. Click user dropdown (top right)
8. **Log out**
9. Login as **ADMIN**
10. "Admins see different options — Policies, Users, Authorities."
11. Click **Policies**
12. "This is where governance rules will be defined in Phase 2."

**Total demo time:** 2 minutes

---

## Questions?

- **What is this?** Read `PROJECT-SUMMARY.md`
- **How do I set up for real?** Read `SETUP.md`
- **What's built?** Read `PHASE1-COMPLETE.md`
- **What's next?** Read `NEXT-STEPS.md`

---

**You're running Phase 1 of 5 — the foundation**

**Aletheia — Confidential**
