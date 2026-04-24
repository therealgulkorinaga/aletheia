export type LedgerEventType =
  | 'WORKFLOW_CREATED'
  | 'STEP_COMPLETED'
  | 'AUTHORITY_CHECK_PERFORMED'
  | 'APPROVAL_GRANTED'
  | 'APPROVAL_REJECTED'
  | 'APPROVAL_CHANGES_REQUESTED'
  | 'EVIDENCE_SEALED'
  | 'WORKFLOW_DISPATCHED'
  | 'OUTCOME_RECORDED'

export interface LedgerEntry {
  id: string
  sequence: number
  event_type: LedgerEventType
  workflow_id?: string
  payload: any
  payload_hash: string
  previous_hash: string | null
  chain_hash: string
  created_at: string
}

export interface Evidence {
  id: string
  workflow_id: string
  type: string
  content_hash: string
  content_snapshot: any
  created_at: string
}
