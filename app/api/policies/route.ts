import { NextRequest, NextResponse } from 'next/server'
import { getAllPolicies, createPolicy } from '@/lib/mock-data/policies'

export async function GET() {
  const policies = getAllPolicies()
  return NextResponse.json(policies)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newPolicy = createPolicy(body)
    return NextResponse.json(newPolicy, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create policy' },
      { status: 500 }
    )
  }
}
