import { NextRequest, NextResponse } from 'next/server'
import { getAllIntegrations, updateIntegration } from '@/lib/mock-data/execution'

export async function GET() {
  const integrations = getAllIntegrations()
  return NextResponse.json(integrations)
}

export async function PUT(request: NextRequest) {
  try {
    const { id, enabled, config } = await request.json()

    const updated = updateIntegration(id, { enabled, config })

    if (!updated) {
      return NextResponse.json({ error: 'Integration not found' }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update integration' },
      { status: 500 }
    )
  }
}
