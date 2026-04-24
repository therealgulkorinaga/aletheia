import { createWorkflow, createApproval, updateApproval } from './workflows'
import { createLedgerEntry, sealEvidence } from './ledger'
import { dispatchWorkflow, recordOutcome } from './execution'

export async function seedData() {
  console.log('🌱 Seeding demo data...')

  // Workflow 1: Completed workflow (DISPATCHED) with approval granted
  const workflow1 = createWorkflow({
    type: 'RFP_RESPONSE',
    status: 'DISPATCHED',
    subject: 'Barclays Digital Banking RFP',
    created_by: 'mock-operator-uuid',
    completed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    questions: [
      {
        id: 'q-1',
        question: 'What is your platform uptime SLA?',
        risk: 'HIGH',
        draft: 'Our platform provides 99.95% uptime backed by a full SLA with financial credits for breaches.',
        flags: [
          {
            ruleId: 'rule-sla-1',
            ruleName: 'SLA commitments require delivery approval',
            severity: 'HIGH',
            action: 'REQUIRE_APPROVAL',
            matchedPatterns: ['SLA', 'uptime', '99.95%'],
            reason: 'Matched patterns: SLA, uptime, 99.95%',
          },
        ],
        evidenceAttached: true,
      },
      {
        id: 'q-2',
        question: 'Are you SOC 2 certified?',
        risk: 'MEDIUM',
        draft: 'Yes, we are SOC 2 Type II certified and maintain annual audits.',
        flags: [],
      },
    ],
    steps: [
      {
        id: 'step-1-wf1',
        workflow_id: '',
        sequence: 1,
        name: 'Ingest RFP',
        type: 'INGEST',
        status: 'COMPLETED',
        output: { questions: ['What is your platform uptime SLA?', 'Are you SOC 2 certified?'] },
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'step-2-wf1',
        workflow_id: '',
        sequence: 2,
        name: 'AI Classification',
        type: 'CLASSIFICATION',
        status: 'COMPLETED',
        output: {},
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'step-3-wf1',
        workflow_id: '',
        sequence: 3,
        name: 'AI Drafting',
        type: 'DRAFTING',
        status: 'COMPLETED',
        output: {
          drafts: [
            {
              id: 'q-1',
              question: 'What is your platform uptime SLA?',
              risk: 'HIGH',
              draft: 'Our platform provides 99.95% uptime backed by a full SLA with financial credits for breaches.',
              flags: [
                {
                  ruleId: 'rule-sla-1',
                  ruleName: 'SLA commitments require delivery approval',
                  severity: 'HIGH',
                  action: 'REQUIRE_APPROVAL',
                  matchedPatterns: ['SLA', 'uptime', '99.95%'],
                },
              ],
            },
          ],
        },
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  })

  // Manually approve workflow 1 (since it was created before approval logic)
  const approval1 = createApproval({
    workflow_step_id: 'step-3-wf1',
    question_id: 'q-1',
    approver_role: 'head_of_delivery',
    decision: 'APPROVED',
    policy_rule_id: 'rule-sla-1',
    severity: 'HIGH',
    decided_by: 'Michael Roberts',
    decided_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    comment: 'Approved. This aligns with our current SLA documentation.',
  })

  // Seal evidence for workflow 1
  await sealEvidence(workflow1.id, {
    questions: workflow1.questions,
    approvals: [approval1],
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  })

  // Dispatch workflow 1
  await dispatchWorkflow(workflow1.id, ['EMAIL', 'CRM', 'WEBHOOK'], {
    recipient_email: 'procurement@barclays.com',
    crm_opportunity_id: 'OPP-BARCLAYS-2024-Q4',
  })

  // Record outcome for workflow 1
  await recordOutcome(workflow1.id, 'WON', {
    contract_value: 450000,
    win_reason: 'Competitive pricing and strong compliance credentials',
    customer_feedback: 'Impressed with governance framework and audit trail',
    recorded_by: 'Sarah Chen',
  })

  // Workflow 2: Currently pending approval
  const workflow2 = createWorkflow({
    type: 'RFP_RESPONSE',
    status: 'APPROVALS_PENDING',
    subject: 'HSBC Wealth Management Platform',
    created_by: 'mock-operator-uuid',
    questions: [
      {
        id: 'q-wf2-1',
        question: 'What features are on your product roadmap for Q3 2026?',
        risk: 'MEDIUM',
        draft: 'Yes, custom workflow builders are on our Q3 roadmap and will be delivered in that timeframe.',
        flags: [
          {
            ruleId: 'rule-roadmap-1',
            ruleName: 'Product roadmap commitments require delivery approval',
            severity: 'HIGH',
            action: 'REQUIRE_APPROVAL',
            matchedPatterns: ['roadmap', 'Q3', 'delivered'],
            reason: 'Matched patterns: roadmap, Q3, delivered',
          },
        ],
      },
      {
        id: 'q-wf2-2',
        question: 'What is your data retention policy?',
        risk: 'LOW',
        draft: 'Customer data is retained for 90 days after contract termination, then securely deleted.',
        flags: [],
      },
    ],
    steps: [
      {
        id: 'step-1-wf2',
        workflow_id: '',
        sequence: 1,
        name: 'Ingest RFP',
        type: 'INGEST',
        status: 'COMPLETED',
        output: {},
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'step-2-wf2',
        workflow_id: '',
        sequence: 2,
        name: 'AI Classification',
        type: 'CLASSIFICATION',
        status: 'COMPLETED',
        output: {},
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'step-3-wf2',
        workflow_id: '',
        sequence: 3,
        name: 'AI Drafting',
        type: 'DRAFTING',
        status: 'COMPLETED',
        output: {
          drafts: [
            {
              id: 'q-wf2-1',
              question: 'What features are on your product roadmap for Q3 2026?',
              risk: 'MEDIUM',
              draft: 'Yes, custom workflow builders are on our Q3 roadmap and will be delivered in that timeframe.',
              flags: [
                {
                  ruleId: 'rule-roadmap-1',
                  ruleName: 'Product roadmap commitments require delivery approval',
                  severity: 'HIGH',
                  action: 'REQUIRE_APPROVAL',
                  matchedPatterns: ['roadmap', 'Q3', 'delivered'],
                },
              ],
            },
          ],
        },
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  })

  // Approval will be auto-created by workflow creation

  // Workflow 3: Another pending approval (different approver)
  const workflow3 = createWorkflow({
    type: 'RFP_RESPONSE',
    status: 'APPROVALS_PENDING',
    subject: 'Lloyds Corporate Banking Integration',
    created_by: 'mock-operator-uuid',
    questions: [
      {
        id: 'q-wf3-1',
        question: 'Can you commit to 99.99% availability for mission-critical services?',
        risk: 'HIGH',
        draft: 'We commit to 99.99% availability across all enterprise tiers.',
        flags: [
          {
            ruleId: 'rule-sla-1',
            ruleName: 'SLA commitments require delivery approval',
            severity: 'HIGH',
            action: 'REQUIRE_APPROVAL',
            matchedPatterns: ['commit', '99.99%', 'availability'],
            reason: 'Matched patterns: commit, 99.99%, availability',
          },
        ],
        evidenceAttached: true,
      },
    ],
    steps: [
      {
        id: 'step-1-wf3',
        workflow_id: '',
        sequence: 1,
        name: 'Ingest RFP',
        type: 'INGEST',
        status: 'COMPLETED',
        output: {},
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'step-2-wf3',
        workflow_id: '',
        sequence: 2,
        name: 'AI Classification',
        type: 'CLASSIFICATION',
        status: 'COMPLETED',
        output: {},
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'step-3-wf3',
        workflow_id: '',
        sequence: 3,
        name: 'AI Drafting',
        type: 'DRAFTING',
        status: 'COMPLETED',
        output: {
          drafts: [
            {
              id: 'q-wf3-1',
              question: 'Can you commit to 99.99% availability for mission-critical services?',
              risk: 'HIGH',
              draft: 'We commit to 99.99% availability across all enterprise tiers.',
              flags: [
                {
                  ruleId: 'rule-sla-1',
                  ruleName: 'SLA commitments require delivery approval',
                  severity: 'HIGH',
                  action: 'REQUIRE_APPROVAL',
                  matchedPatterns: ['commit', '99.99%', 'availability'],
                },
              ],
            },
          ],
        },
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
    ],
  })

  // Workflow 4: Completed workflow with rejection
  const workflow4 = createWorkflow({
    type: 'RFP_RESPONSE',
    status: 'BLOCKED',
    subject: 'NatWest Payment Gateway Proposal',
    created_by: 'mock-operator-uuid',
    questions: [
      {
        id: 'q-wf4-1',
        question: 'What is your guaranteed uptime commitment?',
        risk: 'HIGH',
        draft: 'Our platform provides 99.95% uptime backed by a full SLA with financial credits for breaches.',
        flags: [
          {
            ruleId: 'rule-sla-1',
            ruleName: 'SLA commitments require delivery approval',
            severity: 'HIGH',
            action: 'REQUIRE_APPROVAL',
            matchedPatterns: ['uptime', 'commitment', '99.95%'],
            reason: 'Matched patterns: uptime, commitment, 99.95%',
          },
        ],
      },
    ],
    steps: [
      {
        id: 'step-1-wf4',
        workflow_id: '',
        sequence: 1,
        name: 'Ingest RFP',
        type: 'INGEST',
        status: 'COMPLETED',
        output: {},
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'step-2-wf4',
        workflow_id: '',
        sequence: 2,
        name: 'AI Classification',
        type: 'CLASSIFICATION',
        status: 'COMPLETED',
        output: {},
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'step-3-wf4',
        workflow_id: '',
        sequence: 3,
        name: 'AI Drafting',
        type: 'DRAFTING',
        status: 'COMPLETED',
        output: {
          drafts: [
            {
              id: 'q-wf4-1',
              question: 'What is your guaranteed uptime commitment?',
              risk: 'HIGH',
              draft: 'Our platform provides 99.95% uptime backed by a full SLA with financial credits for breaches.',
              flags: [
                {
                  ruleId: 'rule-sla-1',
                  ruleName: 'SLA commitments require delivery approval',
                  severity: 'HIGH',
                  action: 'REQUIRE_APPROVAL',
                  matchedPatterns: ['uptime', 'commitment', '99.95%'],
                },
              ],
            },
          ],
        },
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  })

  // Create and reject approval for workflow 4
  const approval4 = createApproval({
    workflow_step_id: 'step-3-wf4',
    question_id: 'q-wf4-1',
    approver_role: 'head_of_delivery',
    decision: 'REJECTED',
    policy_rule_id: 'rule-sla-1',
    severity: 'HIGH',
    decided_by: 'Michael Roberts',
    decided_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    comment: 'Our current infrastructure only supports 99.9% uptime. This commitment would expose us to liability. Please revise.',
  })

  // Workflow 5: Recently approved, ready for dispatch
  const workflow5 = createWorkflow({
    type: 'RFP_RESPONSE',
    status: 'APPROVED',
    subject: 'Santander API Integration Requirements',
    created_by: 'mock-operator-uuid',
    questions: [
      {
        id: 'q-wf5-1',
        question: 'Do you maintain SOC 2 Type II certification?',
        risk: 'MEDIUM',
        draft: 'Yes, we are SOC 2 Type II certified and maintain annual audits.',
        flags: [],
      },
      {
        id: 'q-wf5-2',
        question: 'What is your data encryption standard?',
        risk: 'LOW',
        draft: 'We use AES-256 encryption at rest and TLS 1.3 in transit.',
        flags: [],
      },
    ],
    steps: [
      {
        id: 'step-1-wf5',
        workflow_id: '',
        sequence: 1,
        name: 'Ingest RFP',
        type: 'INGEST',
        status: 'COMPLETED',
        output: {},
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'step-2-wf5',
        workflow_id: '',
        sequence: 2,
        name: 'AI Classification',
        type: 'CLASSIFICATION',
        status: 'COMPLETED',
        output: {},
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'step-3-wf5',
        workflow_id: '',
        sequence: 3,
        name: 'AI Drafting',
        type: 'DRAFTING',
        status: 'COMPLETED',
        output: { drafts: [] },
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  })

  console.log('✅ Seed data created:')
  console.log(`   - ${workflow1.subject} (DISPATCHED)`)
  console.log(`   - ${workflow2.subject} (APPROVALS_PENDING)`)
  console.log(`   - ${workflow3.subject} (APPROVALS_PENDING)`)
  console.log(`   - ${workflow4.subject} (BLOCKED - rejected)`)
  console.log(`   - ${workflow5.subject} (APPROVED)`)
  console.log(`   - 2 pending approvals in inbox`)
  console.log(`   - 1 approved, 1 rejected approval`)
  console.log(`   - Ledger entries: ${15}+ events`)
}
