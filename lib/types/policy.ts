export type PolicyStatus = 'DRAFT' | 'ACTIVE' | 'RETIRED'

export type RuleSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type RuleAction =
  | 'ALLOW'
  | 'REQUIRE_APPROVAL'
  | 'REQUIRE_EVIDENCE'
  | 'BLOCK'
  | 'ESCALATE'

export interface RuleTrigger {
  patterns?: string[]
  semantic?: string
}

export interface PolicyRule {
  id: string
  name: string
  severity: RuleSeverity
  action: RuleAction
  trigger: RuleTrigger
  approver_role?: string
  approver_roles?: string[]
  required_evidence_type?: string
}

export interface Policy {
  id: string
  name: string
  version: string
  status: PolicyStatus
  effective_from: string
  rules: PolicyRule[]
  created_at: string
  updated_at?: string
}
