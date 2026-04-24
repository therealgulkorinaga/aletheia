# Aletheia — Project Summary

## What Is This?

**Aletheia** is a governance platform for AI workflows in regulated enterprises. It turns board-level policies into executable rules, governs every AI action, and produces defensible audit evidence.

**Target Users:** General Counsels, Chief Risk Officers, Company Secretaries at banks and regulated enterprises in the UK and EU.

---

## The Pitch (30 seconds)

> "Boards own accountability. Operations own execution. Evidence lives nowhere. AI is widening the gap.
>
> Aletheia bridges that gap. It turns policy into executable rules, governs every AI action, and produces defensible evidence. Think Bloomberg Terminal meets Linear — designed for serious people doing serious work."

---

## Design Philosophy

### 1. Authoritative Typography
- **Crimson Pro** (serif) for headings → legal authority
- **IBM Plex Sans** (sans) for body → governmental trust
- **JetBrains Mono** (mono) for code/data → technical precision

### 2. Restrained Color Palette
- Deep slate base (900 for dark, 50-200 for light)
- Muted blue-gray primary
- Amber accents for warnings
- No playful gradients or consumer SaaS aesthetics

### 3. High Information Density
- Not "friendly and approachable"
- Not "delightful and fun"
- **Precise, audit-ready, board-room appropriate**

### 4. Explicit Over Implicit
- Every action has a clear consequence
- Every decision generates evidence
- Every evidence artifact is cryptographically sealed

---

## Tech Stack

- **Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Components:** shadcn/ui (Radix primitives)
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth with Row-Level Security
- **Fonts:** Google Fonts (Crimson Pro, IBM Plex Sans, JetBrains Mono)
- **PDF:** @react-pdf/renderer (Phase 5)
- **Crypto:** SubtleCrypto Web API for SHA-256 hashing

---

## Current Status: Phase 1 Complete ✓

### What's Built

1. **Landing Page**
   - Professional hero section
   - Three-pillar problem/solution/audience breakdown
   - Clean, authoritative design

2. **Authentication**
   - Email/password login
   - 4 demo users (Operator, Approver, Compliance, Admin)
   - Supabase Auth integration

3. **Dashboard Shell**
   - Role-based sidebar navigation
   - User menu with role badge
   - 4 metric cards (stubbed data)

4. **Stub Pages**
   - All routes created for Phases 2-5

### What's NOT Built Yet

- Policy Manager (Phase 2)
- RFP Workflow (Phase 3)
- Approval System (Phase 4)
- Evidence Sealing + Ledger (Phase 4)
- PDF Generation (Phase 5)
- Real Dashboard Queries (Phase 5)

---

## The 5 Phases

### Phase 1: Foundation ✓
- Landing + Auth + Dashboard Shell
- **Timeline:** Complete
- **Demo-able:** Basic auth and navigation

### Phase 2: Policy Manager
- Admin creates governance policies
- Each policy contains rules (patterns, severity, actions)
- "Test Policy" panel with regex matching
- **Timeline:** ~2 hours
- **Demo-able:** Policy-as-code editing

### Phase 3: RFP Workflow
- Operator ingests RFP questions
- AI classification (stubbed)
- AI drafting with real-time policy flagging
- Evidence upload
- Submit for approval
- **Timeline:** ~3 hours
- **Demo-able:** End-to-end workflow creation

### Phase 4: Approval + Sealing
- Approver reviews flagged items
- Approve/Reject/Request Changes
- SHA-256 content hashing
- Blockchain-style ledger with chain verification
- **Timeline:** ~3 hours
- **Demo-able:** Approval flow + audit trail

### Phase 5: Dashboard + PDF
- Real metrics (replace stubbed data)
- Charts (workflows by status, top rules)
- Evidence Pack PDF (6-page report)
- Committee Report PDF
- **Timeline:** ~2-3 hours
- **Demo-able:** Full governance platform ready for board presentation

---

## Demo Users

| Email | Password | Role | Purpose |
|-------|----------|------|---------|
| operator@demo.com | password123 | OPERATOR | Creates workflows |
| approver@demo.com | password123 | APPROVER | Reviews and approves |
| compliance@demo.com | password123 | COMPLIANCE | Audit and reporting |
| admin@demo.com | password123 | ADMIN | Policy configuration |

