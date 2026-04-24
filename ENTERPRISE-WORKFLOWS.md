# Enterprise Workflow Library

## 12 Real-World Governance Workflows

Based on common workflows in large European organizations (banks, insurance, pharma, government contractors).

---

## How to Load

**Dashboard → Click "🏢 Load Enterprise Data (12)"**

This loads 12 workflows covering different use cases, teams, and approval scenarios.

---

## Workflow Catalog

### 1. Marketing Approval — Customer-Facing Campaign

**Workflow:** Q2 Digital Banking Campaign - Instagram Ads  
**Status:** APPROVALS_PENDING (2 pending approvals)  
**Teams:** Marketing, Legal, Compliance

**Questions:**
1. **Headline claim:** "Get approved in minutes! 99.9% of customers approved instantly..."
   - **Flag:** Financial promotions require legal approval (HIGH)
   - **Patterns:** approved, credit, 99.9%, instantly
   - **Why:** Time claims + approval rates in financial advertising

2. **Sustainability message:** "We are carbon neutral and committed to net zero by 2030"
   - **Flag:** ESG claims require sustainability team approval (MEDIUM)
   - **Patterns:** carbon neutral, net zero
   - **Why:** Environmental claims require evidence

**Use Case:** Marketing wants to run ads. AI drafts copy. Policy flags risky claims. Legal + Sustainability approve before launch.

---

### 2. Deal Desk — Pricing Exception

**Workflow:** Deutsche Bank Enterprise License - Pricing Exception  
**Status:** APPROVED  
**Teams:** Sales, Finance, Legal, RevOps

**Question:**
- **Discount offer:** "35% discount off list price for 3-year commitment..."
  - **Flag:** Discounts >30% require CFO approval (HIGH)
  - **Patterns:** 35%, discount
  - **Why:** Pricing exceptions exceed delegation authority
  - **Approved by:** CFO with comment "Strategic account with strong expansion potential"

**Use Case:** Sales negotiates large deal. Discount exceeds threshold. AI drafts terms. CFO must approve exceptional pricing.

---

### 3. Vendor Onboarding — Third-Party Due Diligence

**Workflow:** New Cloud Provider - AWS Additional Services  
**Status:** DISPATCHED  
**Teams:** Procurement, Legal, Risk, Security, Data Protection

**Question:**
- **Data processing:** "AWS will process customer transaction data, PII, and payment information..."
  - **Flag:** PII processing requires DPO approval (HIGH)
  - **Patterns:** PII, payment information, customer
  - **Why:** Third-party processing of sensitive customer data
  - **Approved by:** DPO with comment "Subject to DPA amendment and BCR coverage"
  - **Dispatched:** Email + CRM notification sent

**Use Case:** Procurement onboards new vendor. AI checks data sharing. DPO approves with conditions. Evidence sealed.

---

### 4. AI Use-Case Approval — New AI System

**Workflow:** AI Chatbot Deployment - Customer Service Portal  
**Status:** APPROVALS_PENDING (2 pending approvals)  
**Teams:** AI Office, Legal, Risk, Compliance, Security, Product

**Questions:**
1. **AI model:** "We will use GPT-4 via Azure OpenAI for customer support..."
   - **Flag 1:** AI systems handling customer data require AI Office approval (HIGH)
   - **Flag 2:** PII processing requires DPO approval (HIGH)
   - **Patterns:** GPT-4, customer, account balance, transaction
   - **Why:** AI processing customer personal data with account access

2. **Safeguards:** Output filtering, human oversight, audit logging

**Use Case:** Product team wants AI chatbot. AI Office + DPO must approve before deployment. Dual approval required.

---

### 5. Data Protection Impact Assessment (DPIA)

**Workflow:** DPIA - New Credit Scoring Algorithm  
**Status:** APPROVALS_PENDING  
**Teams:** DPO, Legal, Product, Engineering, Security

