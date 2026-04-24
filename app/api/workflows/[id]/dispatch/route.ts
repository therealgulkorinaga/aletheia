import { NextRequest, NextResponse } from 'next/server'
import { dispatchWorkflow } from '@/lib/mock-data/execution'
import { getWorkflowById } from '@/lib/mock-data/workflows'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workflow = getWorkflowById(params.id)
    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    if (workflow.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'Workflow must be approved before dispatch' },
        { status: 400 }
      )
    }

    const { channels, recipient_email, crm_opportunity_id, portal_url } = await request.json()

    const attempts = await dispatchWorkflow(params.id, channels, {
      recipient_email,
      crm_opportunity_id,
      portal_url,
    })

    return NextResponse.json({
      success: true,
      attempts,
    })
  } catch (error) {
    console.error('Failed to dispatch workflow:', error)
    return NextResponse.json(
      { error: 'Failed to dispatch workflow' },
      { status: 500 }
    )
  }
}
