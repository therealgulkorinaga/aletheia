# Aletheia Demo Guide

## Quick Start

1. **Visit:** http://localhost:3000
2. **Load Demo Data:** Click "🌱 Load Demo Data" button on dashboard (appears when empty)
3. **Explore all 4 roles** using the credentials below

---

## Demo Credentials

### 1. Operator (Sarah Chen)
**Email:** operator@demo.com  
**Password:** password123  
**Department:** Sales Operations

### 2. Approver (Michael Roberts)
**Email:** approver@demo.com  
**Password:** password123  
**Role:** Head of Delivery

### 3. Compliance (Emma Thompson)
**Email:** compliance@demo.com  
**Password:** password123  
**Department:** Legal & Compliance

### 4. Admin (James Wilson)
**Email:** admin@demo.com  
**Password:** password123  
**Role:** Chief Risk Officer

---

## What Each Role Sees

### 👤 Operator Role

**Purpose:** Create and submit RFP responses through governed AI workflows

**Navigation:**
- Dashboard
- Workflows (list)
- New Workflow (wizard)

**Demo Workflow to Explore:**
1. Go to **Workflows** → See 5 workflows in various states:
   - ✅ Barclays Digital Banking RFP (DISPATCHED)
   - ⏳ HSBC Wealth Management (APPROVALS_PENDING)
   - ⏳ Lloyds Corporate Banking (APPROVALS_PENDING)
   - ❌ NatWest Payment Gateway (BLOCKED - rejected)
   - ✓ Santander API Integration (APPROVED)

2. Click **Barclays Digital Banking RFP** → See completed workflow:
   - Timeline showing all steps
   - Questions with drafted answers
   - Policy flags (SLA commitment flagged)
   - Approval granted by Head of Delivery
   - "Download Evidence Pack" button

3. Try **New Workflow** → Create your own:
   ```
   Subject: Test RFP Response
   
   Questions (paste these):
   What is your platform uptime guarantee?
   Do you provide SOC 2 certification?
   Can you deliver custom features by Q2 2026?
   ```
   - Step through the wizard
   - See AI classify risk (HIGH/MEDIUM/LOW)
   - See AI draft answers
   - See policy flags appear automatically
   - Submit → Creates approval automatically

**Key Feature:** Policy-as-code enforcement. AI drafts trigger rule checks in real-time.

---

### 👤 Approver Role

**Purpose:** Review flagged responses and grant/reject approvals

**Navigation:**
- Dashboard
- Approval Inbox

**Demo Workflow:**
1. Go to **Approval Inbox** → See 2 pending approvals:
   - HSBC Wealth Management (roadmap commitment)
   - Lloyds Corporate Banking (SLA commitment)

2. Click **HSBC Wealth Management** card → Review page shows:
   - **Workflow:** Full context
   - **Question:** "What features are on your product roadmap for Q3 2026?"
   - **Drafted Answer:** "Yes, custom workflow builders are on our Q3 roadmap..."
   - **Policy Flag:** "Product roadmap commitments require delivery approval"
   - **Severity:** HIGH
   - **Matched Patterns:** roadmap, Q3, delivered

3. **Make Decision:**
   - Enter comment (optional for approve, required for reject)
   - Click "Approve" → Approval granted
   - Returns to inbox → Card disappears
   - Workflow status changes to APPROVED

4. **Try Rejecting:**
   - Click **Lloyds Corporate Banking** card
   - Enter comment: "Our infrastructure only supports 99.9%. Please revise."
   - Click "Reject" → Workflow status becomes BLOCKED

**Key Feature:** Human-in-the-loop governance. Every high-risk commitment requires approval.

---

### 👤 Compliance Role

**Purpose:** Audit all workflows and verify cryptographic integrity

**Navigation:**
- Dashboard
- Workflows (read-only)
- Ledger (audit trail)
- Reports

**Demo Workflow:**
1. Go to **Dashboard** → See metrics:
   - Workflows this month: 5
   - Pending approvals: 2 (before you approve as Head of Delivery)
   - Exceptions: 1 (HIGH severity approval granted)
   - Avg approval time: ~2h

