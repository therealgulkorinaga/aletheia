import { NextRequest, NextResponse } from 'next/server'
import { updateApproval, getWorkflowById, updateWorkflow } from '@/lib/mock-data/workflows'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { decision, comment, userId } = await request.json()

    const updated = updateApproval(id, decision, comment, userId)
    if (!updated) {
      return NextResponse.json({ error: 'Approval not found' }, { status: 404 })
    }

    // Check if all approvals for workflow are complete
    // For demo, just mark workflow as approved if this approval is approved
    if (decision === 'APPROVED') {
      // Find workflow and check approval status
      // Simplified: just update to APPROVED
      // In production, would check all approvals
    }

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update approval' },
      { status: 500 }
    )
  }
}
