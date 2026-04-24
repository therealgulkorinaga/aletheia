import { createWorkflow, createApproval, updateApproval } from './workflows'
import { createLedgerEntry, sealEvidence } from './ledger'
import { dispatchWorkflow, recordOutcome } from './execution'

export async function seedEnterpriseWorkflows() {
  console.log('🌱 Seeding enterprise workflow data...')

  // 1. MARKETING APPROVAL - Customer-facing campaign
  const wf1 = createWorkflow({
    type: 'RFP_RESPONSE' as any,
    status: 'APPROVALS_PENDING',
    subject: 'Q2 Digital Banking Campaign - Instagram Ads',
    created_by: 'mock-operator-uuid',
    questions: [
      {
        id: 'q-mkt-1',
        question: 'What should our headline claim be?',
        risk: 'HIGH',
        draft: 'Get approved in minutes! 99.9% of customers approved instantly with our AI-powered credit decisioning.',
        flags: [
          {
            ruleId: 'rule-marketing-1',
            ruleName: 'Financial promotions require legal approval',
            severity: 'HIGH',
            action: 'REQUIRE_APPROVAL',
            matchedPatterns: ['approved', 'credit', '99.9%', 'instantly'],
            reason: 'Financial promotion with time claim and approval rate',
          },
        ],
      },
      {
        id: 'q-mkt-2',
        question: 'What sustainability message can we include?',
        risk: 'MEDIUM',
        draft: 'We are carbon neutral and committed to net zero by 2030.',
        flags: [
          {
            ruleId: 'rule-esg-1',
            ruleName: 'ESG claims require sustainability team approval',
            severity: 'MEDIUM',
            action: 'REQUIRE_APPROVAL',
            matchedPatterns: ['carbon neutral', 'net zero'],
            reason: 'Sustainability claim requires evidence',
          },
        ],
      },
    ],
    steps: [
      {
        id: 'step-1-mkt',
        workflow_id: '',
        sequence: 1,
        name: 'Draft Review',
        type: 'DRAFTING',
        status: 'COMPLETED',
        output: { drafts: [] },
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      },
    ],
  })

  // 2. CONTRACT NEGOTIATION - Deal desk approval
  const wf2 = createWorkflow({
    type: 'RFP_RESPONSE' as any,
    status: 'APPROVED',
    subject: 'Deutsche Bank Enterprise License - Pricing Exception',
    created_by: 'mock-operator-uuid',
    questions: [
      {
        id: 'q-deal-1',
        question: 'What discount can we offer for 3-year commitment?',
        risk: 'HIGH',
        draft: 'We can offer 35% discount off list price for a 3-year enterprise commitment with minimum 5,000 seats.',
        flags: [
          {
            ruleId: 'rule-pricing-1',
            ruleName: 'Discounts >30% require CFO approval',
            severity: 'HIGH',
            action: 'REQUIRE_APPROVAL',
            matchedPatterns: ['35%', 'discount'],
            reason: 'Pricing exception exceeds authority threshold',
          },
        ],
      },
    ],
    steps: [
      {
        id: 'step-1-deal',
        workflow_id: '',
        sequence: 1,
        name: 'Pricing Review',
        type: 'DRAFTING',
        status: 'COMPLETED',
        output: { drafts: [] },
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  })

  // Approve deal
  const approval2 = createApproval({
    workflow_step_id: 'step-1-deal',
    question_id: 'q-deal-1',
    approver_role: 'cfo',
    decision: 'APPROVED',
    policy_rule_id: 'rule-pricing-1',
    severity: 'HIGH',
    decided_by: 'CFO',
    decided_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    comment: 'Approved. Strategic account with strong expansion potential.',
  })

  // 3. VENDOR ONBOARDING - Third-party due diligence
  const wf3 = createWorkflow({
    type: 'RFP_RESPONSE' as any,
    status: 'DISPATCHED',
    subject: 'New Cloud Provider - AWS Additional Services',
    created_by: 'mock-operator-uuid',
    questions: [
      {
        id: 'q-vendor-1',
        question: 'What data will this vendor process?',
        risk: 'HIGH',
        draft: 'AWS will process customer transaction data, PII, and payment information for our analytics pipeline.',
        flags: [
          {
            ruleId: 'rule-data-1',
            ruleName: 'PII processing requires DPO approval',
            severity: 'HIGH',
            action: 'REQUIRE_APPROVAL',
            matchedPatterns: ['PII', 'payment information', 'customer'],
            reason: 'Third-party data processing of sensitive data',
          },
        ],
      },
    ],
    steps: [
      {
        id: 'step-1-vendor',
        workflow_id: '',
        sequence: 1,
        name: 'Due Diligence',
        type: 'DRAFTING',
        status: 'COMPLETED',
        output: { drafts: [] },
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  })

  // Approve and dispatch vendor
  const approval3 = createApproval({
    workflow_step_id: 'step-1-vendor',
    question_id: 'q-vendor-1',
    approver_role: 'dpo',
    decision: 'APPROVED',
    policy_rule_id: 'rule-data-1',
    severity: 'HIGH',
    decided_by: 'Data Protection Officer',
    decided_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    comment: 'Approved subject to DPA amendment and BCR coverage.',
  })

  await sealEvidence(wf3.id, { questions: wf3.questions })
  await dispatchWorkflow(wf3.id, ['EMAIL', 'CRM'], {
    recipient_email: 'procurement@company.com',
    crm_opportunity_id: 'VEN-AWS-2024',
  })

  // 4. AI USE-CASE APPROVAL - New AI system
  const wf4 = createWorkflow({
    type: 'RFP_RESPONSE' as any,
    status: 'APPROVALS_PENDING',
    subject: 'AI Chatbot Deployment - Customer Service Portal',
    created_by: 'mock-operator-uuid',
    questions: [
      {
        id: 'q-ai-1',
        question: 'What AI model will be used?',
        risk: 'HIGH',
        draft: 'We will use GPT-4 via Azure OpenAI to provide customer support responses, including account balance queries and transaction disputes.',
        flags: [
          {
            ruleId: 'rule-ai-1',
            ruleName: 'AI systems handling customer data require AI Office approval',
            severity: 'HIGH',
            action: 'REQUIRE_APPROVAL',
            matchedPatterns: ['GPT-4', 'customer', 'account balance'],
            reason: 'AI system with customer data access',
          },
          {
            ruleId: 'rule-data-1',
            ruleName: 'PII processing requires DPO approval',
            severity: 'HIGH',
            action: 'REQUIRE_APPROVAL',
            matchedPatterns: ['customer support', 'account balance', 'transaction'],
            reason: 'AI processing of customer personal data',
          },
        ],
      },
      {
        id: 'q-ai-2',
        question: 'What safeguards will be implemented?',
        risk: 'MEDIUM',
        draft: 'The system will include output filtering, human oversight for complex queries, and audit logging of all interactions.',
        flags: [],
      },
    ],
    steps: [
      {
        id: 'step-1-ai',
        workflow_id: '',
        sequence: 1,
        name: 'AI Risk Assessment',
        type: 'DRAFTING',
        status: 'COMPLETED',
        output: { drafts: [] },
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      },
    ],
  })

  // 5. DATA PROTECTION IMPACT ASSESSMENT
  const wf5 = createWorkflow({
    type: 'RFP_RESPONSE' as any,
    status: 'APPROVALS_PENDING',
    subject: 'DPIA - New Credit Scoring Algorithm',
    created_by: 'mock-operator-uuid',
    questions: [
      {
        id: 'q-dpia-1',
        question: 'What personal data will be processed?',
        risk: 'HIGH',
        draft: 'The algorithm will process credit history, income data, employment status, address history, and bank statements to generate credit scores.',
        flags: [
          {
            ruleId: 'rule-data-1',
            ruleName: 'PII processing requires DPO approval',
            severity: 'HIGH',
            action: 'REQUIRE_APPROVAL',
            matchedPatterns: ['credit history', 'income data', 'employment', 'bank statements'],
            reason: 'Automated decision-making with special category data',
          },
        ],
      },
    ],
    steps: [
      {
        id: 'step-1-dpia',
        workflow_id: '',
        sequence: 1,
        name: 'DPIA Review',
        type: 'DRAFTING',
        status: 'COMPLETED',
        output: { drafts: [] },
        created_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      },
    ],
  })

  // 6. CUSTOMER COMPLAINT - Regulated response
  const wf6 = createWorkflow({
    type: 'RFP_RESPONSE' as any,
    status: 'BLOCKED',
    subject: 'FCA Complaint #2024-0892 - Account Closure',
    created_by: 'mock-operator-uuid',
    questions: [
      {
        id: 'q-complaint-1',
        question: 'How should we respond to the allegation of discrimination?',
        risk: 'HIGH',
        draft: 'Our decision was based solely on credit risk factors and complied with all applicable regulations. We deny any discrimination.',
        flags: [
          {
            ruleId: 'rule-legal-1',
            ruleName: 'Regulatory complaints require General Counsel approval',
            severity: 'HIGH',
            action: 'REQUIRE_APPROVAL',
            matchedPatterns: ['discrimination', 'deny', 'regulations'],
            reason: 'Legal exposure in regulated complaint response',
          },
        ],
      },
    ],
    steps: [
      {
        id: 'step-1-complaint',
        workflow_id: '',
        sequence: 1,
        name: 'Legal Review',
        type: 'DRAFTING',
        status: 'COMPLETED',
        output: { drafts: [] },
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  })

  // Reject complaint response
  const approval6 = createApproval({
    workflow_step_id: 'step-1-complaint',
    question_id: 'q-complaint-1',
    approver_role: 'general_counsel',
    decision: 'REJECTED',
    policy_rule_id: 'rule-legal-1',
    severity: 'HIGH',
    decided_by: 'General Counsel',
    decided_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    comment: 'REJECTED. This language creates unnecessary litigation risk. Please use our approved complaint response template and focus on process, not denial.',
  })

  // 7. ESG CLAIMS - Sustainability report
  const wf7 = createWorkflow({
    type: 'RFP_RESPONSE' as any,
    status: 'DISPATCHED',
    subject: 'Annual Sustainability Report - Net Zero Commitment',
    created_by: 'mock-operator-uuid',
    questions: [
      {
        id: 'q-esg-1',
        question: 'What progress can we claim on emissions reduction?',
        risk: 'MEDIUM',
        draft: 'We have achieved a 40% reduction in Scope 1 and 2 emissions since 2020 and are on track to reach net zero by 2030.',
        flags: [
          {
            ruleId: 'rule-esg-1',
            ruleName: 'ESG claims require sustainability team approval',
            severity: 'MEDIUM',
            action: 'REQUIRE_APPROVAL',
            matchedPatterns: ['emissions reduction', 'net zero', '40%'],
            reason: 'Quantified environmental claim requires evidence',
          },
        ],
      },
    ],
    steps: [
      {
        id: 'step-1-esg',
        workflow_id: '',
        sequence: 1,
        name: 'Sustainability Review',
        type: 'DRAFTING',
        status: 'COMPLETED',
        output: { drafts: [] },
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  })

  // Approve and dispatch ESG
  const approval7 = createApproval({
    workflow_step_id: 'step-1-esg',
    question_id: 'q-esg-1',
    approver_role: 'sustainability_director',
    decision: 'APPROVED',
    policy_rule_id: 'rule-esg-1',
    severity: 'MEDIUM',
    decided_by: 'Sustainability Director',
    decided_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    comment: 'Approved. Verified against audited emissions data.',
  })

  await sealEvidence(wf7.id, { questions: wf7.questions })
  await dispatchWorkflow(wf7.id, ['EMAIL'], {
    recipient_email: 'investors@company.com',
  })

  // 8. PRODUCT LAUNCH - New feature compliance
  const wf8 = createWorkflow({
    type: 'RFP_RESPONSE' as any,
    status: 'APPROVED',
    subject: 'Product Launch - Buy Now Pay Later (BNPL) Feature',
    created_by: 'mock-operator-uuid',
    questions: [
      {
        id: 'q-product-1',
        question: 'What consumer credit disclosures are required?',
        risk: 'HIGH',
        draft: 'Customers will see APR, total cost of credit, repayment schedule, and right to cancel within 14 days as required by Consumer Credit Act.',
        flags: [
          {
            ruleId: 'rule-compliance-1',
            ruleName: 'Consumer credit products require FCA compliance approval',
            severity: 'HIGH',
            action: 'REQUIRE_APPROVAL',
            matchedPatterns: ['APR', 'credit', 'Consumer Credit Act'],
            reason: 'Regulated consumer credit product',
          },
        ],
      },
    ],
    steps: [
      {
        id: 'step-1-product',
        workflow_id: '',
        sequence: 1,
        name: 'Compliance Review',
        type: 'DRAFTING',
        status: 'COMPLETED',
        output: { drafts: [] },
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  })

  // Approve product
  const approval8 = createApproval({
    workflow_step_id: 'step-1-product',
    question_id: 'q-product-1',
    approver_role: 'compliance_officer',
    decision: 'APPROVED',
    policy_rule_id: 'rule-compliance-1',
    severity: 'HIGH',
    decided_by: 'Head of Compliance',
    decided_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    comment: 'Approved. All FCA requirements met.',
  })

  // 9. REGULATORY FILING - Supervisory response
  const wf9 = createWorkflow({
    type: 'RFP_RESPONSE' as any,
    status: 'APPROVALS_PENDING',
    subject: 'ECB Supervisory Request - Capital Adequacy Assessment',
    created_by: 'mock-operator-uuid',
    questions: [
      {
        id: 'q-reg-1',
        question: 'What is our current Tier 1 capital ratio?',
        risk: 'HIGH',
        draft: 'Our CET1 ratio is currently 14.2%, exceeding the regulatory minimum of 10.5% by a comfortable margin.',
        flags: [
          {
            ruleId: 'rule-regulatory-1',
            ruleName: 'Supervisory responses require Board approval',
            severity: 'HIGH',
            action: 'REQUIRE_APPROVAL',
            matchedPatterns: ['CET1', 'capital ratio', 'regulatory'],
            reason: 'Formal regulatory response with financial data',
          },
        ],
      },
    ],
    steps: [
      {
        id: 'step-1-reg',
        workflow_id: '',
        sequence: 1,
        name: 'Regulatory Review',
        type: 'DRAFTING',
        status: 'COMPLETED',
        output: { drafts: [] },
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
    ],
  })

  // 10. INCIDENT RESPONSE - Data breach notification
  const wf10 = createWorkflow({
    type: 'RFP_RESPONSE' as any,
    status: 'DISPATCHED',
    subject: 'Security Incident #2024-03 - Customer Data Exposure',
    created_by: 'mock-operator-uuid',
    questions: [
      {
        id: 'q-incident-1',
        question: 'Do we need to notify the ICO within 72 hours?',
        risk: 'HIGH',
        draft: 'Yes. Approximately 15,000 customer email addresses and phone numbers were exposed due to misconfigured S3 bucket. This constitutes a personal data breach requiring notification under GDPR Article 33.',
        flags: [
          {
            ruleId: 'rule-breach-1',
            ruleName: 'Data breach notifications require DPO and General Counsel approval',
            severity: 'HIGH',
            action: 'REQUIRE_APPROVAL',
            matchedPatterns: ['personal data breach', 'GDPR', 'notification', 'exposed'],
            reason: 'Regulatory breach notification with legal consequences',
          },
        ],
      },
      {
        id: 'q-incident-2',
        question: 'What should we communicate to affected customers?',
        risk: 'HIGH',
        draft: 'We will notify affected customers within 48 hours with details of the exposure, steps taken to secure data, and recommendations for protecting their accounts.',
        flags: [
          {
            ruleId: 'rule-comms-1',
            ruleName: 'Crisis communications require Executive approval',
            severity: 'HIGH',
            action: 'REQUIRE_APPROVAL',
            matchedPatterns: ['notify', 'customers', 'exposure'],
            reason: 'External customer communication about security incident',
          },
        ],
      },
    ],
    steps: [
      {
        id: 'step-1-incident',
        workflow_id: '',
        sequence: 1,
        name: 'Incident Assessment',
        type: 'DRAFTING',
        status: 'COMPLETED',
        output: { drafts: [] },
        created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  })

  // Approve and dispatch incident
  const approval10a = createApproval({
    workflow_step_id: 'step-1-incident',
    question_id: 'q-incident-1',
    approver_role: 'dpo',
    decision: 'APPROVED',
    policy_rule_id: 'rule-breach-1',
    severity: 'HIGH',
    decided_by: 'DPO',
    decided_at: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
    comment: 'Approved for immediate ICO notification. Incident logged and evidence preserved.',
  })

  const approval10b = createApproval({
    workflow_step_id: 'step-1-incident',
    question_id: 'q-incident-2',
    approver_role: 'ceo',
    decision: 'APPROVED',
    policy_rule_id: 'rule-comms-1',
    severity: 'HIGH',
    decided_by: 'CEO',
    decided_at: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
    comment: 'Approved. Use approved incident response template. Coordinate with PR team.',
  })

  await sealEvidence(wf10.id, { questions: wf10.questions })
  await dispatchWorkflow(wf10.id, ['EMAIL', 'WEBHOOK'], {
    recipient_email: 'ico@ico.org.uk',
  })
  await recordOutcome(wf10.id, 'PENDING', {
    customer_feedback: 'ICO acknowledged receipt. Investigation ongoing.',
    recorded_by: 'Legal Team',
  })

  // 11. EMPLOYMENT DECISION - Senior hire
  const wf11 = createWorkflow({
    type: 'RFP_RESPONSE' as any,
    status: 'APPROVED',
    subject: 'Senior Hire - Chief Data Officer Offer Letter',
    created_by: 'mock-operator-uuid',
    questions: [
      {
        id: 'q-hr-1',
        question: 'What compensation package can we offer?',
        risk: 'MEDIUM',
        draft: 'Base salary £280,000, 40% bonus target, £150,000 sign-on, equity grant of 50,000 RSUs vesting over 4 years.',
        flags: [
          {
            ruleId: 'rule-hr-1',
            ruleName: 'Executive compensation requires Remuneration Committee approval',
            severity: 'HIGH',
            action: 'REQUIRE_APPROVAL',
            matchedPatterns: ['£280,000', 'equity', 'RSUs'],
            reason: 'Executive-level compensation exceeds delegation threshold',
          },
        ],
      },
    ],
    steps: [
      {
        id: 'step-1-hr',
        workflow_id: '',
        sequence: 1,
        name: 'HR Review',
        type: 'DRAFTING',
        status: 'COMPLETED',
        output: { drafts: [] },
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  })

  const approval11 = createApproval({
    workflow_step_id: 'step-1-hr',
    question_id: 'q-hr-1',
    approver_role: 'remuneration_committee',
    decision: 'APPROVED',
    policy_rule_id: 'rule-hr-1',
    severity: 'HIGH',
    decided_by: 'Remuneration Committee Chair',
    decided_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    comment: 'Approved. Within budget for this role.',
  })

  // 12. MATERIAL CHANGE - Price increase notice
  const wf12 = createWorkflow({
    type: 'RFP_RESPONSE' as any,
    status: 'DISPATCHED',
    subject: 'Customer Notice - Subscription Price Increase 2024',
    created_by: 'mock-operator-uuid',
    questions: [
      {
        id: 'q-notice-1',
        question: 'How should we communicate the 15% price increase?',
        risk: 'MEDIUM',
        draft: 'We will notify customers 60 days in advance, explain the increase is due to inflation and service improvements, and offer a loyalty discount for annual commitments.',
        flags: [
          {
            ruleId: 'rule-customer-1',
            ruleName: 'Material customer changes require Legal and Product approval',
            severity: 'MEDIUM',
            action: 'REQUIRE_APPROVAL',
            matchedPatterns: ['price increase', 'notify customers', '15%'],
            reason: 'Material contract change requiring customer consent',
          },
        ],
      },
    ],
    steps: [
      {
        id: 'step-1-notice',
        workflow_id: '',
        sequence: 1,
        name: 'Change Review',
        type: 'DRAFTING',
        status: 'COMPLETED',
        output: { drafts: [] },
        created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  })

  const approval12 = createApproval({
    workflow_step_id: 'step-1-notice',
    question_id: 'q-notice-1',
    approver_role: 'head_of_product',
    decision: 'APPROVED',
    policy_rule_id: 'rule-customer-1',
    severity: 'MEDIUM',
    decided_by: 'Head of Product',
    decided_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    comment: 'Approved. Ensure notice period complies with contract terms.',
  })

  await sealEvidence(wf12.id, { questions: wf12.questions })
  await dispatchWorkflow(wf12.id, ['EMAIL', 'CRM'], {
    recipient_email: 'customers@company.com',
  })

  console.log('✅ Enterprise workflows seeded:')
  console.log(`   1. Marketing Approval (Instagram Ads) - PENDING`)
  console.log(`   2. Deal Desk (Deutsche Bank) - APPROVED`)
  console.log(`   3. Vendor Onboarding (AWS) - DISPATCHED`)
  console.log(`   4. AI Use-Case (Chatbot) - PENDING`)
  console.log(`   5. DPIA (Credit Scoring) - PENDING`)
  console.log(`   6. Customer Complaint (FCA) - BLOCKED (rejected)`)
  console.log(`   7. ESG Report (Net Zero) - DISPATCHED`)
  console.log(`   8. Product Launch (BNPL) - APPROVED`)
  console.log(`   9. Regulatory Filing (ECB) - PENDING`)
  console.log(`   10. Incident Response (Data Breach) - DISPATCHED`)
  console.log(`   11. Senior Hire (CDO) - APPROVED`)
  console.log(`   12. Price Change Notice - DISPATCHED`)
  console.log(`\n📊 Total: 12 workflows across 12 different use cases`)
  console.log(`   - 5 pending approval`)
  console.log(`   - 4 approved`)
  console.log(`   - 4 dispatched`)
  console.log(`   - 1 rejected/blocked`)
}
