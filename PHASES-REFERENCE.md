# Aletheia — 5 Phases Quick Reference

## Phase 1: Foundation ✅ COMPLETE

**Files created:**
- Landing page (`app/page.tsx`)
- Login page (`app/auth/login/page.tsx`)
- Dashboard layout (`app/dashboard/layout.tsx`)
- Dashboard page (`app/dashboard/page.tsx`)
- Sidebar (`components/layout/sidebar.tsx`)
- Topbar (`components/layout/topbar.tsx`)
- Stub pages for all routes

**Database:**
```sql
users (id, email, name, role, department, created_at)
```

**Demo users:** 4 users (Operator, Approver, Compliance, Admin)

**What works:**
- Login with role-based auth
- Role-specific sidebar navigation
- Dashboard with metric cards (stubbed)
- User dropdown with logout

**Next:** Phase 2

---

## Phase 2: Policy Manager (Admin)

**What to build:**
- Policy list page (`/admin/policies`)
- Policy editor (`/admin/policies/[id]`)
- Rules management (add/edit/delete)
- Test Policy panel with regex matching
- Seed policy: "RFP Response Authority Policy v1" with 3 rules

**Database tables:**
```sql
policies (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  status TEXT CHECK (status IN ('DRAFT', 'ACTIVE', 'RETIRED')),
  effective_from DATE,
  rules_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

**Key components:**
- Policy list table
- Policy editor form
- Rule card components
- Test panel with textarea

**Demo as:** admin@demo.com

**Acceptance criteria:**
- Can create new policy
- Can add rules with patterns
- Test panel flags matching patterns
- Policy shows Active/Draft status

**Timeline:** ~2 hours

---

## Phase 3: RFP Workflow (Operator)

**What to build:**
- Workflow wizard (`/workflows/new`) — 5 steps:
  1. Ingest RFP questions
  2. AI classification (stubbed)
  3. Drafted answers with policy flags
  4. Evidence upload
  5. Submit for approval
- Workflow detail page (`/workflows/[id]`)
- Workflow list page (`/workflows`)

**Database tables:**
```sql
workflows (
  id UUID PRIMARY KEY,
  type TEXT,
  status TEXT CHECK (status IN ('INITIATED', 'IN_REVIEW', 'APPROVALS_PENDING', 'APPROVED', 'DISPATCHED', 'BLOCKED')),
  subject TEXT NOT NULL,
  initiated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)

workflow_steps (
  id UUID PRIMARY KEY,
  workflow_id UUID REFERENCES workflows(id),
  sequence INT,
  name TEXT,
  type TEXT,
  status TEXT,
  output_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
)

authority_checks (
  id UUID PRIMARY KEY,
  workflow_step_id UUID REFERENCES workflow_steps(id),
  verdict TEXT,
  rules_triggered_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
)

