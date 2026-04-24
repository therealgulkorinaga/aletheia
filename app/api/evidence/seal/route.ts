import { NextRequest, NextResponse } from 'next/server'
import { sealEvidence } from '@/lib/mock-data/ledger'
import { updateWorkflow } from '@/lib/mock-data/workflows'

export async function POST(request: NextRequest) {
  try {
    const { workflowId, content } = await request.json()

    // Seal the evidence
    const evidence = await sealEvidence(workflowId, content)

    // Update workflow status to DISPATCHED
    updateWorkflow(workflowId, { status: 'DISPATCHED' })

    return NextResponse.json(evidence)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to seal evidence' },
      { status: 500 }
    )
  }
}