**Question:**
- **Personal data:** "Credit history, income data, employment status, address history, bank statements..."
  - **Flag:** PII processing requires DPO approval (HIGH)
  - **Patterns:** credit history, income data, employment, bank statements
  - **Why:** Automated decision-making with special category data (GDPR Article 22)

**Use Case:** New algorithm processes sensitive financial data. DPIA required before launch. DPO reviews for GDPR compliance.

---

### 6. Customer Complaint — Regulated Response

**Workflow:** FCA Complaint #2024-0892 - Account Closure  
**Status:** BLOCKED (Rejected)  
**Teams:** Customer Support, Legal, Compliance, Operations

**Question:**
- **Discrimination allegation:** "Our decision was based solely on credit risk factors... We deny any discrimination"
  - **Flag:** Regulatory complaints require General Counsel approval (HIGH)
  - **Patterns:** discrimination, deny, regulations
  - **Why:** Legal exposure in regulated complaint
  - **REJECTED by:** General Counsel — "This language creates unnecessary litigation risk. Use approved template."

**Use Case:** Customer files FCA complaint. AI drafts response. Legal rejects defensive language. Requires revision.

---

### 7. ESG Claims — Sustainability Report

**Workflow:** Annual Sustainability Report - Net Zero Commitment  
**Status:** DISPATCHED  
**Teams:** Sustainability, Legal, Compliance, Marketing, Finance, Investor Relations

**Question:**
- **Emissions progress:** "40% reduction in Scope 1 and 2 emissions since 2020..."
  - **Flag:** ESG claims require sustainability team approval (MEDIUM)
  - **Patterns:** emissions reduction, net zero, 40%
  - **Why:** Quantified environmental claim requires evidence
  - **Approved by:** Sustainability Director — "Verified against audited emissions data"
  - **Dispatched:** Sent to investors

**Use Case:** Annual report includes climate claims. AI drafts text. Sustainability team verifies data. Report published.

---

### 8. Product Launch — New Financial Feature

**Workflow:** Product Launch - Buy Now Pay Later (BNPL) Feature  
**Status:** APPROVED  
**Teams:** Product, Legal, Compliance, Risk, Security, Marketing

**Question:**
- **Consumer credit disclosures:** "Customers will see APR, total cost of credit, repayment schedule..."
  - **Flag:** Consumer credit products require FCA compliance approval (HIGH)
  - **Patterns:** APR, credit, Consumer Credit Act
  - **Why:** Regulated consumer credit product
  - **Approved by:** Head of Compliance — "All FCA requirements met"

**Use Case:** New BNPL feature requires regulatory compliance. AI drafts disclosures. Compliance approves before launch.

---

### 9. Regulatory Filing — Supervisory Response

**Workflow:** ECB Supervisory Request - Capital Adequacy Assessment  
**Status:** APPROVALS_PENDING  
**Teams:** Compliance, Legal, Risk, Finance, Board

**Question:**
- **Capital ratio:** "Our CET1 ratio is currently 14.2%, exceeding regulatory minimum..."
  - **Flag:** Supervisory responses require Board approval (HIGH)
  - **Patterns:** CET1, capital ratio, regulatory
  - **Why:** Formal regulatory response with financial data

**Use Case:** ECB asks for capital data. AI drafts response. Board must approve before submitting to regulator.

---

### 10. Incident Response — Data Breach Notification

**Workflow:** Security Incident #2024-03 - Customer Data Exposure  
**Status:** DISPATCHED  
**Teams:** Security, Legal, DPO, Communications, Risk, Board

**Questions:**
1. **ICO notification:** "15,000 customer email addresses exposed... requires notification under GDPR Article 33"
   - **Flag:** Data breach notifications require DPO and General Counsel approval (HIGH)
   - **Patterns:** personal data breach, GDPR, notification, exposed
   - **Approved by:** DPO — "Approved for immediate ICO notification"
   - **Dispatched:** Sent to ICO

