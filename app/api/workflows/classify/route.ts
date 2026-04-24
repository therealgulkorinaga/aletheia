import { NextRequest, NextResponse } from 'next/server'
import { classifyQuestions } from '@/lib/mock-data/workflows'

export async function POST(request: NextRequest) {
  try {
    const { questions } = await request.json()
    const classified = classifyQuestions(questions)
    return NextResponse.json({ results: classified })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to classify questions' },
      { status: 500 }
    )
  }
}