2. Go to **Workflows** → Browse all workflows:
   - Filter by status
   - See approval progress
   - Click any workflow → View details

3. Go to **Ledger** → Immutable audit trail:
   - See 15+ entries across all workflows
   - Event types:
     - WORKFLOW_CREATED (blue)
     - AUTHORITY_CHECK_PERFORMED (purple)
     - APPROVAL_GRANTED (green)
     - APPROVAL_REJECTED (red)
     - EVIDENCE_SEALED (indigo)
   - Click "Show" on any entry → See:
     - Payload hash
     - Previous hash (chain link)
     - Chain hash
     - Full payload JSON

4. **Verify Chain Integrity:**
   - Click "Verify Chain Integrity" button
   - See ✓ VALID result
   - All hashes verified
   - All sequence numbers correct
   - No tampering detected

5. **Generate Committee Report:**
   - Go to Dashboard
   - Click "Generate Committee Report"
   - PDF downloads with:
     - Executive summary
     - All workflows table
     - Exceptions (HIGH severity approvals)
     - Chain integrity verification

**Key Feature:** Blockchain-style immutable audit. Every action creates a cryptographically linked ledger entry.

---

### 👤 Admin Role

**Purpose:** Manage policies, users, and governance rules

**Navigation:**
- Dashboard
- Policies (policy manager)
- Users (user management)
- Authorities (delegation rules)

**Demo Workflow:**
1. Go to **Policies** → See active policy:
   - **RFP Response Authority Policy v1**
   - Status: ACTIVE
   - 3 rules defined

2. Click **RFP Response Authority Policy v1** → Policy editor:
   - **Rule 1:** SLA commitments require delivery approval
     - Trigger: Pattern matching (SLA, uptime, availability, 99.%)
     - Severity: HIGH
     - Action: REQUIRE_APPROVAL
     - Approver: Head of Delivery
   
   - **Rule 2:** Product roadmap commitments
     - Trigger: roadmap, timeline, commit, deliver
     - Severity: HIGH
     - Action: REQUIRE_APPROVAL
     - Approver: Head of Delivery
   
   - **Rule 3:** Compliance certifications
     - Trigger: SOC, ISO, GDPR, certified
     - Severity: MEDIUM
     - Action: REQUIRE_EVIDENCE
     - Approver: General Counsel

3. **Test Policy:**
   - Scroll to "Test Policy" section
   - Paste test content:
     ```
     Our platform provides 99.95% uptime backed by a full SLA.
     We are SOC 2 Type II certified.
     Custom features will be on our Q3 roadmap.
     ```
   - Click "Test Policy"
   - See results:
     - ✓ Rule 1 matched (SLA, uptime, 99.95%)
     - ✓ Rule 3 matched (SOC, certified)
     - ✓ Rule 2 matched (roadmap, Q3)

4. **Edit Policy Rules:**
   - Click "Edit" on Rule 1
   - Add/remove patterns
   - Change severity
   - Click "Save Rule"
   - Policy updated immediately

**Key Feature:** Policy-as-code. Board authority becomes executable rules that govern AI actions.

---

## Seed Data Overview

The demo includes **5 workflows** representing different stages:

| Workflow | Status | Approval State | Purpose |
|----------|--------|----------------|---------|
| Barclays Digital Banking RFP | DISPATCHED | ✅ Approved | Completed end-to-end flow |
| HSBC Wealth Management | APPROVALS_PENDING | ⏳ Pending | Test approving |
| Lloyds Corporate Banking | APPROVALS_PENDING | ⏳ Pending | Test approving |
| NatWest Payment Gateway | BLOCKED | ❌ Rejected | See rejection flow |
| Santander API Integration | APPROVED | ✓ Auto-approved | No flags triggered |

**Ledger Entries:** 15+ events
- Workflow creations
- Authority checks
- Approval decisions
- Evidence sealing

**Approvals:**
- 2 pending (in inbox)
- 1 approved (Barclays)
- 1 rejected (NatWest)

---

## End-to-End Demo Flow

