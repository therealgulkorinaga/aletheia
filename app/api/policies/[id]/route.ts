import { NextRequest, NextResponse } from 'next/server'
import { getPolicyById, updatePolicy, deletePolicy } from '@/lib/mock-data/policies'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const policy = getPolicyById(id)

  if (!policy) {
    return NextResponse.json({ error: 'Policy not found' }, { status: 404 })
  }

  return NextResponse.json(policy)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const updated = updatePolicy(id, body)

    if (!updated) {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update policy' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const deleted = deletePolicy(id)

  if (!deleted) {
    return NextResponse.json({ error: 'Policy not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