approvals (
  id UUID PRIMARY KEY,
  workflow_step_id UUID REFERENCES workflow_steps(id),
  approver_role TEXT,
  approver_user_id UUID REFERENCES users(id),
  decision TEXT CHECK (decision IN ('PENDING', 'APPROVED', 'REJECTED', 'CHANGES_REQUESTED')),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

**Key components:**
- 5-step wizard with navigation
- Question ingestion textarea
- Policy flag badges
- File upload for evidence
- Approval summary card

**Demo as:** operator@demo.com

**Acceptance criteria:**
- Can paste RFP questions
- See policy flags on answers
- Upload evidence file
- Submit creates workflow + approval records
- Workflow detail shows timeline

**Timeline:** ~3 hours

---

## Phase 4: Approval Inbox + Evidence Sealing

**What to build:**
- Approval inbox (`/approvals`)
- Approval detail view
- Decision panel (Approve/Reject/Request Changes)
- Evidence sealing with SHA-256
- Ledger entries table
- Ledger page (`/ledger`) with chain verification

**Database tables:**
```sql
evidence (
  id UUID PRIMARY KEY,
  workflow_id UUID REFERENCES workflows(id),
  type TEXT,
  content_hash TEXT,
  content_snapshot_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
)

ledger_entries (
  id UUID PRIMARY KEY,
  sequence SERIAL,
  event_type TEXT,
  workflow_id UUID REFERENCES workflows(id),
  payload_json JSONB,
  payload_hash TEXT,
  previous_hash TEXT,
  chain_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

**Key components:**
- Approval inbox list
- Approval decision form
- SHA-256 hashing function
- Chain verification logic
- Ledger table view

**Demo as:** 
- approver@demo.com (approve items)
- compliance@demo.com (view ledger)

**Acceptance criteria:**
- Approver sees pending items
- Can approve/reject with comment
- Workflow updates to APPROVED
- Operator can "Seal and Dispatch"
- Sealing generates SHA-256 hash
- Ledger shows all events
- Chain verification passes

**Timeline:** ~3 hours

---

## Phase 5: Dashboard + Evidence Pack PDF

**What to build:**
- Real dashboard queries (replace stubbed metrics)
- Charts:
  - Workflows by status (horizontal bar)
  - Top 5 rules triggered (bar chart)
- Recent activity feed from ledger
- Evidence Pack PDF (6 pages):
  1. Cover
  2. Timeline
  3. Authority Checks
  4. Approvals
  5. Final Artefact
  6. Chain Verification
- Committee Report PDF
- Enhanced landing page (refinements)

**Dependencies:**
```bash
npm install @react-pdf/renderer
```

**Key components:**
- Real SQL queries for metrics
- Chart components (use recharts or similar)
- PDF document components
- PDF download buttons

**Demo as:** 
- compliance@demo.com (view dashboard, generate reports)
- admin@demo.com (committee report)

**Acceptance criteria:**
- Dashboard shows real data from DB
- Charts render correctly
- Can download Evidence Pack PDF
- PDF has 6 sections
- Committee Report generates
- Landing page refinements complete

**Timeline:** ~2-3 hours

---

## Total Timeline

**Phase 1:** ✅ Complete  
**Phase 2:** ~2 hours  
**Phase 3:** ~3 hours  
**Phase 4:** ~3 hours  
**Phase 5:** ~2-3 hours  

**Total:** 10-11 hours

---

## Testing Checklist

After each phase, verify:

### Phase 1
- [ ] Login as 4 users
- [ ] Each sees different navigation
- [ ] Dashboard shows metrics

### Phase 2
- [ ] Admin can create policy
- [ ] Can add rules
- [ ] Test panel matches patterns

### Phase 3
- [ ] Operator can create workflow
- [ ] Policy flags appear on answers
- [ ] Submit creates approval records

### Phase 4
- [ ] Approver sees inbox
- [ ] Can approve/reject
- [ ] Sealing generates hash
- [ ] Ledger chain verifies

### Phase 5
- [ ] Dashboard shows real data
- [ ] Charts render
- [ ] PDF downloads work
- [ ] PDF has all sections

---

## Database Schema Summary

```
users                 # Phase 1
policies              # Phase 2
workflows             # Phase 3
workflow_steps        # Phase 3
authority_checks      # Phase 3
approvals             # Phase 3
evidence              # Phase 4
ledger_entries        # Phase 4
```

---

## Route Map

```
/                           # Landing (Phase 1)
/auth/login                 # Login (Phase 1)
/dashboard                  # Dashboard (Phase 1, enhanced Phase 5)

# Operator
/workflows                  # List (Phase 3)
/workflows/new              # Wizard (Phase 3)
/workflows/[id]             # Detail (Phase 3)

# Approver
/approvals                  # Inbox (Phase 4)
/approvals/[id]             # Detail (Phase 4)

# Compliance
/ledger                     # Ledger (Phase 4)
/reports                    # Reports (Phase 5)

# Admin
/admin/policies             # List (Phase 2)
/admin/policies/[id]        # Editor (Phase 2)
/admin/users                # Future
/admin/authorities          # Future
```

---

## Component Hierarchy

```
RootLayout (app/layout.tsx)
├── LandingPage (app/page.tsx)
└── LoginPage (app/auth/login/page.tsx)

DashboardLayout (app/dashboard/layout.tsx)
├── Sidebar (components/layout/sidebar.tsx)
├── Topbar (components/layout/topbar.tsx)
└── Children:
    ├── Dashboard (app/dashboard/page.tsx)
    ├── WorkflowWizard (app/workflows/new/page.tsx)
    ├── ApprovalInbox (app/approvals/page.tsx)
    ├── Ledger (app/ledger/page.tsx)
    └── PolicyEditor (app/admin/policies/[id]/page.tsx)
```

---

**Use this as a quick reference while building phases 2-5**

Aletheia — Confidential