---

## File Structure

```
aletheia/
├── app/                           # Next.js App Router
│   ├── page.tsx                   # Landing page
│   ├── globals.css                # Design system
│   ├── auth/login/page.tsx       # Login
│   ├── dashboard/
│   │   ├── layout.tsx            # Auth guard
│   │   └── page.tsx              # Dashboard
│   ├── workflows/                # Phase 3
│   ├── approvals/                # Phase 4
│   ├── ledger/                   # Phase 4
│   ├── reports/                  # Phase 5
│   └── admin/
│       ├── policies/             # Phase 2
│       ├── users/                # Future
│       └── authorities/          # Future
├── components/
│   ├── ui/                       # shadcn components
│   └── layout/
│       ├── sidebar.tsx           # Navigation
│       └── topbar.tsx            # User menu
├── lib/
│   ├── supabase/                 # Client/server helpers
│   ├── types.ts                  # TypeScript types
│   └── utils.ts                  # Utilities
├── supabase-setup.sql            # Database schema
├── scripts/verify-setup.sql      # Setup verification
├── README.md                     # Quick start
├── SETUP.md                      # Detailed setup
├── PHASE1-COMPLETE.md           # Phase 1 summary
├── NEXT-STEPS.md                # What to do next
├── SCREENS.md                   # Visual reference
└── PROJECT-SUMMARY.md           # This file
```

---

## Key Documents

1. **README.md** — Quick start guide
2. **SETUP.md** — Detailed Supabase setup
3. **PHASE1-COMPLETE.md** — What's built in Phase 1
4. **NEXT-STEPS.md** — How to proceed to Phase 2
5. **SCREENS.md** — ASCII mockups of each screen
6. **PROJECT-SUMMARY.md** — This overview

---

## Development Workflow

1. **Setup** (once)
   - Create Supabase project
   - Run `supabase-setup.sql`
   - Create 4 auth users
   - Insert user profiles
   - Configure `.env.local`

2. **Build** (per phase)
   - Paste the phase prompt into AI coding assistant
   - Review generated code
   - Test as the relevant user role
   - Verify database records

3. **Iterate** (as needed)
   - Don't re-prompt entire phases
   - Give specific, actionable fix instructions
   - Reference file paths and line numbers

---

## Success Criteria

You'll know it's working when:

### Phase 1 (Now)
- ✓ Can login as all 4 users
- ✓ Each user sees role-appropriate navigation
- ✓ Dashboard shows metric cards

### Phase 2
- ✓ Admin can create a policy with rules
- ✓ "Test Policy" panel matches patterns
- ✓ Rules display severity badges

### Phase 3
- ✓ Operator can paste RFP questions
- ✓ Drafted answers show policy flags
- ✓ Can submit workflow for approval

### Phase 4
- ✓ Approver sees pending items
- ✓ Can approve/reject with comments
- ✓ Sealed workflows show SHA-256 hash
- ✓ Ledger chain verifies intact

### Phase 5
- ✓ Dashboard shows real data
- ✓ Can download Evidence Pack PDF
- ✓ PDF contains 6 sections
- ✓ Committee Report generates

---

## Deployment Readiness

This prototype is designed for:
- ✓ **Pitch decks** — Screenshots and live demo
- ✓ **Board presentations** — Evidence Pack PDF
- ✓ **Customer discovery** — Role-based walkthroughs
- ✓ **Investment discussions** — Technical credibility

This is NOT production-ready for:
- ✗ Real customer data (needs proper security review)
- ✗ Scale (needs optimization)
- ✗ Compliance (needs legal review)

---

## Contact / Next Steps

**Current Phase:** 1 of 5 complete

**Next Action:** Follow NEXT-STEPS.md to verify setup, then paste Prompt 2 to build Policy Manager.

**Timeline to Complete:** 10-11 hours across 5 phases

**End Goal:** Fully functional governance platform prototype ready for General Counsel demo

---

**Aletheia — Turn board authority into executable AI governance**

Confidential — 2026
