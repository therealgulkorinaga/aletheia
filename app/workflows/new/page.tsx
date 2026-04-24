'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RFPQuestion, PolicyFlag } from '@/lib/types/workflow'
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertTriangle,
  FileWarning,
  Upload,
  CheckCircle2,
} from 'lucide-react'

const SAMPLE_QUESTIONS = `What is your platform's uptime SLA?
Do you support SOC 2 compliance?
Will your product support custom workflow builders by Q3 next year?
What is your data retention policy?
Can you commit to 99.99% availability?`

const STEPS = [
  { id: 1, name: 'Ingest RFP', description: 'Paste RFP questions' },
  { id: 2, name: 'AI Classification', description: 'Risk assessment' },
  { id: 3, name: 'AI Drafts', description: 'Generated answers' },
  { id: 4, name: 'Evidence', description: 'Attach documents' },
  { id: 5, name: 'Submit', description: 'For approval' },
]

export default function NewWorkflowPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [subject, setSubject] = useState('')
  const [questionsText, setQuestionsText] = useState('')
  const [questions, setQuestions] = useState<RFPQuestion[]>([])
  const [loading, setLoading] = useState(false)
  const [evidenceFiles, setEvidenceFiles] = useState<Record<string, File>>({})

  // Step 1: Ingest RFP
  const handleIngest = () => {
    const questionsList = questionsText
      .split('\n')
      .filter((q) => q.trim())
      .map((q, idx) => ({
        id: `q-${idx + 1}`,
        question: q.trim(),
        risk: 'LOW' as const,
        draft: '',
        flags: [],
      }))

    setQuestions(questionsList)
    setCurrentStep(2)
  }

  // Step 2: AI Classification
  const handleClassification = async () => {
    setLoading(true)

    // Simulate AI delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    try {
      const response = await fetch('/api/workflows/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: questions.map((q) => q.question) }),
      })

      const data = await response.json()
      const classified = questions.map((q, idx) => ({
        ...q,
        risk: data.results[idx].risk,
      }))

      setQuestions(classified)
      setCurrentStep(3)
    } catch (error) {
      console.error('Classification failed:', error)
    } finally {
      setLoading(false)
    }
  }

  // Step 3: AI Drafting
  const handleDrafting = async () => {
    setLoading(true)

    // Simulate AI delay
    await new Promise((resolve) => setTimeout(resolve, 2500))

    try {
      const response = await fetch('/api/workflows/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions }),
      })

      const data = await response.json()
      setQuestions(data.results)
      setCurrentStep(4)
    } catch (error) {
      console.error('Drafting failed:', error)
    } finally {
      setLoading(false)
    }
  }

  // Step 4: Evidence Upload
  const handleEvidenceUpload = (questionId: string, file: File) => {
    setEvidenceFiles({ ...evidenceFiles, [questionId]: file })
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, evidenceAttached: true } : q
      )
    )
  }

  // Step 5: Submit for Approval
  const handleSubmit = async () => {
    setLoading(true)

    try {
      // Determine workflow status based on approval needs
      const needsApproval = questions.some((q) =>
        q.flags.some((f) => f.action === 'REQUIRE_APPROVAL')
      )

      // Create workflow
      const workflow = {
        type: 'RFP_RESPONSE',
        status: needsApproval ? 'APPROVALS_PENDING' : 'APPROVED',
        subject,
        created_by: 'mock-operator-uuid',
        questions,
        steps: [
          {
            id: 'step-1',
            workflow_id: '',
            sequence: 1,
            name: 'Ingest RFP',
            type: 'INGEST',
            status: 'COMPLETED',
            output: { questions: questions.map((q) => q.question) },
            created_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
          },
          {
            id: 'step-2',
            workflow_id: '',
            sequence: 2,
            name: 'AI Classification',
            type: 'CLASSIFICATION',
            status: 'COMPLETED',
            output: { classified: questions },
            created_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
          },
          {
            id: 'step-3',
            workflow_id: '',
            sequence: 3,
            name: 'AI Drafting',
            type: 'DRAFTING',
            status: 'COMPLETED',
            output: { drafts: questions },
            created_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
          },
          {
            id: 'step-4',
            workflow_id: '',
            sequence: 4,
            name: 'Evidence Collection',
            type: 'EVIDENCE',
            status: 'COMPLETED',
            output: { evidence: evidenceFiles },
            created_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
          },
          {
            id: 'step-5',
            workflow_id: '',
            sequence: 5,
            name: 'Approval Submission',
            type: 'APPROVAL_SUBMISSION',
            status: 'COMPLETED',
            output: { submitted: true },
            created_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
          },
        ],
      }

      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflow),
      })

      const created = await response.json()
      router.push(`/workflows/${created.id}`)
    } catch (error) {
      console.error('Submission failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Crimson Pro, serif' }}>
                Ingest RFP Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject / Customer Name</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Acme Corp RFP - Q1 2026"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="questions">
                  RFP Questions (one per line)
                </Label>
                <Textarea
                  id="questions"
                  value={questionsText}
                  onChange={(e) => setQuestionsText(e.target.value)}
                  placeholder="What is your platform's uptime SLA?&#10;Do you support SOC 2 compliance?"
                  rows={10}
                />
              </div>

              <Button
                variant="outline"
                onClick={() => setQuestionsText(SAMPLE_QUESTIONS)}
              >
                Use Sample Data
              </Button>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Crimson Pro, serif' }}>
                AI Classification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                  <span className="ml-3 text-slate-600">
                    Classifying questions...
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  {questions.map((q) => (
                    <div
                      key={q.id}
                      className="p-4 border border-slate-200 rounded"
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium flex-1">{q.question}</p>
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
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Crimson Pro, serif' }}>
                AI-Drafted Answers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                  <span className="ml-3 text-slate-600">
                    Drafting answers and checking policies...
                  </span>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((q) => (
                    <div
                      key={q.id}
                      className="border border-slate-200 rounded overflow-hidden"
                    >
                      <div className="bg-slate-50 p-3 border-b border-slate-200">
                        <p className="text-sm font-medium">{q.question}</p>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="bg-white border border-slate-200 rounded p-3">
                          <p className="text-sm text-slate-700">{q.draft}</p>
                        </div>

                        {q.flags.length > 0 && (
                          <div className="space-y-2">
                            {q.flags.map((flag, idx) => (
                              <PolicyFlagBadge key={idx} flag={flag} />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )

      case 4:
        const evidenceRequired = questions.filter((q) =>
          q.flags.some((f) => f.action === 'REQUIRE_EVIDENCE')
        )

        return (
          <Card>
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Crimson Pro, serif' }}>
                Collect Evidence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {evidenceRequired.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p>No evidence required for this workflow</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {evidenceRequired.map((q) => {
                    const evidenceFlag = q.flags.find(
                      (f) => f.action === 'REQUIRE_EVIDENCE'
                    )
                    return (
                      <div
                        key={q.id}
                        className="border border-slate-200 rounded p-4"
                      >
                        <p className="text-sm font-medium mb-2">{q.question}</p>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge
                            variant="outline"
                            className="bg-blue-100 text-blue-800 border-blue-200"
                          >
                            Evidence Required: {evidenceFlag?.ruleName}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`evidence-${q.id}`}>
                            Upload Document
                          </Label>
                          <Input
                            id={`evidence-${q.id}`}
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleEvidenceUpload(q.id, file)
                            }}
                          />
                          {q.evidenceAttached && (
                            <p className="text-xs text-green-600 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Document attached
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )

      case 5:
        const approvalCount = questions.filter((q) =>
          q.flags.some((f) => f.action === 'REQUIRE_APPROVAL')
        ).length
        const evidenceCount = questions.filter((q) =>
          q.flags.some((f) => f.action === 'REQUIRE_EVIDENCE')
        ).length

        const requiredApprovers = new Set<string>()
        questions.forEach((q) => {
          q.flags.forEach((flag) => {
            if (flag.action === 'REQUIRE_APPROVAL') {
              if (flag.ruleName.includes('delivery'))
                requiredApprovers.add('Head of Delivery')
              if (flag.ruleName.includes('product'))
                requiredApprovers.add('Head of Product')
              if (flag.ruleName.includes('legal'))
                requiredApprovers.add('General Counsel')
            }
          })
        })

        return (
          <Card>
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Crimson Pro, serif' }}>
                Submit for Approval
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded p-6 space-y-4">
                <h3 className="font-semibold text-lg">Workflow Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Subject</p>
                    <p className="font-medium">{subject}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Questions Processed</p>
                    <p className="font-medium font-mono">{questions.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Requiring Approval</p>
                    <p className="font-medium font-mono text-amber-600">
                      {approvalCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Evidence Attached</p>
                    <p className="font-medium font-mono text-blue-600">
                      {evidenceCount} {evidenceCount > 0 && '✓'}
                    </p>
                  </div>
                </div>
              </div>

              {requiredApprovers.size > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Required Approvers:</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(requiredApprovers).map((approver) => (
                      <Badge
                        key={approver}
                        variant="outline"
                        className="bg-amber-50 text-amber-800 border-amber-200"
                      >
                        {approver}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-1">Ready to submit</p>
                    <p>
                      This workflow will be sent for approval. Approvers will be
                      notified via their approval inbox.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return subject.trim() && questionsText.trim()
      case 2:
        return !loading
      case 3:
        return !loading
      case 4:
        const evidenceRequired = questions.filter((q) =>
          q.flags.some((f) => f.action === 'REQUIRE_EVIDENCE')
        )
        return evidenceRequired.every((q) => q.evidenceAttached)
      case 5:
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    switch (currentStep) {
      case 1:
        handleIngest()
        break
      case 2:
        handleClassification()
        break
      case 3:
        handleDrafting()
        break
      case 4:
        setCurrentStep(5)
        break
      case 5:
        handleSubmit()
        break
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-4xl font-bold text-slate-900 mb-2"
          style={{ fontFamily: 'Crimson Pro, serif' }}
        >
          New RFP Response
        </h1>
        <p className="text-slate-600">Create a governed RFP response workflow</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {STEPS.map((step, idx) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep === step.id
                    ? 'bg-slate-800 text-white'
                    : currentStep > step.id
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {currentStep > step.id ? '✓' : step.id}
              </div>
              <div className="text-center mt-2">
                <p className="text-xs font-medium">{step.name}</p>
                <p className="text-xs text-slate-500">{step.description}</p>
              </div>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`w-24 h-0.5 mx-2 ${
                  currentStep > step.id ? 'bg-green-500' : 'bg-slate-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {renderStep()}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6">
        <Button
          variant="outline"
          onClick={() =>
            currentStep > 1
              ? setCurrentStep(currentStep - 1)
              : router.push('/workflows')
          }
          disabled={loading}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          {currentStep === 1 ? 'Cancel' : 'Back'}
        </Button>

        <Button
          onClick={handleNext}
          disabled={!canProceed() || loading}
          className="bg-slate-800 hover:bg-slate-900"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : currentStep === 5 ? (
            <>
              Submit for Approval
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

function PolicyFlagBadge({ flag }: { flag: PolicyFlag }) {
  const colors = {
    REQUIRE_APPROVAL: 'bg-amber-100 text-amber-800 border-amber-200',
    REQUIRE_EVIDENCE: 'bg-blue-100 text-blue-800 border-blue-200',
    BLOCK: 'bg-red-100 text-red-800 border-red-200',
    ESCALATE: 'bg-purple-100 text-purple-800 border-purple-200',
  }

  const icons = {
    REQUIRE_APPROVAL: AlertTriangle,
    REQUIRE_EVIDENCE: FileWarning,
    BLOCK: AlertTriangle,
    ESCALATE: AlertTriangle,
  }

  const Icon = icons[flag.action as keyof typeof icons] || AlertTriangle

  return (
    <div
      className={`flex items-start gap-2 p-3 rounded border ${
        colors[flag.action as keyof typeof colors] || 'bg-gray-100'
      }`}
    >
      <Icon className="w-4 h-4 mt-0.5" />
      <div className="flex-1 text-xs">
        <p className="font-medium">{flag.ruleName}</p>
        <p className="mt-1">{flag.reason}</p>
      </div>
    </div>
  )
}
