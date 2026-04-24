# 🏛️ Aletheia — START HERE

**Turn board authority into executable AI governance**

---

## What You Have

A Next.js prototype of a governance platform for AI workflows in regulated enterprises.

**Target audience:** General Counsels and Chief Risk Officers at banks and financial institutions.

**Current status:** Phase 1 of 5 complete (foundation built, 4 more phases to go).

---

## Quick Start (5 minutes)

1. **Read this file** (you are here)
2. **Follow:** `CHECKLIST.md` — Step-by-step setup
3. **Test:** Login as 4 different users
4. **Next:** `NEXT-STEPS.md` — Build Phase 2

---

## Document Guide

### For Setup

- **START-HERE.md** ← You are here (navigation)
- **CHECKLIST.md** — Complete setup checklist
- **SETUP.md** — Detailed Supabase configuration
- **README.md** — Quick reference

### For Understanding

- **PROJECT-SUMMARY.md** — What is this? Why does it exist?
- **PHASE1-COMPLETE.md** — What's built so far
- **SCREENS.md** — Visual mockups of each page

### For Building

- **NEXT-STEPS.md** — How to proceed to Phase 2-5
- **supabase-setup.sql** — Database schema
- **scripts/verify-setup.sql** — Verify your setup

---

## The 5-Phase Plan

### ✅ Phase 1: Foundation (COMPLETE)
- Landing page
- Authentication (4 demo users)
- Dashboard shell with role-based navigation
- Design system (Crimson Pro + IBM Plex Sans + JetBrains Mono)

**Demo-able:** Login and navigate as different roles

---

### 🔲 Phase 2: Policy Manager (~2 hours)
- Admin creates governance policies
- Rules with patterns, severity, actions
- Test panel with regex matching

**Demo-able:** Policy-as-code editing

---

### 🔲 Phase 3: RFP Workflow (~3 hours)
- Operator ingests RFP questions
- AI classification and drafting (stubbed)
- Policy flags on answers
- Submit for approval

**Demo-able:** End-to-end workflow creation

---

### 🔲 Phase 4: Approval + Sealing (~3 hours)
- Approver reviews flagged items
- Approve/reject decisions
- SHA-256 content hashing
- Blockchain-style ledger

**Demo-able:** Approval flow + audit trail

---

### 🔲 Phase 5: Dashboard + PDF (~2-3 hours)
- Real dashboard metrics and charts
- Evidence Pack PDF (6 pages)
- Committee Report PDF

**Demo-able:** Full governance platform ready for board presentation

---

## File Structure Overview

```
aletheia/
│
├── START-HERE.md              ← You are here
├── CHECKLIST.md               ← Setup steps
├── SETUP.md                   ← Detailed setup
├── README.md                  ← Quick reference
├── PROJECT-SUMMARY.md         ← Project overview
├── PHASE1-COMPLETE.md        ← What's built
├── NEXT-STEPS.md             ← How to continue
├── SCREENS.md                ← Visual reference
│
├── .env.local                 ← Your Supabase credentials (create this)
├── .env.example               ← Template
│
├── supabase-setup.sql         ← Database schema
├── scripts/
│   └── verify-setup.sql       ← Setup verification
│
├── app/                       ← Next.js pages
│   ├── page.tsx               ← Landing page
│   ├── globals.css            ← Design system
│   ├── auth/login/            ← Login page
│   ├── dashboard/             ← Dashboard (with auth guard)
│   ├── workflows/             ← Phase 3
│   ├── approvals/             ← Phase 4
│   ├── ledger/                ← Phase 4
│   ├── reports/               ← Phase 5
│   └── admin/
│       ├── policies/          ← Phase 2
│       ├── users/             ← Future
│       └── authorities/       ← Future
│
├── components/
│   ├── ui/                    ← shadcn components
│   └── layout/
│       ├── sidebar.tsx        ← Navigation
│       └── topbar.tsx         ← User menu
│
└── lib/
    ├── supabase/              ← Client/server helpers
    ├── types.ts               ← TypeScript definitions
    └── utils.ts               ← Utilities
```

---

## Design System at a Glance

### Typography
- **Headings:** Crimson Pro (serif) — legal authority
- **Body:** IBM Plex Sans (sans-serif) — governmental trust
- **Code:** JetBrains Mono (monospace) — technical precision

### Colors
- **Base:** Slate (900 for dark, 50-200 for light backgrounds)
- **Primary:** Slate-800 (muted blue-gray)
- **Accent:** Amber-500 (warnings)
- **Status:** Blue (active), Amber (pending), Green (approved), Red (blocked)

### Feel
Not consumer SaaS. Not startup playful.

**This is software for board rooms and audits.**

---

## Demo Users

| Email | Password | Role | Sees |
|-------|----------|------|------|
| operator@demo.com | password123 | OPERATOR | Dashboard, Workflows, New Workflow |
| approver@demo.com | password123 | APPROVER | Dashboard, Approval Inbox |
| compliance@demo.com | password123 | COMPLIANCE | Dashboard, Workflows, Ledger, Reports |
| admin@demo.com | password123 | ADMIN | Dashboard, Policies, Users, Authorities |

---

## Your Next Steps

### 1. Complete Setup (30 minutes)

Follow **CHECKLIST.md** to:
- Create Supabase project
- Run database migration
- Create 4 demo users
- Configure `.env.local`
- Start dev server
- Test login and navigation

### 2. Verify Phase 1 (10 minutes)

Make sure:
- ✓ Landing page loads
- ✓ Can login as all 4 users
- ✓ Each user sees different sidebar navigation
- ✓ Dashboard shows 4 metric cards
- ✓ User dropdown works
- ✓ Logout and re-login works

### 3. Proceed to Phase 2

Once Phase 1 is verified:
- Read **NEXT-STEPS.md**
- Paste **Prompt 2** into your AI coding assistant
- Build the Policy Manager

---

## Timeline to Full Prototype

- Phase 1: ✅ Complete (you are here)
- Phase 2: ~2 hours (Policy Manager)
- Phase 3: ~3 hours (RFP Workflow)
- Phase 4: ~3 hours (Approval + Sealing)
- Phase 5: ~2-3 hours (Dashboard + PDF)

**Total:** 10-11 hours of focused work

**Working in 2-hour blocks?** 5-6 sessions to complete

---

## Support

### Troubleshooting
See **CHECKLIST.md** "Troubleshooting" section

### Questions About...
- **Setup:** Read SETUP.md
- **What's built:** Read PHASE1-COMPLETE.md
- **What to do next:** Read NEXT-STEPS.md
- **Project overview:** Read PROJECT-SUMMARY.md
- **Visual reference:** Read SCREENS.md

### Development Tips
- Don't re-prompt entire phases if something breaks
- Give specific, actionable fix instructions
- Reference file paths and line numbers
- Test as you go (login as different users)

---

## What You'll Have at the End

After completing all 5 phases:

✓ Role-based governance platform  
✓ Policy-as-code with executable rules  
✓ RFP workflow with AI classification  
✓ Approval routing and decision tracking  
✓ Cryptographic evidence sealing  
✓ Blockchain-style audit ledger  
✓ PDF evidence packs for board meetings  
✓ Committee report generation  

**Good enough to:**
- Demo to a General Counsel
- Pitch to a Chief Risk Officer
- Show in a board meeting
- Use as foundation for real implementation

---

## Ready?

**→ Go to CHECKLIST.md and start setup**

If you get stuck, read the relevant document from the list above.

---

**Aletheia — Turn board authority into executable AI governance**

*Confidential — 2026*
