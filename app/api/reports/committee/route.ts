import { NextRequest, NextResponse } from 'next/server'
import { renderToStream } from '@react-pdf/renderer'
import { getAllWorkflows } from '@/lib/mock-data/workflows'
import { getAllApprovals } from '@/lib/mock-data/workflows'
import { getLedgerEntries, verifyChainIntegrity } from '@/lib/mock-data/ledger'
import { CommitteeReportDocument } from '@/components/pdf/CommitteeReportDocument'

export async function GET(request: NextRequest) {
  try {
    const workflows = getAllWorkflows()
    const approvals = getAllApprovals()
    const ledger = getLedgerEntries()

    // Calculate metrics
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const totalWorkflows = workflows.length
    const completedWorkflows = workflows.filter((w) => w.status === 'DISPATCHED').length
    const pendingApprovals = approvals.filter((a) => a.decision === 'PENDING').length

    const exceptions = ledger.filter(
      (e) => e.event_type === 'APPROVAL_GRANTED' && e.payload?.severity === 'HIGH'
    ).length

    // Calculate avg approval time
    const decidedApprovals = approvals.filter((a) => a.decided_at)
    const avgTime =
      decidedApprovals.length > 0
        ? decidedApprovals.reduce((sum, a) => {
            const created = new Date(a.created_at).getTime()
            const decided = new Date(a.decided_at).getTime()
            return sum + (decided - created)
          }, 0) / decidedApprovals.length
        : 0
    const avgApprovalTime = (avgTime / (1000 * 60 * 60)).toFixed(1) + 'h'

    // Verify chain
    const { valid: chainValid } = await verifyChainIntegrity()

    // Render PDF
    const stream = await renderToStream(
      <CommitteeReportDocument
        startDate={thirtyDaysAgo}
        endDate={now}
        metrics={{
          totalWorkflows,
          completedWorkflows,
          pendingApprovals,
          exceptions,
          avgApprovalTime,
        }}
        workflows={workflows}
        approvals={approvals}
        ledger={ledger}
        chainValid={chainValid}
      />
    )

    // Convert stream to buffer
    const chunks: Uint8Array[] = []
    for await (const chunk of stream) {
      chunks.push(chunk)
    }
    const buffer = Buffer.concat(chunks)

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="committee-report-${now.toISOString().split('T')[0]}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Failed to generate committee report:', error)
    return NextResponse.json(
      { error: 'Failed to generate committee report' },
      { status: 500 }
    )
  }
}
