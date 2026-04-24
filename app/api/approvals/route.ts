import { NextRequest, NextResponse } from 'next/server'
import { getAllApprovals, getApprovalsByRole } from '@/lib/mock-data/workflows'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const role = searchParams.get('role')

  if (role) {
    const approvals = getApprovalsByRole(role)
    return NextResponse.json(approvals)
  }

  const allApprovals = getAllApprovals()
  return NextResponse.json(allApprovals)
}
