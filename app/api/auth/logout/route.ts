import { NextResponse } from 'next/server'
import { mockSignOut } from '@/lib/auth/mock'

export async function POST() {
  await mockSignOut()
  return NextResponse.json({ success: true })
}
