# Phase 3: RFP Workflow ✅ COMPLETE

## What's Built

### 1. Workflow List Page (`/workflows`)
- Table view of all workflows
- Columns: Subject, Type, Status, Created, Progress, Actions
- Status badges with color coding
- "New Workflow" button
- Empty state with CTA
- Progress tracking (steps completed / total)

### 2. 5-Step Workflow Wizard (`/workflows/new`)
Complete RFP response workflow with visual progress indicator.

#### Step 1: Ingest RFP
- Subject/customer name input
- Large textarea for questions (one per line)
- "Use Sample Data" button pre-fills demo questions
- Sample questions:
  - What is your platform's uptime SLA?
  - Do you support SOC 2 compliance?
  - Will your product support custom workflow builders by Q3?
  - What is your data retention policy?
  - Can you commit to 99.99% availability?

#### Step 2: AI Classification (Stubbed)
- 2-second simulated delay with loading animation
- Auto-classifies each question as LOW/MEDIUM/HIGH risk
- Risk badges color-coded (blue/yellow/orange)
- Hardcoded logic:
  - Questions with "SLA", "uptime", "commit", "availability" → HIGH
  - Questions with "SOC", "complian", "certif" → MEDIUM
  - Others → LOW

#### Step 3: AI-Drafted Answers (Stubbed + Policy Check)
- 2.5-second simulated delay
- Generates realistic draft answers based on keywords
- **Runs policy check automatically** against active policy
- Shows policy flags inline under each answer:
  - Rule name
  - Matched patterns
  - Severity badge
  - Action badge
  - Reason for flagging
- Example drafts:
  - "Our platform provides 99.95% uptime backed by a full SLA..." → Flags Rule 1
  - "Yes, we are SOC 2 Type II certified..." → Flags Rule 3
  - "Yes, custom workflow builders are on our Q3 roadmap..." → Flags Rule 2

#### Step 4: Evidence Collection
- Shows only questions requiring evidence
- File upload per question
- Checkmark when document attached
- Green success state if no evidence required
- Validates all required evidence before proceeding

#### Step 5: Submit for Approval
- Workflow summary card:
  - Subject
  - Questions processed count
  - Items requiring approval count (amber)
  - Evidence attached count (blue with ✓)
- Lists required approvers extracted from flags:
  - Head of Delivery
  - Head of Product
  - General Counsel
- Warning banner: "Ready to submit"
- Submit button creates workflow record

### 3. Workflow Detail Page (`/workflows/[id]`)
- Header with subject, status badge, creation date
- Back button + Download Evidence Pack (if approved)
- Timeline showing all 5 steps with:
  - Checkmarks for completed
  - Clock icons for pending
  - Step names and timestamps
- Approval Status card (if pending):
  - Pending items count
  - Required approvers list
- Questions & Drafted Answers accordion:
  - Each question expanded
  - Risk badges
  - Drafted answer text
  - Policy flags with details

### 4. Mock Backend Logic
**Classification:**
- Keyword-based risk assessment
- Returns LOW/MEDIUM/HIGH per question

**Drafting:**
- Keyword matching to realistic responses
- Runs policy check via existing `testPolicy()` function
- Attaches flags to each question

**Policy Integration:**
- Uses "RFP Response Authority Policy v1" from Phase 2
- Pattern matching on draft answers
- Extracts required approvers from rules

### 5. API Routes
- `GET /api/workflows` — List all workflows
- `POST /api/workflows` — Create workflow
- `GET /api/workflows/[id]` — Get workflow detail
- `PUT /api/workflows/[id]` — Update workflow
- `POST /api/workflows/classify` — Classify questions
- `POST /api/workflows/draft` — Draft answers + policy check

## Testing Instructions

### Quick Test (5 minutes)

**1. Login as Operator**
```
Email: operator@demo.com
Password: password123
```

**2. Start New Workflow**
- Click **New Workflow** in sidebar (or **Workflows** → **New Workflow**)
- Subject: "Acme Corp RFP - Q1 2026"
- Click **Use Sample Data** button
- Click **Next**

**3. Watch AI Classification**
- See 2-second loading animation
- See questions with risk badges (HIGH/MEDIUM/LOW)
- Click **Next**

**4. Watch AI Drafting + Policy Check**
- See 2.5-second loading animation
- See drafted answers
- **Notice policy flags appear automatically:**
  - Question 1 (SLA) → Orange "SLA commitments require delivery approval"
  - Question 2 (SOC 2) → Blue "Compliance certification claims need evidence"
  - Question 5 (99.99%) → Orange "SLA commitments require delivery approval"
- Click **Next**

**5. Upload Evidence**
- See SOC 2 question requiring evidence
- Upload any file (PDF, image, etc.)
- See green checkmark "Document attached"
- Click **Next**

**6. Review & Submit**
- See summary:
  - 5 questions processed
  - 3 requiring approval
  - 1 evidence attached ✓
- See required approvers: Head of Delivery, Head of Product, General Counsel
- Click **Submit for Approval**

**7. View Workflow**
- Redirects to workflow detail page
- See timeline with 5 completed steps
- See "Approval Status: PENDING"
- See all Q&A with flags
- Click **Back**

