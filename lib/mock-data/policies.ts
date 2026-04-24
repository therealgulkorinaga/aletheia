import { Policy } from '@/lib/types/policy'

export const SEED_POLICIES: Policy[] = [
  {
    id: 'policy-rfp-v1',
    name: 'RFP Response Authority Policy',
    version: 'v1',
    status: 'ACTIVE',
    effective_from: '2026-01-01',
    created_at: new Date('2026-01-01').toISOString(),
    rules: [
      {
        id: 'rule-1',
        name: 'SLA commitments require delivery approval',
        severity: 'HIGH',
        action: 'REQUIRE_APPROVAL',
        trigger: {
          patterns: [
            'SLA',
            'uptime',
            'service level',
            'availability',
            '99.9%',
            '99.95%',
            '99.99%',
          ],
        },
        approver_role: 'head_of_delivery',
      },
      {
        id: 'rule-2',
        name: 'Future roadmap commitments need product + legal approval',
        severity: 'CRITICAL',
        action: 'REQUIRE_APPROVAL',
        trigger: {
          semantic: 'commits to future product features or roadmap timelines',
        },
        approver_roles: ['head_of_product', 'general_counsel'],
      },
      {
        id: 'rule-3',
        name: 'Compliance certification claims need evidence',
        severity: 'HIGH',
        action: 'REQUIRE_EVIDENCE',
        trigger: {
          patterns: [
            'SOC 2',
            'ISO 27001',
            'HIPAA',
            'PCI',
            'GDPR compliant',
            'certified',
            'certification',
          ],
        },
        required_evidence_type: 'certification_document',
      },
    ],
  },
]

// In-memory storage for demo
let policies: Policy[] = [...SEED_POLICIES]

export function getAllPolicies(): Policy[] {
  return policies
}

export function getPolicyById(id: string): Policy | undefined {
  return policies.find((p) => p.id === id)
}

export function createPolicy(policy: Omit<Policy, 'id' | 'created_at'>): Policy {
  const newPolicy: Policy = {
    ...policy,
    id: `policy-${Date.now()}`,
    created_at: new Date().toISOString(),
  }
  policies.push(newPolicy)
  return newPolicy
}

export function updatePolicy(id: string, updates: Partial<Policy>): Policy | null {
  const index = policies.findIndex((p) => p.id === id)
  if (index === -1) return null

  policies[index] = {
    ...policies[index],
    ...updates,
    updated_at: new Date().toISOString(),
  }
  return policies[index]
}

export function deletePolicy(id: string): boolean {
  const index = policies.findIndex((p) => p.id === id)
  if (index === -1) return false

  policies.splice(index, 1)
  return true
}

// Policy testing logic
export function testPolicyRule(ruleText: string, content: string): boolean {
  const rule = ruleText.toLowerCase()
  const testContent = content.toLowerCase()

  // Simple pattern matching
  return testContent.includes(rule)
}

export function testPolicy(policy: Policy, content: string): {
  ruleId: string
  ruleName: string
  severity: string
  action: string
  matched: boolean
  matchedPatterns?: string[]
}[] {
  return policy.rules.map((rule) => {
    const testContent = content.toLowerCase()
    const matchedPatterns: string[] = []
    let matched = false

    if (rule.trigger.patterns) {
      for (const pattern of rule.trigger.patterns) {
        if (testContent.includes(pattern.toLowerCase())) {
          matchedPatterns.push(pattern)
          matched = true
        }
      }
    }

    // For semantic rules, just indicate they would need LLM
    if (rule.trigger.semantic && !matched) {
      // Placeholder for semantic matching
      matched = false
    }

    return {
      ruleId: rule.id,
      ruleName: rule.name,
      severity: rule.severity,
      action: rule.action,
      matched,
      matchedPatterns: matchedPatterns.length > 0 ? matchedPatterns : undefined,
    }
  })
}
