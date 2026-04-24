'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Policy, PolicyRule, RuleSeverity, RuleAction } from '@/lib/types/policy'
import { Plus, ChevronDown, ChevronUp, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react'

const severityColors = {
  LOW: 'bg-blue-100 text-blue-800 border-blue-200',
  MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
  CRITICAL: 'bg-red-100 text-red-800 border-red-200',
}

const actionColors = {
  ALLOW: 'bg-green-100 text-green-800 border-green-200',
  REQUIRE_APPROVAL: 'bg-amber-100 text-amber-800 border-amber-200',
  REQUIRE_EVIDENCE: 'bg-blue-100 text-blue-800 border-blue-200',
  BLOCK: 'bg-red-100 text-red-800 border-red-200',
  ESCALATE: 'bg-purple-100 text-purple-800 border-purple-200',
}

export default function PolicyEditorPage() {
  const router = useRouter()
  const params = useParams()
  const policyId = params.id as string

  const [policy, setPolicy] = useState<Policy | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set())
  const [testContent, setTestContent] = useState('')
  const [testResults, setTestResults] = useState<any[]>([])
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    if (policyId !== 'new') {
      fetchPolicy()
    } else {
      // New policy
      setPolicy({
        id: 'new',
        name: '',
        version: 'v1',
        status: 'DRAFT',
        effective_from: new Date().toISOString().split('T')[0],
        rules: [],
        created_at: new Date().toISOString(),
      })
      setLoading(false)
    }
  }, [policyId])

  const fetchPolicy = async () => {
    try {
      const response = await fetch(`/api/policies/${policyId}`)
      const data = await response.json()
      setPolicy(data)
    } catch (error) {
      console.error('Failed to fetch policy:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!policy) return

    setSaving(true)
    try {
      const url = policyId === 'new' ? '/api/policies' : `/api/policies/${policyId}`
      const method = policyId === 'new' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policy),
      })

      if (response.ok) {
        const saved = await response.json()
        if (policyId === 'new') {
          router.push(`/admin/policies/${saved.id}`)
        } else {
          setPolicy(saved)
        }
      }
    } catch (error) {
      console.error('Failed to save policy:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleActivate = async () => {
    if (!policy) return
    setPolicy({ ...policy, status: 'ACTIVE' })
    await handleSave()
  }

  const addRule = () => {
    if (!policy) return

    const newRule: PolicyRule = {
      id: `rule-${Date.now()}`,
      name: 'New Rule',
      severity: 'MEDIUM',
      action: 'REQUIRE_APPROVAL',
      trigger: {
        patterns: [],
      },
    }

    setPolicy({
      ...policy,
      rules: [...policy.rules, newRule],
    })
    setExpandedRules(new Set([...expandedRules, newRule.id]))
  }

  const updateRule = (ruleId: string, updates: Partial<PolicyRule>) => {
    if (!policy) return

    setPolicy({
      ...policy,
      rules: policy.rules.map((rule) =>
        rule.id === ruleId ? { ...rule, ...updates } : rule
      ),
    })
  }

  const deleteRule = (ruleId: string) => {
    if (!policy) return

    setPolicy({
      ...policy,
      rules: policy.rules.filter((rule) => rule.id !== ruleId),
    })
  }

  const toggleRuleExpanded = (ruleId: string) => {
    const newExpanded = new Set(expandedRules)
    if (newExpanded.has(ruleId)) {
      newExpanded.delete(ruleId)
    } else {
      newExpanded.add(ruleId)
    }
    setExpandedRules(newExpanded)
  }

  const handleTestPolicy = async () => {
    if (!policy || !testContent.trim()) return

    setTesting(true)
    try {
      const response = await fetch(`/api/policies/${policyId}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: testContent }),
      })

      const data = await response.json()
      setTestResults(data.results || [])
    } catch (error) {
      console.error('Failed to test policy:', error)
    } finally {
      setTesting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-500">Loading policy...</p>
      </div>
    )
  }

  if (!policy) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-500">Policy not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-4xl font-bold text-slate-900 mb-2"
            style={{ fontFamily: 'Crimson Pro, serif' }}
          >
            {policyId === 'new' ? 'New Policy' : 'Edit Policy'}
          </h1>
          <p className="text-slate-600">
            Configure governance rules and approval requirements
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/admin/policies')}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
          {policy.status === 'DRAFT' && policyId !== 'new' && (
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleActivate}
            >
              Activate
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Metadata */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Crimson Pro, serif' }}>
                Policy Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Policy Name</Label>
                <Input
                  id="name"
                  value={policy.name}
                  onChange={(e) => setPolicy({ ...policy, name: e.target.value })}
                  placeholder="RFP Response Authority Policy"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  value={policy.version}
                  onChange={(e) => setPolicy({ ...policy, version: e.target.value })}
                  placeholder="v1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={policy.status}
                  onValueChange={(value: any) =>
                    setPolicy({ ...policy, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="RETIRED">Retired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="effective_from">Effective From</Label>
                <Input
                  id="effective_from"
                  type="date"
                  value={policy.effective_from}
                  onChange={(e) =>
                    setPolicy({ ...policy, effective_from: e.target.value })
                  }
                />
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-slate-600">
                  <p className="font-mono">Rules: {policy.rules.length}</p>
                  <p className="font-mono text-xs text-slate-500 mt-1">
                    ID: {policy.id}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Rules */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle style={{ fontFamily: 'Crimson Pro, serif' }}>
                Policy Rules
              </CardTitle>
              <Button onClick={addRule} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Rule
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {policy.rules.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <p className="mb-4">No rules yet</p>
                  <Button onClick={addRule} variant="outline">
                    Add your first rule
                  </Button>
                </div>
              ) : (
                policy.rules.map((rule, index) => (
                  <RuleCard
                    key={rule.id}
                    rule={rule}
                    index={index}
                    expanded={expandedRules.has(rule.id)}
                    onToggle={() => toggleRuleExpanded(rule.id)}
                    onUpdate={(updates) => updateRule(rule.id, updates)}
                    onDelete={() => deleteRule(rule.id)}
                  />
                ))
              )}
            </CardContent>
          </Card>

          {/* Test Policy Panel */}
          {policyId !== 'new' && (
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Crimson Pro, serif' }}>
                  Test Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="testContent">Paste sample answer to test</Label>
                  <Textarea
                    id="testContent"
                    value={testContent}
                    onChange={(e) => setTestContent(e.target.value)}
                    placeholder="Our platform provides 99.95% uptime backed by a full SLA with financial credits..."
                    rows={4}
                  />
                </div>

                <Button onClick={handleTestPolicy} disabled={testing || !testContent.trim()}>
                  {testing ? 'Testing...' : 'Run Policy Check'}
                </Button>

                {testResults.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <p className="text-sm font-medium text-slate-700">Results:</p>
                    {testResults.map((result, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded border ${
                          result.matched
                            ? 'bg-amber-50 border-amber-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {result.matched ? (
                            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-gray-400 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-sm">{result.ruleName}</p>
                            <div className="flex gap-2 mt-1">
                              <Badge
                                variant="outline"
                                className={severityColors[result.severity as RuleSeverity]}
                              >
                                {result.severity}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={actionColors[result.action as RuleAction]}
                              >
                                {result.action}
                              </Badge>
                            </div>
                            {result.matchedPatterns && (
                              <p className="text-xs text-slate-600 mt-2">
                                Matched patterns:{' '}
                                {result.matchedPatterns.map((p: string, i: number) => (
                                  <code
                                    key={i}
                                    className="bg-white px-1 py-0.5 rounded border"
                                  >
                                    {p}
                                  </code>
                                ))}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function RuleCard({
  rule,
  index,
  expanded,
  onToggle,
  onUpdate,
  onDelete,
}: {
  rule: PolicyRule
  index: number
  expanded: boolean
  onToggle: () => void
  onUpdate: (updates: Partial<PolicyRule>) => void
  onDelete: () => void
}) {
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <div
        className="p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-slate-500">#{index + 1}</span>
              <span className="font-medium">{rule.name}</span>
            </div>
            <div className="flex gap-2">
              <Badge
                variant="outline"
                className={severityColors[rule.severity]}
              >
                {rule.severity}
              </Badge>
              <Badge
                variant="outline"
                className={actionColors[rule.action]}
              >
                {rule.action.replace('_', ' ')}
              </Badge>
            </div>
            {rule.trigger.patterns && rule.trigger.patterns.length > 0 && (
              <p className="text-xs text-slate-600 mt-2">
                Patterns: {rule.trigger.patterns.slice(0, 3).join(', ')}
                {rule.trigger.patterns.length > 3 && ' ...'}
              </p>
            )}
            {rule.trigger.semantic && (
              <p className="text-xs text-slate-600 mt-2 italic">
                Semantic: {rule.trigger.semantic}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="p-4 space-y-4 bg-white">
          <div className="space-y-2">
            <Label htmlFor={`rule-name-${rule.id}`}>Rule Name</Label>
            <Input
              id={`rule-name-${rule.id}`}
              value={rule.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`rule-severity-${rule.id}`}>Severity</Label>
              <Select
                value={rule.severity}
                onValueChange={(value: any) => onUpdate({ severity: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`rule-action-${rule.id}`}>Action</Label>
              <Select
                value={rule.action}
                onValueChange={(value: any) => onUpdate({ action: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALLOW">Allow</SelectItem>
                  <SelectItem value="REQUIRE_APPROVAL">Require Approval</SelectItem>
                  <SelectItem value="REQUIRE_EVIDENCE">Require Evidence</SelectItem>
                  <SelectItem value="BLOCK">Block</SelectItem>
                  <SelectItem value="ESCALATE">Escalate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`rule-patterns-${rule.id}`}>
              Trigger Patterns (one per line)
            </Label>
            <Textarea
              id={`rule-patterns-${rule.id}`}
              value={rule.trigger.patterns?.join('\n') || ''}
              onChange={(e) =>
                onUpdate({
                  trigger: {
                    ...rule.trigger,
                    patterns: e.target.value.split('\n').filter((p) => p.trim()),
                  },
                })
              }
              placeholder="SLA&#10;uptime&#10;99.9%"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`rule-semantic-${rule.id}`}>
              Semantic Trigger (optional)
            </Label>
            <Input
              id={`rule-semantic-${rule.id}`}
              value={rule.trigger.semantic || ''}
              onChange={(e) =>
                onUpdate({
                  trigger: {
                    ...rule.trigger,
                    semantic: e.target.value,
                  },
                })
              }
              placeholder="commits to future product features"
            />
          </div>

          {rule.action === 'REQUIRE_APPROVAL' && (
            <div className="space-y-2">
              <Label htmlFor={`rule-approver-${rule.id}`}>
                Approver Role(s)
              </Label>
              <Input
                id={`rule-approver-${rule.id}`}
                value={rule.approver_role || rule.approver_roles?.join(', ') || ''}
                onChange={(e) =>
                  onUpdate({
                    approver_role: e.target.value.includes(',')
                      ? undefined
                      : e.target.value,
                    approver_roles: e.target.value.includes(',')
                      ? e.target.value.split(',').map((r) => r.trim())
                      : undefined,
                  })
                }
                placeholder="head_of_delivery"
              />
            </div>
          )}

          {rule.action === 'REQUIRE_EVIDENCE' && (
            <div className="space-y-2">
              <Label htmlFor={`rule-evidence-${rule.id}`}>
                Required Evidence Type
              </Label>
              <Input
                id={`rule-evidence-${rule.id}`}
                value={rule.required_evidence_type || ''}
                onChange={(e) =>
                  onUpdate({ required_evidence_type: e.target.value })
                }
                placeholder="certification_document"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
