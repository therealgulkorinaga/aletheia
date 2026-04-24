import { NextRequest, NextResponse } from 'next/server'
import { mockSignIn } from '@/lib/auth/mock'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const user = await mockSignIn(email, password)

    return NextResponse.json({ user, success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Authentication failed' },
      { status: 401 }
    )
  }
}
