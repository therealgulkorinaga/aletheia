export type WorkflowType = 'RFP_RESPONSE' | 'CONTRACT_REVIEW' | 'PROPOSAL'

export type WorkflowStatus =
  | 'INITIATED'
  | 'IN_REVIEW'
  | 'APPROVALS_PENDING'
  | 'APPROVED'
  | 'DISPATCHED'
  | 'BLOCKED'

export type StepType =
  | 'INGEST'
  | 'CLASSIFICATION'
  | 'DRAFTING'
  | 'EVIDENCE'
  | 'APPROVAL_SUBMISSION'

export type StepStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'

export type ApprovalDecision =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CHANGES_REQUESTED'

export interface RFPQuestion {
  id: string
  question: string
  risk: 'LOW' | 'MEDIUM' | 'HIGH'
  draft: string
  flags: PolicyFlag[]
  evidenceAttached?: boolean
}

export interface PolicyFlag {
  ruleId: string
  ruleName: string
  severity: string
  action: string
  matchedPatterns?: string[]
  reason?: string
}

export interface WorkflowStep {
  id: string
  workflow_id: string
  sequence: number
  name: string
  type: StepType
  status: StepStatus
  output: any
  created_at: string
}

export interface AuthorityCheck {
  id: string
  workflow_step_id: string
  verdict: string
  rules_triggered: PolicyFlag[]
  created_at: string
}

export interface Approval {
  id: string
  workflow_step_id: string
  approver_role: string
  approver_user_id?: string
  decision: ApprovalDecision
  comment?: string
  created_at: string
  decided_at?: string
  question_id?: string
  policy_rule_id?: string
  severity?: string
  decided_by?: string
}

export interface Workflow {
  id: string
  type: WorkflowType
  status: WorkflowStatus
  subject: string
  created_by: string
  created_at: string
  updated_at: string
  completed_at?: string
  steps: WorkflowStep[]
  questions?: RFPQuestion[]
  authority_checks?: AuthorityCheck[]
  approvals?: Approval[]
}
