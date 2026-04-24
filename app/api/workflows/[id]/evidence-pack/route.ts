import { NextRequest, NextResponse } from 'next/server'
import { renderToStream } from '@react-pdf/renderer'
import { getWorkflowById } from '@/lib/mock-data/workflows'
import { getApprovalsByWorkflowStepId } from '@/lib/mock-data/workflows'
import { getLedgerEntriesByWorkflowId } from '@/lib/mock-data/ledger'
import { EvidencePackDocument } from '@/components/pdf/EvidencePackDocument'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workflow = getWorkflowById(params.id)
    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    // Get approvals for all steps
    const approvals = workflow.steps
      .map((step: any) => getApprovalsByWorkflowStepId(step.id))
      .flat()

    // Get ledger entries
    const ledgerEntries = getLedgerEntriesByWorkflowId(params.id)

    // Render PDF
    const stream = await renderToStream(
      <EvidencePackDocument
        workflow={workflow}
        approvals={approvals}
        ledgerEntries={ledgerEntries}
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
        'Content-Disposition': `attachment; filename="evidence-pack-${params.id}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Failed to generate evidence pack:', error)
    return NextResponse.json(
      { error: 'Failed to generate evidence pack' },
      { status: 500 }
    )
  }
}
