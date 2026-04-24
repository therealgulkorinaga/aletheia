import { LedgerEntry, LedgerEventType, Evidence } from '@/lib/types/ledger'

// In-memory storage
let ledgerEntries: LedgerEntry[] = []
let evidenceRecords: Evidence[] = []
let sequenceCounter = 0

// Cryptographic functions
export async function computeHash(data: any): Promise<string> {
  const jsonString = JSON.stringify(data)
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(jsonString)
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return `sha256:${hashHex}`
}

export async function createLedgerEntry(
  eventType: LedgerEventType,
  payload: any,
  workflowId?: string
): Promise<LedgerEntry> {
  sequenceCounter++

  const payloadHash = await computeHash(payload)
  const previousEntry = ledgerEntries[ledgerEntries.length - 1]
  const previousHash = previousEntry ? previousEntry.chain_hash : null

  const chainData = {
    sequence: sequenceCounter,
    payload_hash: payloadHash,
    previous_hash: previousHash,
  }
  const chainHash = await computeHash(chainData)

  const entry: LedgerEntry = {
    id: `ledger-${Date.now()}-${sequenceCounter}`,
    sequence: sequenceCounter,
    event_type: eventType,
    workflow_id: workflowId,
    payload,
    payload_hash: payloadHash,
    previous_hash: previousHash,
    chain_hash: chainHash,
    created_at: new Date().toISOString(),
  }

  ledgerEntries.push(entry)
  return entry
}

export function getAllLedgerEntries(): LedgerEntry[] {
  return ledgerEntries
}

export function getLedgerEntries(): LedgerEntry[] {
  return ledgerEntries
}

export function getLedgerEntriesByWorkflow(workflowId: string): LedgerEntry[] {
  return ledgerEntries.filter((e) => e.workflow_id === workflowId)
}

export function getLedgerEntriesByWorkflowId(workflowId: string): LedgerEntry[] {
  return ledgerEntries.filter((e) => e.workflow_id === workflowId)
}

export async function verifyChainIntegrity(): Promise<{
  valid: boolean
  errors: string[]
}> {
  const errors: string[] = []

  for (let i = 0; i < ledgerEntries.length; i++) {
    const entry = ledgerEntries[i]

    // Verify sequence
    if (entry.sequence !== i + 1) {
      errors.push(`Entry ${entry.id}: sequence mismatch (expected ${i + 1}, got ${entry.sequence})`)
    }

    // Verify payload hash
    const computedPayloadHash = await computeHash(entry.payload)
    if (computedPayloadHash !== entry.payload_hash) {
      errors.push(`Entry ${entry.id}: payload hash mismatch`)
    }

    // Verify previous hash
    if (i === 0) {
      if (entry.previous_hash !== null) {
        errors.push(`Entry ${entry.id}: first entry should have null previous_hash`)
      }
    } else {
      const prevEntry = ledgerEntries[i - 1]
      if (entry.previous_hash !== prevEntry.chain_hash) {
        errors.push(`Entry ${entry.id}: previous_hash mismatch`)
      }
    }

    // Verify chain hash
    const chainData = {
      sequence: entry.sequence,
      payload_hash: entry.payload_hash,
      previous_hash: entry.previous_hash,
    }
    const computedChainHash = await computeHash(chainData)
    if (computedChainHash !== entry.chain_hash) {
      errors.push(`Entry ${entry.id}: chain_hash mismatch`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// Evidence sealing
export async function sealEvidence(
  workflowId: string,
  content: any
): Promise<Evidence> {
  const contentHash = await computeHash(content)

  const evidence: Evidence = {
    id: `evidence-${Date.now()}`,
    workflow_id: workflowId,
    type: 'workflow_artefact',
    content_hash: contentHash,
    content_snapshot: content,
    created_at: new Date().toISOString(),
  }

  evidenceRecords.push(evidence)

  // Create ledger entry
  await createLedgerEntry(
    'EVIDENCE_SEALED',
    {
      evidence_id: evidence.id,
      content_hash: contentHash,
      workflow_id: workflowId,
    },
    workflowId
  )

  return evidence
}

export function getEvidenceByWorkflow(workflowId: string): Evidence | undefined {
  return evidenceRecords.find((e) => e.workflow_id === workflowId)
}

export function getAllEvidence(): Evidence[] {
  return evidenceRecords
}
