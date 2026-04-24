import { Workflow, RFPQuestion, PolicyFlag, Approval } from '@/lib/types/workflow'
import { testPolicy, getPolicyById } from './policies'
import { createLedgerEntry } from './ledger'

// In-memory storage
let workflows: Workflow[] = []
let approvals: Approval[] = []

export function getAllWorkflows(): Workflow[] {
  return workflows
}

export function getWorkflowById(id: string): Workflow | undefined {
  return workflows.find((w) => w.id === id)
}

export function createWorkflow(workflow: Omit<Workflow, 'id' | 'created_at' | 'updated_at'>): Workflow {
  const newWorkflow: Workflow = {
    ...workflow,
    id: `wf-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  workflows.push(newWorkflow)

  // Create ledger entry for workflow creation
  createLedgerEntry(
    'WORKFLOW_CREATED',
    {
      workflow_id: newWorkflow.id,
      subject: newWorkflow.subject,
      created_by: newWorkflow.created_by,
    },
    newWorkflow.id
  )

  // Auto-create approvals if workflow has policy flags requiring approval
  const draftingStep = newWorkflow.steps?.find(s => s.type === 'DRAFTING')
  if (draftingStep && draftingStep.output?.drafts) {
    const questions = draftingStep.output.drafts as RFPQuestion[]

    questions.forEach((q) => {
      q.flags?.forEach((flag) => {
        if (flag.action === 'REQUIRE_APPROVAL') {
          // Determine approver role from rule name
          let approverRole = 'head_of_delivery'
          if (flag.ruleName.toLowerCase().includes('product')) {
            approverRole = 'head_of_product'
          } else if (flag.ruleName.toLowerCase().includes('legal')) {
            approverRole = 'general_counsel'
          }

          // Create approval record
          const approval = createApproval({
            workflow_step_id: draftingStep.id,
            question_id: q.id,
            approver_role: approverRole,
            decision: 'PENDING',
            policy_rule_id: flag.ruleId,
            severity: flag.severity,
          })

          // Create ledger entry for authority check
          createLedgerEntry(
            'AUTHORITY_CHECK_PERFORMED',
            {
              approval_id: approval.id,
              rule_id: flag.ruleId,
              rule_name: flag.ruleName,
              severity: flag.severity,
              question_id: q.id,
            },
            newWorkflow.id
          )
        }
      })
    })
  }

  return newWorkflow
}

export function updateWorkflow(id: string, updates: Partial<Workflow>): Workflow | null {
  const index = workflows.findIndex((w) => w.id === id)
  if (index === -1) return null

  workflows[index] = {
    ...workflows[index],
    ...updates,
    updated_at: new Date().toISOString(),
  }
  return workflows[index]
}

// AI Classification (stubbed)
export function classifyQuestions(questions: string[]): { question: string; risk: 'LOW' | 'MEDIUM' | 'HIGH' }[] {
  return questions.map((question, index) => {
    // Hardcoded demo risk levels
    let risk: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW'

    const lowerQ = question.toLowerCase()
    if (lowerQ.includes('sla') || lowerQ.includes('uptime') || lowerQ.includes('commit') || lowerQ.includes('availability')) {
      risk = 'HIGH'
    } else if (lowerQ.includes('soc') || lowerQ.includes('complian') || lowerQ.includes('certif')) {
      risk = 'MEDIUM'
    }

    return { question, risk }
  })
}

// AI Drafting (stubbed with realistic demo responses)
export function draftAnswers(questions: { question: string; risk: string }[]): RFPQuestion[] {
  const draftResponses: Record<string, string> = {
    'uptime': 'Our platform provides 99.95% uptime backed by a full SLA with financial credits for breaches.',
    'sla': 'Our platform provides 99.95% uptime backed by a full SLA with financial credits for breaches.',
    'availability': 'We commit to 99.99% availability across all enterprise tiers.',
    'soc': 'Yes, we are SOC 2 Type II certified and maintain annual audits.',
    'complian': 'Yes, we are SOC 2 Type II certified and maintain annual compliance audits.',
    'certif': 'Yes, we are SOC 2 Type II certified and maintain annual audits.',
    'roadmap': 'Yes, custom workflow builders are on our Q3 roadmap and will be delivered in that timeframe.',
    'retention': 'Customer data is retained for 90 days after contract termination, then securely deleted.',
    'feature': 'Yes, custom workflow builders are on our Q3 roadmap and will be delivered in that timeframe.',
  }

  return questions.map((q, index) => {
    const lowerQ = q.question.toLowerCase()
    let draft = 'We would be happy to discuss this further during a call.'

    // Match keywords to draft responses
    for (const [keyword, response] of Object.entries(draftResponses)) {
      if (lowerQ.includes(keyword)) {
        draft = response
        break
      }
    }

    return {
      id: `q-${index + 1}`,
      question: q.question,
      risk: q.risk as any,
      draft,
      flags: [],
    }
  })
}

// Policy Check
export function checkPolicyFlags(questions: RFPQuestion[]): RFPQuestion[] {
  // Get active policy
  const policy = getPolicyById('policy-rfp-v1')
  if (!policy) return questions

  return questions.map((q) => {
    const results = testPolicy(policy, q.draft)
    const flags: PolicyFlag[] = results
      .filter((r) => r.matched)
      .map((r) => ({
        ruleId: r.ruleId,
        ruleName: r.ruleName,
        severity: r.severity,
        action: r.action,
        matchedPatterns: r.matchedPatterns,
        reason: `Matched patterns: ${r.matchedPatterns?.join(', ') || 'semantic trigger'}`,
      }))

    return {
      ...q,
      flags,
    }
  })
}

// Get required approvers from flags
export function getRequiredApprovers(questions: RFPQuestion[]): string[] {
  const approvers = new Set<string>()

  questions.forEach((q) => {
    q.flags.forEach((flag) => {
      if (flag.action === 'REQUIRE_APPROVAL') {
        // For demo, extract approver from rule name
        if (flag.ruleName.includes('delivery')) approvers.add('head_of_delivery')
        if (flag.ruleName.includes('product')) approvers.add('head_of_product')
        if (flag.ruleName.includes('legal')) approvers.add('general_counsel')
      }
    })
  })

  return Array.from(approvers)
}

// Approvals management
export function createApproval(approval: Omit<Approval, 'id' | 'created_at'>): Approval {
  const newApproval: Approval = {
    ...approval,
    id: `approval-${Date.now()}`,
    created_at: new Date().toISOString(),
  }
  approvals.push(newApproval)
  return newApproval
}

export function getAllApprovals(): Approval[] {
  return approvals
}

export function getApprovalsByRole(role: string): Approval[] {
  return approvals.filter((a) => a.approver_role === role && a.decision === 'PENDING')
}

export function updateApproval(
  id: string,
  decision: string,
  comment?: string,
  userId?: string
): Approval | null {
  const index = approvals.findIndex((a) => a.id === id)
  if (index === -1) return null

  approvals[index] = {
    ...approvals[index],
    decision: decision as any,
    comment,
    approver_user_id: userId,
    decided_at: new Date().toISOString(),
  }

  // Create ledger entry
  createLedgerEntry(
    decision === 'APPROVED'
      ? 'APPROVAL_GRANTED'
      : decision === 'REJECTED'
      ? 'APPROVAL_REJECTED'
      : 'APPROVAL_CHANGES_REQUESTED',
    {
      approval_id: id,
      decision,
      comment,
      approver_role: approvals[index].approver_role,
    },
    approvals[index].workflow_step_id
  )

  return approvals[index]
}

export function getApprovalsByWorkflow(workflowId: string): Approval[] {
  return approvals.filter((a) => {
    const workflow = workflows.find((w) => w.id === workflowId)
    if (!workflow) return false
    const stepIds = workflow.steps?.map((s) => s.id) || []
    return stepIds.includes(a.workflow_step_id)
  })
}

export function getApprovalsByWorkflowStepId(stepId: string): Approval[] {
  return approvals.filter((a) => a.workflow_step_id === stepId)
}
