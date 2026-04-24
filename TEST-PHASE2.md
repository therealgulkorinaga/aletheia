# Test Phase 2 — Policy Manager

## Quick Test (2 minutes)

### 1. Login as Admin
- Open http://localhost:3000
- Click **Sign In**
- Click **ADMIN** button
- Click **Sign In**

### 2. Go to Policies
- Click **Policies** in sidebar
- See table with 1 policy: "RFP Response Authority Policy"
- Status: ACTIVE (green badge)
- Rule Count: 3

### 3. Edit Policy
- Click **Edit** button
- See policy editor with two columns

**Left column (Metadata):**
- Name: RFP Response Authority Policy
- Version: v1
- Status: Active
- Effective From: 2026-01-01
- Rules: 3

**Right column (Rules):**
- 3 rule cards visible
- Each shows name, severity, action badges
- Click to expand each rule

### 4. Test Policy
Scroll to bottom "Test Policy" panel

**Copy this text:**
```
Our platform provides 99.95% uptime backed by a full SLA with financial credits. We are SOC 2 Type II certified and will deliver custom workflows by Q3 2026.
```

**Paste into textarea**

**Click "Run Policy Check"**

**Expected Results:**
- 3 results shown
- Rule 1 (SLA commitments): MATCHED ✓
  - Patterns: 99.95%, uptime, SLA
- Rule 2 (Future roadmap): Shows semantic placeholder
- Rule 3 (Compliance certification): MATCHED ✓
  - Patterns: SOC 2, certified

### 5. Create New Policy
- Click **Cancel** to go back to list
- Click **New Policy**
- Enter:
  - Name: Customer Data Policy
  - Version: v1
  - Status: DRAFT
- Click **Add Rule**
- Expand the rule
- Fill in:
  - Name: PII requires approval
  - Severity: HIGH
  - Action: REQUIRE_APPROVAL
  - Patterns (one per line):
    ```
    SSN
    credit card
    social security
    ```
- Click **Save**

### 6. Verify
- Go back to policy list
- See 2 policies now
- New policy shows:
  - Status: DRAFT (gray)
  - Rule Count: 1

---

## Full Test (5 minutes)

### Test All Rule Actions

Create a comprehensive test policy:

1. **Click New Policy**
2. **Name:** "Comprehensive Test Policy"
3. **Add 5 rules:**

**Rule 1: ALLOW**
- Name: Standard marketing content
- Severity: LOW
- Action: ALLOW
- Patterns: marketing, branding, logo

**Rule 2: REQUIRE_APPROVAL**
- Name: Financial commitments
- Severity: HIGH
- Action: REQUIRE_APPROVAL
- Patterns: price, discount, refund
- Approver: head_of_finance

**Rule 3: REQUIRE_EVIDENCE**
- Name: Security claims
- Severity: HIGH
- Action: REQUIRE_EVIDENCE
- Patterns: encrypted, secure, penetration test
- Evidence Type: security_audit

**Rule 4: BLOCK**
- Name: Prohibited content
- Severity: CRITICAL
- Action: BLOCK
- Patterns: guarantee, warranty, insured

**Rule 5: ESCALATE**
- Name: Legal review needed
- Severity: CRITICAL
- Action: ESCALATE
- Patterns: liability, indemnify, breach

4. **Save** policy
5. **Test with:**
```
We offer a 50% discount with encrypted data storage and guarantee 100% uptime. We indemnify customers against data breaches.
```

6. **Expected:** All 5 rules should fire

---

## Edge Cases

### Empty Patterns
- Create rule with no patterns
- Should save without error
- Test should not match anything

### Multiple Approvers
- Create rule with comma-separated roles: "legal, finance, executive"
- Should save as array

### Semantic Only
- Create rule with only semantic trigger (no patterns)
- Should show "would require LLM evaluation"

### Special Characters
- Add pattern: "99.9%"
- Test with: "99.9% uptime"
- Should match

### Case Insensitive
- Add pattern: "GDPR"
- Test with: "gdpr compliant"
- Should match (case-insensitive)

---

## Visual Checks

### Status Colors
- DRAFT = Gray
- ACTIVE = Green
- RETIRED = Red

### Severity Colors
- LOW = Blue
- MEDIUM = Yellow
- HIGH = Orange
- CRITICAL = Red

### Action Colors
- ALLOW = Green
- REQUIRE_APPROVAL = Amber
- REQUIRE_EVIDENCE = Blue
- BLOCK = Red
- ESCALATE = Purple

---

## Bugs to Watch For

### ❌ Policy not appearing in list
- Check browser console for API errors
- Verify admin logged in
- Hard refresh (Cmd+Shift+R)

### ❌ Test not working
- Save policy before testing
- Check policy ID in URL (not "new")
- Verify patterns are entered (one per line)

### ❌ Rules not expanding
- Check for JavaScript errors in console
- Try clicking the rule header area
- Refresh page

### ❌ Save button not working
- Fill in all required fields (name, version)
- Check console for validation errors
- Wait for "Saving..." to finish

---

## Success Criteria

Phase 2 is working if:
- ✓ Can view policy list
- ✓ Can create new policy
- ✓ Can add/edit/delete rules
- ✓ Can test policy against sample text
- ✓ Patterns match correctly (case-insensitive)
- ✓ Results show matched patterns
- ✓ Color coding is correct
- ✓ Can save and activate policies

---

**If all tests pass, Phase 2 is complete!**

Next: Build Phase 3 (RFP Workflow)

**Aletheia — Confidential**