2. **Customer communication:** "Notify affected customers within 48 hours..."
   - **Flag:** Crisis communications require Executive approval (HIGH)
   - **Patterns:** notify, customers, exposure
   - **Approved by:** CEO — "Use approved incident response template"
   - **Dispatched:** Email + Slack notification

**Outcome:** ICO acknowledged receipt. Investigation ongoing.

**Use Case:** Security breach detected. Fast approval needed. DPO + CEO approve within hours. Notifications sent. Evidence preserved.

---

### 11. Employment Decision — Senior Hire

**Workflow:** Senior Hire - Chief Data Officer Offer Letter  
**Status:** APPROVED  
**Teams:** HR, Legal, Finance, Executive Team

**Question:**
- **Compensation:** "Base salary £280,000, 40% bonus target, £150,000 sign-on, equity..."
  - **Flag:** Executive compensation requires Remuneration Committee approval (HIGH)
  - **Patterns:** £280,000, equity, RSUs
  - **Why:** Executive compensation exceeds delegation threshold
  - **Approved by:** Remuneration Committee Chair — "Within budget for this role"

**Use Case:** HR prepares executive offer. AI drafts compensation. Rem Committee approves before extending offer.

---

### 12. Material Change — Customer Notice

**Workflow:** Customer Notice - Subscription Price Increase 2024  
**Status:** DISPATCHED  
**Teams:** Product, Legal, Customer Success, Operations, Marketing

**Question:**
- **Price increase:** "15% price increase... 60 days advance notice... loyalty discount for annual commitments"
  - **Flag:** Material customer changes require Legal and Product approval (MEDIUM)
  - **Patterns:** price increase, notify customers, 15%
  - **Why:** Material contract change requiring customer consent
  - **Approved by:** Head of Product — "Ensure notice period complies with contract terms"
  - **Dispatched:** Email + CRM update sent to customers

**Use Case:** Price increase planned. AI drafts customer notice. Legal + Product approve timing and wording. Email sent.

---

## Key Patterns Across Workflows

### High-Risk Triggers
- **Financial claims:** Approval rates, SLAs, pricing, discounts
- **Personal data:** PII, special categories, cross-border transfers
- **Regulatory:** Compliance filings, supervisory responses, breach notifications
- **Legal:** Complaints, litigation, discrimination, liability
- **Executive:** Compensation, board matters, strategic decisions

### Common Approvers
- **General Counsel** — Legal risk, litigation, regulatory
- **DPO** — Data protection, privacy, GDPR
- **CFO** — Pricing exceptions, financial commitments
- **CEO** — Crisis communications, strategic decisions
- **Compliance Officer** — Regulatory products, filings
- **AI Office** — AI systems, model deployment
- **Sustainability Director** — ESG claims, climate commitments
- **Remuneration Committee** — Executive compensation
- **Board** — Capital, supervisory responses, material decisions

### Approval Outcomes
- **5 pending** — Awaiting decision
- **4 approved** — Granted and ready for action
- **4 dispatched** — Sent/executed with evidence sealed
- **1 rejected** — Blocked due to legal risk

---

## What Each Role Sees

### Operator (Create + Dispatch)
- Can see all 12 workflows
- Can dispatch approved workflows (4 ready)
- Track deliveries in Execution dashboard

### Approver (Head of Delivery)
- Will see **5 pending approvals** requiring decision
- Marketing claim, AI chatbot, DPIA, Regulatory filing, others
- Can approve/reject with comments

### Compliance
- Can audit all workflows
- See 12 workflows across different compliance areas
- Verify chain integrity (20+ ledger entries)
- Generate committee report

### Admin
- Can view all workflows
- See policy effectiveness
- Review approval patterns
- Configure integrations

---

## Testing Scenarios

### Scenario 1: Multi-Approval Workflow
**AI Chatbot** requires 2 approvals (AI Office + DPO)
1. Login as approver
2. See chatbot in inbox
3. Approve as AI Office
4. Still shows in inbox (needs DPO too)
5. Logout → Login as DPO
6. Approve
7. Workflow status → APPROVED

