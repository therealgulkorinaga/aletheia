import { NextRequest, NextResponse } from 'next/server'
import { seedData } from '@/lib/mock-data/seed'
import { seedEnterpriseWorkflows } from '@/lib/mock-data/seed-enterprise'

export async function POST(request: NextRequest) {
  try {
    const { dataset } = await request.json().catch(() => ({ dataset: 'demo' }))

    if (dataset === 'enterprise') {
      await seedEnterpriseWorkflows()
      return NextResponse.json({
        success: true,
        message: '12 enterprise workflows seeded across multiple use cases',
        workflows: 12,
      })
    } else {
      await seedData()
      return NextResponse.json({
        success: true,
        message: '5 demo workflows seeded with various states',
        workflows: 5,
      })
    }
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Failed to seed data' },
      { status: 500 }
    )
  }
}
