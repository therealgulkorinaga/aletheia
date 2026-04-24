# Next Steps: From Phase 1 → Phase 2

## You Are Here: Phase 1 Complete ✓

You now have:
- Landing page with professional authority
- Authentication with 4 role-based demo users
- Dashboard shell with sidebar navigation
- Proper design system (Crimson Pro + IBM Plex Sans + JetBrains Mono)

## Before Moving to Phase 2

### Checklist

- [ ] Supabase project created
- [ ] `supabase-setup.sql` executed successfully
- [ ] 4 demo users created in Supabase Auth
- [ ] User profiles inserted into `users` table
- [ ] `.env.local` configured with correct credentials
- [ ] `npm run dev` starts without errors
- [ ] Can login as operator@demo.com
- [ ] Can login as approver@demo.com
- [ ] Can login as compliance@demo.com
- [ ] Can login as admin@demo.com
- [ ] Each user sees different sidebar nav items
- [ ] Dashboard shows 4 metric cards

### Verify Setup

Run this in Supabase SQL Editor:

```bash
# See: scripts/verify-setup.sql
```

All checks should show `✓ PASS`.

---

## Phase 2: Policy Manager (Admin)

**What you'll build:**
- Policy list page (`/admin/policies`)
- Policy editor with rules management
- Rule cards with:
  - Name, severity, action, trigger patterns
  - JSON editor for each rule
- "Test Policy" panel with regex matching
- Seed one complete policy: "RFP Response Authority Policy v1"

**Database tables to add:**
```sql
policies (id, name, version, status, effective_from, rules_json, created_at)
```

**Timeline:** ~2 hours with AI coding assistant

**When ready:** Paste **Prompt 2** from your original spec.

---

## Phase 3: RFP Workflow (Operator)

**What you'll build:**
- 5-step workflow wizard (`/workflows/new`)
- Step 1: Ingest RFP questions
- Step 2: AI classification (stubbed with delays)
- Step 3: Drafted answers with policy flags
- Step 4: Evidence upload
- Step 5: Submit for approval
- Workflow detail page (`/workflows/[id]`)
- Workflow list page (`/workflows`)

**Database tables to add:**
```sql
workflows (id, type, status, subject, initiated_by, created_at, updated_at)
workflow_steps (id, workflow_id, sequence, name, type, status, output_json, created_at)
authority_checks (id, workflow_step_id, verdict, rules_triggered_json, created_at)
approvals (id, workflow_step_id, approver_role, approver_user_id, decision, comment, created_at)
```

**Timeline:** ~3 hours

**When ready:** Paste **Prompt 3**.

---

## Phase 4: Approval Inbox + Evidence Sealing

**What you'll build:**
- Approval inbox (`/approvals`)
- Approval detail view with decision panel
- Evidence sealing with SHA-256 hashing
- Ledger entries table and chain verification
- Ledger page (`/ledger`) with chain integrity check

**Database tables to add:**
```sql
evidence (id, workflow_id, type, content_hash, content_snapshot_json, created_at)
ledger_entries (id, sequence, event_type, workflow_id, payload_json, payload_hash, previous_hash, chain_hash, created_at)
```

**Timeline:** ~3 hours

**When ready:** Paste **Prompt 4**.

---

## Phase 5: Dashboard + Evidence Pack PDF

**What you'll build:**
- Real dashboard queries (replace stubbed metrics)
- Charts: workflows by status, rules triggered
- Recent activity feed from ledger
- Evidence Pack PDF generation (react-pdf)
- Committee Report PDF
- Enhanced landing page (already done, may refine)

**Dependencies:**
```bash
npm install @react-pdf/renderer
```

**Timeline:** ~2-3 hours

**When ready:** Paste **Prompt 5**.

---

## Development Tips

### When AI Makes Mistakes

Don't re-prompt the entire phase. Instead:

**Bad:**
> "The policy page isn't working, rebuild everything"

**Good:**
> "When I submit the workflow for Q1 about SLA, the policy check should fire Rule 1 because the answer contains '99.95%' and 'SLA'. Currently it returns no flags. Fix the regex matching in the authority check logic at line 47 of workflow-steps.ts."

Be specific: name the file, the function, the test case that fails.

### Testing as You Go

After each phase:
1. Login as the relevant role
2. Walk through the happy path
3. Test edge cases (empty inputs, long text, etc.)
4. Check the Supabase database to verify records are created

### When to Ask for Help

If you see:
- TypeScript errors you can't resolve
- Supabase RLS policy blocks
- Next.js routing issues
- Build errors

Paste the **exact error message** and the **file path** where it occurs.

---

## Estimated Total Timeline

- Phase 1: ✓ Complete (you are here)
- Phase 2: ~2 hours
- Phase 3: ~3 hours
- Phase 4: ~3 hours
- Phase 5: ~2-3 hours

**Total:** 10-11 hours of focused work with AI assistance.

**If working in 2-hour blocks:** 5-6 sessions to complete all phases.

---

## Final Product Features

After Phase 5, you'll have a working prototype with:
- ✓ 4 role-based user personas
- ✓ Policy-as-code with regex pattern matching
- ✓ RFP response workflow with AI classification
- ✓ Approval routing and decision tracking
- ✓ Cryptographic evidence sealing
- ✓ Blockchain-style ledger with chain verification
- ✓ PDF evidence packs for audits
- ✓ Committee report generation
- ✓ Real-time dashboard with charts

This is enough to:
- Demo to a General Counsel
- Pitch to a Chief Risk Officer
- Show in a board meeting
- Use as a basis for real implementation

---

## Ready?

If all checkboxes above are ✓, you're ready.

Open your AI coding assistant and paste **Prompt 2**.

Let's build the Policy Manager.

**Aletheia — Confidential**
