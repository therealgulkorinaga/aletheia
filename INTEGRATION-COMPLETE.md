# Phase 3 → Phase 4 Integration Complete ✅

## What Was Missing

Workflows submitted in Phase 3 did not automatically create approval records, so the approval inbox stayed empty.

## What's Now Working

### Automatic Approval Creation

When a workflow is submitted:

1. **Policy flags are checked** — During drafting (Step 3), questions are checked against active policy
2. **Flags requiring approval identified** — Any flags with `action: "REQUIRE_APPROVAL"` are detected
3. **Approval records auto-created** — For each flag, an `Approval` record is created with:
   - `workflow_step_id` — The drafting step
   - `question_id` — The specific question
   - `approver_role` — Extracted from rule name (head_of_delivery, head_of_product, general_counsel)
   - `policy_rule_id` — The rule that triggered
   - `severity` — HIGH/MEDIUM/LOW
   - `decision` — PENDING

4. **Ledger entries created** — Two entries:
   - `WORKFLOW_CREATED` — When workflow is submitted
   - `AUTHORITY_CHECK_PERFORMED` — For each approval created

5. **Workflow status set correctly** — Status is `APPROVALS_PENDING` if approvals needed, otherwise `APPROVED`

### Enhanced Approval Inbox

**Inbox Cards Now Show:**
- Real workflow subject (not hardcoded)
- Real rule name from policy flag
- Dynamic severity badge (HIGH/MEDIUM/LOW)
- Actual submission date

**Review Detail Now Shows:**
- Workflow subject at top
- Real question text
- Real drafted answer
- All policy flags for that question (with severity + matched patterns)
- Evidence status

### Approval → Workflow Status Update

When an approval is granted:
1. Check if all approvals for that workflow are complete
2. If yes, automatically update workflow status to `APPROVED`
3. Workflow then shows "Download Evidence Pack" button

## Testing the Full Flow

### End-to-End Test (10 minutes)

**Step 1: Create Workflow** (as Operator)
```
Login: operator@demo.com / password123
Go to: New Workflow
Subject: "Acme Corp RFP Response"
Paste questions:
  - What is your SLA commitment?
  - Are you SOC 2 certified?
  - What is your product roadmap?
Click Next → AI classifies (HIGH/MEDIUM/LOW)
Click Next → AI drafts + policy checks
  ✓ Should see policy flags inline (amber boxes)
Click Next → Evidence (skip if not required)
Click Next → Submit
  ✓ Shows "Required Approvers: Head of Delivery"
Click Submit
```

**Step 2: Check Approval Inbox** (as Approver)
```
Logout → Login: approver@demo.com / password123
Go to: Approval Inbox
  ✓ Should see approval card with:
    - Workflow: "Acme Corp RFP Response"
    - Rule: "SLA commitments require delivery approval"
    - Severity: HIGH
Click card to review
  ✓ See actual question + drafted answer
  ✓ See policy flag details
Enter comment (optional for approve)
Click "Approve"
  ✓ Alert: "Decision recorded: APPROVED"
  ✓ Returns to inbox (now empty)
```

**Step 3: Verify Workflow Status** (as Operator or Compliance)
```
Go to: Workflows
  ✓ Workflow status changed to "APPROVED"
Click workflow
  ✓ "Download Evidence Pack" button appears
Click button
  ✓ PDF downloads with all workflow data
```

**Step 4: Check Dashboard** (as any user)
```
Go to: Dashboard
  ✓ Metrics updated:
    - Workflows this month: 1
    - Pending approvals: 0
    - Exceptions: 1 (if HIGH severity was approved)
  ✓ Recent events shows:
    - WORKFLOW_CREATED
    - AUTHORITY_CHECK_PERFORMED
    - APPROVAL_GRANTED
```

**Step 5: Generate Committee Report**
```
Click "Generate Committee Report"
  ✓ PDF downloads
  ✓ Shows workflow in table
  ✓ Shows exception if HIGH severity
  ✓ Chain integrity: VALID ✓
```

## Key Changes Made

### 1. Updated Types (`lib/types/workflow.ts`)
```typescript
export interface Approval {
  // ... existing fields
  question_id?: string
  policy_rule_id?: string
  severity?: string
  decided_by?: string
}

export interface Workflow {
  // ... existing fields
  created_by: string  // was: initiated_by
  completed_at?: string
  questions?: RFPQuestion[]
}
```

