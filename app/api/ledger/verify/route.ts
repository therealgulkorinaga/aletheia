import { NextResponse } from 'next/server'
import { verifyChainIntegrity } from '@/lib/mock-data/ledger'

export async function GET() {
  const result = await verifyChainIntegrity()
  return NextResponse.json(result)
}