**Full Cycle (15 minutes):**

1. **Login as Operator** → Create new workflow with SLA question
2. **See policy flag appear** → "SLA commitments require delivery approval"
3. **Submit workflow** → Status: APPROVALS_PENDING
4. **Logout → Login as Approver** → See new approval in inbox
5. **Review and approve** → Enter comment, click Approve
6. **Logout → Login as Operator** → Workflow status: APPROVED
7. **Download Evidence Pack** → 6-page PDF with full audit trail
8. **Logout → Login as Compliance** → View ledger entries
9. **Verify chain integrity** → ✓ VALID
10. **Generate Committee Report** → 4-page PDF for board

---

## Key Concepts to Understand

### 1. Policy-as-Code
- Board policies become executable rules
- Rules have triggers (patterns), severity, actions
- AI drafts are automatically checked against active policies
- Matched rules create policy flags

### 2. Human-in-the-Loop
- AI drafts responses automatically
- High-risk commitments require human approval
- Approver sees full context (question, answer, policy, evidence)
- Approval/rejection creates immutable ledger entry

### 3. Cryptographic Evidence
- Every action creates a ledger entry
- Entries are chained using SHA-256 hashes
- Previous entry's hash is included in next entry
- Tampering breaks the chain (detectable via verification)

### 4. Role-Based Access
- Operators: Create workflows
- Approvers: Review and decide
- Compliance: Audit and verify
- Admins: Manage policies and rules

### 5. Audit Trail
- Ledger records ALL governance actions
- Blockchain-style chain verification
- Evidence packs capture point-in-time state
- Committee reports summarize activity

---

## What to Look For

### As Operator
- ✅ How quickly can I create a governed response?
- ✅ Do policy flags appear automatically?
- ✅ Is it clear what requires approval?

### As Approver
- ✅ Do I have enough context to make a decision?
- ✅ Can I see why this was flagged?
- ✅ Is the approval process fast?

### As Compliance
- ✅ Can I verify nothing was tampered with?
- ✅ Can I audit any workflow retroactively?
- ✅ Can I generate reports for the board?

### As Admin
- ✅ Can I update policies without code changes?
- ✅ Can I test rules before activating?
- ✅ Can I see which rules are being triggered?

---

## Common Questions

**Q: What happens if I reject an approval?**  
A: Workflow status becomes BLOCKED. Operator must revise and resubmit.

**Q: Can I edit a workflow after submission?**  
A: No. Workflows are immutable. Rejection requires creating a new workflow.

**Q: What if multiple approvers are required?**  
A: Currently one approver per rule. Multi-signature support is roadmapped.

**Q: Can policies be changed retroactively?**  
A: No. Ledger entries reference the policy version at decision time. Historical workflows remain governed by original rules.

**Q: How is the chain verified?**  
A: Each ledger entry contains:
1. Payload hash (SHA-256 of event data)
2. Previous hash (chain link)
3. Chain hash (SHA-256 of sequence + payload_hash + previous_hash)

Verification recomputes all hashes and checks links.

**Q: What's the difference between APPROVED and DISPATCHED?**  
- APPROVED: All approvals granted, ready to send
- DISPATCHED: Evidence sealed, workflow sent to customer

---

## Reset Demo Data

To clear all data and start fresh:
1. Restart the Next.js dev server
2. In-memory storage clears on restart
3. Click "🌱 Load Demo Data" again

---

## Next Steps

After exploring the demo:
- Review `PHASE5-COMPLETE.md` for technical details
- Review `INTEGRATION-COMPLETE.md` for approval flow
- Check policy rules in `/admin/policies`
- Generate Evidence Pack PDF from Barclays workflow
- Generate Committee Report from Dashboard

---

**Built with:**
- Next.js 16 + TypeScript
- Tailwind CSS + shadcn/ui
- @react-pdf/renderer
- Cryptographic hashing (SubtleCrypto Web API)
- In-memory mock storage

**For:** General Counsels, Chief Risk Officers, Company Secretaries at regulated enterprises (banks, financial institutions).

**Aletheia — Turn board authority into executable AI governance.**
