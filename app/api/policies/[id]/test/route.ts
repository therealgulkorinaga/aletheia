import { NextRequest, NextResponse } from 'next/server'
import { getPolicyById, testPolicy } from '@/lib/mock-data/policies'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { content } = await request.json()

    const policy = getPolicyById(id)
    if (!policy) {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 })
    }

    const results = testPolicy(policy, content)
    return NextResponse.json({ results })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to test policy' },
      { status: 500 }
    )
  }
}
