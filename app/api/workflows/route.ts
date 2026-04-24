import { NextRequest, NextResponse } from 'next/server'
import { getAllWorkflows, createWorkflow } from '@/lib/mock-data/workflows'

export async function GET() {
  const workflows = getAllWorkflows()
  return NextResponse.json(workflows)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newWorkflow = createWorkflow(body)
    return NextResponse.json(newWorkflow, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create workflow' },
      { status: 500 }
    )
  }
}
