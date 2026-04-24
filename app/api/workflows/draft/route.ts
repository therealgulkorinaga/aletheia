import { NextRequest, NextResponse } from 'next/server'
import { draftAnswers, checkPolicyFlags } from '@/lib/mock-data/workflows'

export async function POST(request: NextRequest) {
  try {
    const { questions } = await request.json()
    let drafts = draftAnswers(questions)
    drafts = checkPolicyFlags(drafts)
    return NextResponse.json({ results: drafts })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to draft answers' },
      { status: 500 }
    )
  }
}
