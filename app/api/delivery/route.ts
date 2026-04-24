import { NextRequest, NextResponse } from 'next/server'
import { getAllDeliveryAttempts, getDeliveryAttemptsByWorkflow } from '@/lib/mock-data/execution'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const workflowId = searchParams.get('workflow_id')

  if (workflowId) {
    const attempts = getDeliveryAttemptsByWorkflow(workflowId)
    return NextResponse.json(attempts)
  }

  const allAttempts = getAllDeliveryAttempts()
  return NextResponse.json(allAttempts)
}