**8. View Workflow List**
- See your new workflow in table
- Status: APPROVALS_PENDING (amber)
- Progress: 5 / 5

### Full Test (10 minutes)

**Test Custom Questions:**

Create workflow with:
```
Subject: Test Bank RFP

Questions:
What is your pricing model?
Do you offer a free trial?
What encryption standards do you use?
Can you guarantee zero downtime?
Will you commit to delivering API v3 by June?
```

Expected flags:
- "pricing", "free" → No flags (not in policy)
- "encryption" → Possibly "security claims need evidence" if you added that rule
- "guarantee", "zero downtime" → SLA rule (if "guarantee" in patterns)
- "commit to delivering" → Roadmap rule (semantic)

**Test Evidence-Only Workflow:**

Questions that only trigger REQUIRE_EVIDENCE:
```
Are you SOC 2 certified?
Do you have ISO 27001 certification?
Are you HIPAA compliant?
```

Should go straight from Step 3 → Step 4 (evidence) → Step 5 (submit)
No approval required.

**Test High-Risk Workflow:**

Questions that all trigger HIGH/CRITICAL:
```
What is your uptime SLA?
Can you commit to 99.99% availability?
Will you deliver custom integrations by Q2?
What roadmap features can you guarantee?
```

Should show multiple flags, many approvers needed.

## File Structure

```
app/
├── workflows/
│   ├── page.tsx              # Workflow list
│   ├── new/page.tsx          # 5-step wizard (500+ lines!)
│   └── [id]/page.tsx         # Workflow detail
├── api/workflows/
│   ├── route.ts              # List/Create
│   ├── [id]/route.ts         # Get/Update
│   ├── classify/route.ts     # AI classification
│   └── draft/route.ts        # AI drafting + policy check
lib/
├── types/
│   └── workflow.ts           # Workflow, Step, Approval types
└── mock-data/
    └── workflows.ts          # Storage + AI logic + policy integration
```

## Key Features

### Visual Progress
- 5-step indicator at top
- Current step highlighted (dark)
- Completed steps green with checkmarks
- Connecting lines show progress

### AI Simulation
- Realistic loading states (2-2.5 seconds)
- Spinning loader icon
- "Processing..." messages
- Smooth transitions between steps

### Policy Integration
- **Automatic policy check** in Step 3
- Uses Phase 2 policy engine
- Real pattern matching
- Flags appear inline under answers
- Color-coded by action type

### Evidence Workflow
- Only shows questions needing evidence
- File upload per question
- Visual confirmation when attached
- Blocks progression if missing
- Green "no evidence needed" state

### Approval Summary
- Extracts required approvers from rules
- Shows counts (questions, approvals, evidence)
- Warning banner before submit
- Creates workflow record with all steps

## Design Details

### Status Colors
- INITIATED: Gray
- IN_REVIEW: Blue
- APPROVALS_PENDING: Amber
- APPROVED: Green
- DISPATCHED: Slate
- BLOCKED: Red

### Risk Colors
- LOW: Blue
- MEDIUM: Yellow
- HIGH: Orange

### Policy Flag Colors
- REQUIRE_APPROVAL: Amber (matches status)
- REQUIRE_EVIDENCE: Blue
- BLOCK: Red
- ESCALATE: Purple

### Step Flow
1. Ingest (user input)
2. Classification (AI simulated)
3. Drafting (AI simulated + **real policy check**)
4. Evidence (conditional, user upload)
5. Submit (summary + create workflow)

## Integration with Phase 2

### Policy Connection
- Workflow wizard calls `testPolicy()` from Phase 2
- Uses active "RFP Response Authority Policy v1"
- Pattern matching works on drafted answers
- Flags extracted and displayed

### Approver Extraction
- Reads rule names from flags
- Maps to approver roles:
  - "delivery" → Head of Delivery
  - "product" → Head of Product
  - "legal" → General Counsel

### Evidence Requirements
- Checks for `REQUIRE_EVIDENCE` action
- Shows file upload only when needed
- Validates before allowing submit

## What's NOT Built Yet

❌ Real LLM integration (using keyword matching)  
❌ Semantic rule evaluation (placeholder message)  
❌ Actual approval flow (Phase 4)  
❌ Email notifications to approvers  
❌ Workflow editing after creation  
❌ Evidence pack PDF download (Phase 5)  
❌ Multiple policy selection  
❌ Workflow templates  

These are for production or future phases.

## Ready for Phase 4?

Once you've:
- ✓ Logged in as operator@demo.com
- ✓ Created a workflow with sample data
- ✓ Seen AI classification
- ✓ Seen AI drafting with policy flags
- ✓ Uploaded evidence
- ✓ Submitted for approval
- ✓ Viewed workflow detail with flags

You're ready to build **Phase 4: Approval Inbox + Evidence Sealing** where Approvers will review and approve the flagged items.

---

**Phase 3 Complete! Workflows are being created with policy-based governance.**

Next: Read `NEXT-STEPS.md` and paste **Prompt 4** to build the Approval system.

**Aletheia — Confidential**
