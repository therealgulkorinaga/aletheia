'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CheckCircle, XCircle, MessageSquare, Clock, Inbox } from 'lucide-react'

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<any[]>([])
  const [workflows, setWorkflows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApproval, setSelectedApproval] = useState<any>(null)
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null)
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchApprovals()
  }, [])

  useEffect(() => {
    if (selectedApproval) {
      fetchWorkflowForApproval(selectedApproval)
    }
  }, [selectedApproval])

  const fetchApprovals = async () => {
    try {
      // For demo, hardcode role - in production would get from user session
      const approvalsRes = await fetch('/api/approvals?role=head_of_delivery')
      const approvalsData = await approvalsRes.json()
      setApprovals(approvalsData)

      // Fetch all workflows for displaying workflow info
      const workflowsRes = await fetch('/api/workflows')
      const workflowsData = await workflowsRes.json()
      setWorkflows(workflowsData)
    } catch (error) {
      console.error('Failed to fetch approvals:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchWorkflowForApproval = (approval: any) => {
    const workflow = workflows.find((w: any) =>
      w.steps?.some((s: any) => s.id === approval.workflow_step_id)
    )

    if (workflow) {
      setSelectedWorkflow(workflow)

      // Find the specific question
      const question = workflow.questions?.find((q: any) => q.id === approval.question_id)
      setSelectedQuestion(question)
    }
  }

  const getWorkflowForApproval = (approval: any) => {
    return workflows.find((w: any) =>
      w.steps?.some((s: any) => s.id === approval.workflow_step_id)
    )
  }

  const getQuestionForApproval = (approval: any) => {
    const workflow = getWorkflowForApproval(approval)
    if (!workflow) return null
    return workflow.questions?.find((q: any) => q.id === approval.question_id)
  }

  const handleDecision = async (decision: string) => {
    if (!selectedApproval) return
    if (!comment.trim() && decision !== 'APPROVED') {
      alert('Please provide a comment for rejection or change requests')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch(`/api/approvals/${selectedApproval.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          comment: comment.trim(),
          userId: 'mock-approver-uuid',
        }),
      })

      if (response.ok) {
        // Update workflow status if all approvals are complete
        if (decision === 'APPROVED' && selectedWorkflow) {
          // Check if this was the last pending approval for this workflow
          const workflowApprovals = approvals.filter((a) =>
            selectedWorkflow.steps?.some((s: any) => s.id === a.workflow_step_id)
          )
          const allApproved = workflowApprovals.every((a) =>
            a.id === selectedApproval.id ? true : a.decision === 'APPROVED'
          )

          if (allApproved) {
            // Update workflow status to APPROVED
            await fetch(`/api/workflows/${selectedWorkflow.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'APPROVED' }),
            })
          }
        }

        alert(`Decision recorded: ${decision}`)
        setSelectedApproval(null)
        setSelectedWorkflow(null)
        setSelectedQuestion(null)
        setComment('')
        fetchApprovals()
      }
    } catch (error) {
      console.error('Failed to submit decision:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-500">Loading approvals...</p>
      </div>
    )
  }

  if (selectedApproval) {
    return (
      <div className="space-y-6">
        <div>
          <Button variant="outline" onClick={() => setSelectedApproval(null)} className="mb-4">
            ← Back to Inbox
          </Button>
          <h1
            className="text-4xl font-bold text-slate-900 mb-2"
            style={{ fontFamily: 'Crimson Pro, serif' }}
          >
            Review Approval Request
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Crimson Pro, serif' }}>
                  Request Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedWorkflow && (
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Workflow:</p>
                    <p className="font-medium text-slate-900">{selectedWorkflow.subject}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-slate-600 mb-2">Question:</p>
                  <p className="font-medium">
                    {selectedQuestion?.question || 'Loading...'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-600 mb-2">Drafted Answer:</p>
                  <div className="bg-slate-50 border border-slate-200 rounded p-4">
                    <p className="text-sm">
                      {selectedQuestion?.draft || 'Loading...'}
                    </p>
                  </div>
                </div>

                {selectedQuestion?.flags && selectedQuestion.flags.length > 0 && (
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Policy Flags:</p>
                    {selectedQuestion.flags.map((flag: any, idx: number) => (
                      <div key={idx} className="bg-amber-50 border border-amber-200 rounded p-3 mb-2">
                        <p className="font-medium text-amber-900">
                          {flag.ruleName}
                        </p>
                        <p className="text-sm text-amber-700 mt-1">
                          Severity: {flag.severity}
                        </p>
                        {flag.matchedPatterns && flag.matchedPatterns.length > 0 && (
                          <p className="text-sm text-amber-700">
                            Matched: {flag.matchedPatterns.join(', ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <p className="text-sm text-slate-600 mb-2">Evidence:</p>
                  <p className="text-xs text-slate-500">
                    {selectedQuestion?.evidenceAttached ? 'Evidence attached ✓' : 'No evidence attached'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Decision Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Crimson Pro, serif' }}>
                  Make Decision
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="comment">Comment (required for rejection)</Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Enter your decision comment..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleDecision('APPROVED')}
                    disabled={submitting}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleDecision('CHANGES_REQUESTED')}
                    disabled={submitting || !comment.trim()}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Request Changes
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleDecision('REJECTED')}
                    disabled={submitting || !comment.trim()}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>

                {submitting && (
                  <p className="text-sm text-center text-slate-500">Submitting...</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-4xl font-bold text-slate-900 mb-2"
          style={{ fontFamily: 'Crimson Pro, serif' }}
        >
          Approval Inbox
        </h1>
        <p className="text-slate-600">
          Review and approve pending workflow decisions
        </p>
      </div>

      {approvals.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-2">No pending approvals</p>
            <p className="text-sm text-slate-400">
              Create a workflow as an Operator to see approval requests here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {approvals.map((approval) => {
            const workflow = getWorkflowForApproval(approval)
            const question = getQuestionForApproval(approval)
            const flagForApproval = question?.flags?.find((f: any) => f.ruleId === approval.policy_rule_id)

            return (
              <Card
                key={approval.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedApproval(approval)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="bg-amber-100 text-amber-800">
                          <Clock className="w-3 h-3 mr-1" />
                          PENDING
                        </Badge>
                        {approval.severity && (
                          <Badge
                            variant="outline"
                            className={
                              approval.severity === 'HIGH'
                                ? 'bg-red-100 text-red-800'
                                : approval.severity === 'MEDIUM'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-blue-100 text-blue-800'
                            }
                          >
                            {approval.severity} SEVERITY
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-medium mb-1">
                        {flagForApproval?.ruleName || 'Approval Required'}
                      </h3>
                      <p className="text-sm text-slate-600 mb-2">
                        Workflow: {workflow?.subject || 'Loading...'}
                      </p>
                      <p className="text-xs text-slate-500">
                        Submitted {new Date(approval.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
