import { NextRequest, NextResponse } from 'next/server'
import { recordOutcome, getOutcomeByWorkflow } from '@/lib/mock-data/execution'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const outcome = getOutcomeByWorkflow(params.id)
  return NextResponse.json(outcome || null)
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { outcome, contract_value, win_reason, loss_reason, customer_feedback, recorded_by } =
      await request.json()

    const workflowOutcome = await recordOutcome(params.id, outcome, {
      contract_value,
      win_reason,
      loss_reason,
      customer_feedback,
      recorded_by,
    })

    return NextResponse.json(workflowOutcome)
  } catch (error) {
    console.error('Failed to record outcome:', error)
    return NextResponse.json(
      { error: 'Failed to record outcome' },
      { status: 500 }
    )
  }
}
