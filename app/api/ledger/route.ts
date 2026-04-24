import { NextResponse } from 'next/server'
import { getAllLedgerEntries } from '@/lib/mock-data/ledger'

export async function GET() {
  const entries = getAllLedgerEntries()
  return NextResponse.json(entries)
}
