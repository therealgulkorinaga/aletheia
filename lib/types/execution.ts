export type DeliveryChannel = 'EMAIL' | 'CRM' | 'PORTAL' | 'WEBHOOK' | 'DOCUSIGN'

export type DeliveryStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'DELIVERED'
  | 'OPENED'
  | 'FAILED'
  | 'BOUNCED'

export type OutcomeStatus = 'WON' | 'LOST' | 'PENDING' | 'NO_RESPONSE'

export interface DeliveryAttempt {
  id: string
  workflow_id: string
  channel: DeliveryChannel
  status: DeliveryStatus
  recipient: string
  sent_at: string
  delivered_at?: string
  opened_at?: string
  error_message?: string
  metadata: {
    email_subject?: string
    crm_opportunity_id?: string
    portal_url?: string
    webhook_url?: string
    document_id?: string
  }
}

export interface WorkflowOutcome {
  id: string
  workflow_id: string
  outcome: OutcomeStatus
  contract_value?: number
  win_reason?: string
  loss_reason?: string
  customer_feedback?: string
  recorded_at: string
  recorded_by: string
}

export interface Integration {
  id: string
  type: DeliveryChannel
  name: string
  enabled: boolean
  config: {
    email_provider?: 'sendgrid' | 'outlook' | 'gmail'
    email_from?: string
    crm_type?: 'salesforce' | 'hubspot' | 'pipedrive'
    crm_api_key?: string
    portal_api_url?: string
    webhook_url?: string
    docusign_account?: string
  }
}