### Scenario 2: Rejection + Revision
**Customer Complaint** was rejected by General Counsel
1. View complaint workflow
2. See rejection comment
3. Status: BLOCKED
4. Create new workflow with revised language
5. Submit for re-approval

### Scenario 3: Urgent Incident
**Data Breach** has 2 approvals granted quickly
1. View incident workflow
2. See both approvals (DPO + CEO) within hours
3. Status: DISPATCHED
4. Check Execution → See ICO notification sent
5. Check Ledger → See all entries timestamped

### Scenario 4: Complex Deal
**Deutsche Bank** pricing exception
1. View deal workflow
2. See CFO approval comment
3. Status: APPROVED
4. Can dispatch contract
5. Record outcome: Won/Lost + contract value

---

## Business Metrics

From these 12 workflows, dashboard shows:

**Workflows this month:** 12  
**Pending approvals:** 5  
**Exceptions:** 3 (HIGH severity approvals granted)  
**Avg approval time:** Varies by urgency (incident: <2h, standard: 1-3 days)

**By Status:**
- APPROVALS_PENDING: 5
- APPROVED: 4
- DISPATCHED: 4
- BLOCKED: 1

**By Risk Level:**
- HIGH: 10 workflows
- MEDIUM: 2 workflows

**By Team:**
- Legal involved: 12/12 (100%)
- Compliance: 8/12
- Risk: 6/12
- Product: 5/12
- Finance: 4/12

---

## Why These 12?

These workflows represent:
1. **Financial services** (banking, credit, payments)
2. **Data protection** (GDPR, privacy, DPIAs)
3. **Regulatory** (FCA, ECB, ICO)
4. **Marketing** (claims, sustainability)
5. **Procurement** (vendors, contracts)
6. **Product** (launches, changes)
7. **HR** (executive hires, compensation)
8. **Security** (incidents, breaches)
9. **AI governance** (use-cases, risk assessment)
10. **Crisis** (complaints, communications)

They cover the most common **high-stakes decisions** where:
- AI can help draft
- Humans must approve
- Evidence must be preserved
- Regulators might ask questions

---

## Compare to Demo Data

| Feature | Demo Data (5) | Enterprise Data (12) |
|---------|--------------|---------------------|
| Workflows | 5 basic RFP responses | 12 diverse use cases |
| Use cases | Single type (RFP) | 12 different scenarios |
| Teams | Sales, delivery, legal | 15+ different teams |
| Approvers | 1 type (Head of Delivery) | 10 different roles |
| Complexity | Simple | Multi-approval, rejections, incidents |
| Outcomes | 1 won deal | Incident, hire, breach, etc. |
| Purpose | Quick demo | Realistic enterprise |

---

## Production Enhancements

To use in real organization:

### 1. Custom Workflows
- Add your specific use cases
- Map to your approval hierarchy
- Configure your policy rules

### 2. Real Approvers
- Sync with AD/Okta for user roles
- Delegate authority by seniority
- Escalation paths

### 3. Integration
- Connect to your CRM (Salesforce, HubSpot)
- Link to your ticketing (Jira, ServiceNow)
- Push to your comms (Slack, Teams)

### 4. Templates
- Pre-approved language for common scenarios
- Response templates by workflow type
- Auto-populate from past approvals

### 5. Analytics
- Time-to-approval by workflow type
- Bottleneck identification
- Win rates by approval path
- Risk scoring trends

---

## Load It Now

**Dashboard → Click "🏢 Load Enterprise Data (12)"**

Then explore:
- **Workflows list** → See 12 diverse workflows
- **Approval Inbox** → 5 pending decisions
- **Execution** → 4 dispatched workflows with tracking
- **Ledger** → 20+ entries across all workflows
- **Committee Report** → PDF with all 12 workflows

**Aletheia — Real governance for real organizations.**