### 2. Enhanced Workflow Creation (`lib/mock-data/workflows.ts`)
```typescript
export function createWorkflow(workflow) {
  // ... create workflow
  
  // Create WORKFLOW_CREATED ledger entry
  createLedgerEntry('WORKFLOW_CREATED', {...}, workflowId)
  
  // Auto-create approvals from policy flags
  const draftingStep = workflow.steps.find(s => s.type === 'DRAFTING')
  draftingStep.output.drafts.forEach(question => {
    question.flags
      .filter(f => f.action === 'REQUIRE_APPROVAL')
      .forEach(flag => {
        // Create approval record
        createApproval({
          workflow_step_id: draftingStep.id,
          question_id: question.id,
          approver_role: extractRoleFromRuleName(flag.ruleName),
          decision: 'PENDING',
          policy_rule_id: flag.ruleId,
          severity: flag.severity,
        })
        
        // Create AUTHORITY_CHECK ledger entry
        createLedgerEntry('AUTHORITY_CHECK_PERFORMED', {...}, workflowId)
      })
  })
  
  return workflow
}
```

### 3. Enhanced Approval Page (`app/approvals/page.tsx`)
```typescript
// Fetch both approvals AND workflows
const fetchApprovals = async () => {
  const approvals = await fetch('/api/approvals?role=...')
  const workflows = await fetch('/api/workflows')
  setApprovals(approvals)
  setWorkflows(workflows)
}

// Helper to find workflow + question for approval
const getWorkflowForApproval = (approval) => {
  return workflows.find(w => 
    w.steps.some(s => s.id === approval.workflow_step_id)
  )
}

const getQuestionForApproval = (approval) => {
  const workflow = getWorkflowForApproval(approval)
  return workflow?.questions?.find(q => q.id === approval.question_id)
}

// Update workflow status when all approvals complete
const handleDecision = async (decision) => {
  await updateApproval(...)
  
  if (decision === 'APPROVED') {
    const allApproved = checkAllApprovalsComplete()
    if (allApproved) {
      await updateWorkflow({ status: 'APPROVED' })
    }
  }
}
```

### 4. Workflow Wizard (`app/workflows/new/page.tsx`)
```typescript
const handleSubmit = async () => {
  const needsApproval = questions.some(q =>
    q.flags.some(f => f.action === 'REQUIRE_APPROVAL')
  )
  
  const workflow = {
    status: needsApproval ? 'APPROVALS_PENDING' : 'APPROVED',
    questions,  // Store questions on workflow
    steps: [
      { /* ... */ completed_at: new Date().toISOString() },
      // ... all steps
    ]
  }
  
  await fetch('/api/workflows', { method: 'POST', body: workflow })
}
```

## What's Now Complete

- ✅ Full end-to-end flow (create → approve → download)
- ✅ Automatic approval creation from policy flags
- ✅ Real data in approval inbox
- ✅ Real question/answer display in review
- ✅ Workflow status updates after approval
- ✅ Ledger entries created at each step
- ✅ Dashboard metrics reflect real activity
- ✅ Evidence Pack downloads with real data
- ✅ Committee Report includes real workflows

## Files Modified

```
lib/
├── types/workflow.ts               # Updated Approval + Workflow types
└── mock-data/
    └── workflows.ts                # Auto-create approvals + ledger entries

app/
├── workflows/new/page.tsx          # Store questions, set correct status
└── approvals/page.tsx              # Fetch workflows, display real data
```

## Known Limitations

1. **Role extraction is simple:** Approver role extracted by keyword matching on rule name. Production would have explicit role field in policy rules.

2. **Single approver per flag:** Each flag creates one approval. Production might need multiple approvers (e.g., 2 of 3).

3. **No notification:** Approvers must check inbox manually. Production would send email/Slack notifications.

4. **All approvals must be granted:** If any approval is rejected, workflow status doesn't update. Production would need rejection handling (send back, escalate, etc.).

## Next Steps (Optional)

**For better demo:**
- Add email notifications (mock with console.log)
- Add approval delegation
- Add approval history view
- Show approval count on sidebar badge

**For production:**
- Replace role extraction with explicit policy fields
- Add multi-signature approvals
- Add approval rejection workflow
- Add approval escalation
- Add real-time notifications
- Add approval SLA tracking

---

**Integration Complete! Full flow works end-to-end.**

Test the complete flow now: Create workflow → See it in approval inbox → Approve → Download Evidence Pack → Generate Committee Report.

**Aletheia — Confidential**
