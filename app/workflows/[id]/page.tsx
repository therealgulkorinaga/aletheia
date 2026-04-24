'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Workflow } from '@/lib/types/workflow'
import { CheckCircle2, Clock, AlertTriangle, Download, Send } from 'lucide-react'

const statusColors = {
  INITIATED: 'bg-gray-100 text-gray-800 border-gray-200',
  IN_REVIEW: 'bg-blue-100 text-blue-800 border-blue-200',
  APPROVALS_PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
  APPROVED: 'bg-green-100 text-green-800 border-green-200',
  DISPATCHED: 'bg-slate-100 text-slate-800 border-slate-200',
  BLOCKED: 'bg-red-100 text-red-800 border-red-200',
}

export default function WorkflowDetailPage() {
  const params = useParams()
  const router = useRouter()
  const workflowId = params.id as string

  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [loading, setLoading] = useState(true)
  const [dispatching, setDispatching] = useState(false)

  useEffect(() => {
    fetchWorkflow()
  }, [workflowId])

  const fetchWorkflow = async () => {
    try {
      const response = await fetch(`/api/workflows/${workflowId}`)
      const data = await response.json()
      setWorkflow(data)
    } catch (error) {
      console.error('Failed to fetch workflow:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDispatch = async () => {
    if (!workflow) return

    const confirmed = confirm(
      'Dispatch this workflow?\n\nThis will:\n- Send response via Email\n- Update CRM record\n- Post to Slack\n- Create delivery tracking'
    )

    if (!confirmed) return

    setDispatching(true)
    try {
      const response = await fetch(`/api/workflows/${workflow.id}/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channels: ['EMAIL', 'CRM', 'WEBHOOK'],
          recipient_email: 'customer@example.com',
          crm_opportunity_id: `OPP-${Date.now()}`,
        }),
      })

      if (response.ok) {
        alert('✅ Workflow dispatched successfully!')
        fetchWorkflow() // Refresh to show new status
      }
    } catch (error) {
      console.error('Failed to dispatch:', error)
      alert('❌ Failed to dispatch workflow')
    } finally {
      setDispatching(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-500">Loading workflow...</p>
      </div>
    )
  }

  if (!workflow) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Workflow not found</p>
          <Button variant="outline" onClick={() => router.push('/workflows')}>
            Back to Workflows
          </Button>
        </div>
      </div>
    )
  }

  const questions = workflow.steps
    ?.find((s) => s.type === 'DRAFTING')
    ?.output?.drafts || []

  const approvalCount = questions.filter((q: any) =>
    q.flags?.some((f: any) => f.action === 'REQUIRE_APPROVAL')
  ).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-4xl font-bold text-slate-900 mb-2"
            style={{ fontFamily: 'Crimson Pro, serif' }}
          >
            {workflow.subject}
          </h1>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className={statusColors[workflow.status]}
            >
              {workflow.status.replace('_', ' ')}
            </Badge>
            <span className="text-sm text-slate-500">
              Created {new Date(workflow.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/workflows')}>
            Back
          </Button>
          {workflow.status === 'APPROVED' && (
            <>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleDispatch}
                disabled={dispatching}
              >
                <Send className="w-4 h-4 mr-2" />
                {dispatching ? 'Dispatching...' : 'Dispatch Workflow'}
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  window.open(`/api/workflows/${workflow.id}/evidence-pack`, '_blank')
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Evidence Pack
              </Button>
            </>
          )}
          {workflow.status === 'DISPATCHED' && (
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                window.open(`/api/workflows/${workflow.id}/evidence-pack`, '_blank')
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Evidence Pack
            </Button>
          )}
        </div>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Crimson Pro, serif' }}>
            Workflow Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workflow.steps?.map((step, idx) => (
              <div key={step.id} className="flex items-start gap-4">
                <div className="relative">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.status === 'COMPLETED'
                        ? 'bg-green-500 text-white'
                        : step.status === 'IN_PROGRESS'
                        ? 'bg-blue-500 text-white'
                        : step.status === 'FAILED'
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {step.status === 'COMPLETED' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : step.status === 'FAILED' ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>
                  {idx < (workflow.steps?.length || 0) - 1 && (
                    <div className="absolute top-8 left-4 w-0.5 h-12 bg-slate-200" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="font-medium">{step.name}</h3>
                  <p className="text-sm text-slate-600">
                    {step.status.replace('_', ' ')}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(step.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Approval Status */}
      {workflow.status === 'APPROVALS_PENDING' && (
        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Crimson Pro, serif' }}>
              Approval Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded">
                <div>
                  <p className="font-medium text-amber-900">Pending Approval</p>
                  <p className="text-sm text-amber-700">
                    {approvalCount} items requiring approval
                  </p>
                </div>
                <Badge variant="outline" className="bg-amber-100 text-amber-800">
                  PENDING
                </Badge>
              </div>

              <div className="text-sm text-slate-600">
                <p>Required approvers:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Head of Delivery</li>
                  <li>Head of Product</li>
                  <li>General Counsel</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Questions & Answers */}
      {questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Crimson Pro, serif' }}>
              Questions & Drafted Answers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((q: any, idx: number) => (
              <div
                key={idx}
                className="border border-slate-200 rounded overflow-hidden"
              >
                <div className="bg-slate-50 p-3 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{q.question}</p>
                    <Badge
                      variant="outline"
                      className={
                        q.risk === 'HIGH'
                          ? 'bg-orange-100 text-orange-800 border-orange-200'
                          : q.risk === 'MEDIUM'
                          ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          : 'bg-blue-100 text-blue-800 border-blue-200'
                      }
                    >
                      {q.risk} RISK
                    </Badge>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="bg-white border border-slate-200 rounded p-3">
                    <p className="text-sm text-slate-700">{q.draft}</p>
                  </div>

                  {q.flags && q.flags.length > 0 && (
                    <div className="space-y-2">
                      {q.flags.map((flag: any, flagIdx: number) => (
                        <div
                          key={flagIdx}
                          className="p-3 rounded border bg-amber-50 border-amber-200"
                        >
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-amber-900">
                                {flag.ruleName}
                              </p>
                              <p className="text-xs text-amber-700 mt-1">
                                {flag.reason}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-amber-100 text-amber-800 border-amber-200"
                            >
                              {flag.action.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
