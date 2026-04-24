import { DeliveryAttempt, WorkflowOutcome, Integration, DeliveryStatus, OutcomeStatus } from '@/lib/types/execution'
import { createLedgerEntry } from './ledger'
import { updateWorkflow } from './workflows'

// In-memory storage
let deliveryAttempts: DeliveryAttempt[] = []
let workflowOutcomes: WorkflowOutcome[] = []
let integrations: Integration[] = [
  {
    id: 'int-email-1',
    type: 'EMAIL',
    name: 'Corporate Email (Outlook)',
    enabled: true,
    config: {
      email_provider: 'outlook',
      email_from: 'rfp-responses@company.com',
    },
  },
  {
    id: 'int-crm-1',
    type: 'CRM',
    name: 'Salesforce Production',
    enabled: true,
    config: {
      crm_type: 'salesforce',
      crm_api_key: 'sk_live_*********************',
    },
  },
  {
    id: 'int-webhook-1',
    type: 'WEBHOOK',
    name: 'Slack Notifications',
    enabled: true,
    config: {
      webhook_url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX',
    },
  },
  {
    id: 'int-docusign-1',
    type: 'DOCUSIGN',
    name: 'DocuSign Enterprise',
    enabled: false,
    config: {
      docusign_account: 'demo-account',
    },
  },
]

export function getAllDeliveryAttempts(): DeliveryAttempt[] {
  return deliveryAttempts
}

export function getDeliveryAttemptsByWorkflow(workflowId: string): DeliveryAttempt[] {
  return deliveryAttempts.filter((d) => d.workflow_id === workflowId)
}

export function getAllOutcomes(): WorkflowOutcome[] {
  return workflowOutcomes
}

export function getOutcomeByWorkflow(workflowId: string): WorkflowOutcome | undefined {
  return workflowOutcomes.find((o) => o.workflow_id === workflowId)
}

export function getAllIntegrations(): Integration[] {
  return integrations
}

export function updateIntegration(id: string, updates: Partial<Integration>): Integration | null {
  const index = integrations.findIndex((i) => i.id === id)
  if (index === -1) return null

  integrations[index] = {
    ...integrations[index],
    ...updates,
  }
  return integrations[index]
}

// Dispatch workflow through selected channels
export async function dispatchWorkflow(
  workflowId: string,
  channels: string[], // channel types: EMAIL, CRM, etc.
  config: {
    recipient_email?: string
    crm_opportunity_id?: string
    portal_url?: string
  }
): Promise<DeliveryAttempt[]> {
  const attempts: DeliveryAttempt[] = []

  for (const channelType of channels) {
    const integration = integrations.find(
      (i) => i.type === channelType && i.enabled
    )

    if (!integration) {
      console.warn(`Integration for ${channelType} not found or disabled`)
      continue
    }

    const attempt: DeliveryAttempt = {
      id: `delivery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      workflow_id: workflowId,
      channel: channelType as any,
      status: 'PENDING',
      recipient: config.recipient_email || 'customer@example.com',
      sent_at: new Date().toISOString(),
      metadata: {},
    }

    // Mock delivery simulation
    switch (channelType) {
      case 'EMAIL':
        attempt.metadata.email_subject = 'RFP Response - [Company Name]'
        attempt.status = 'IN_PROGRESS'
        // Simulate async delivery
        setTimeout(() => {
          attempt.status = 'DELIVERED'
          attempt.delivered_at = new Date().toISOString()
        }, 1000)
        break

      case 'CRM':
        attempt.metadata.crm_opportunity_id = config.crm_opportunity_id || `OPP-${Date.now()}`
        attempt.status = 'DELIVERED'
        attempt.delivered_at = new Date().toISOString()
        break

      case 'WEBHOOK':
        attempt.metadata.webhook_url = integration.config.webhook_url
        attempt.status = 'DELIVERED'
        attempt.delivered_at = new Date().toISOString()
        break

      case 'PORTAL':
        attempt.metadata.portal_url = config.portal_url || 'https://portal.example.com/upload/12345'
        attempt.status = 'IN_PROGRESS'
        break

      case 'DOCUSIGN':
        attempt.metadata.document_id = `DOC-${Date.now()}`
        attempt.status = 'IN_PROGRESS'
        break
    }

    deliveryAttempts.push(attempt)
    attempts.push(attempt)

    // Create ledger entry
    await createLedgerEntry(
      'WORKFLOW_DISPATCHED',
      {
        workflow_id: workflowId,
        delivery_id: attempt.id,
        channel: channelType,
        status: attempt.status,
        recipient: attempt.recipient,
      },
      workflowId
    )
  }

  // Update workflow status
  updateWorkflow(workflowId, { status: 'DISPATCHED' })

  return attempts
}

// Record workflow outcome
export async function recordOutcome(
  workflowId: string,
  outcome: OutcomeStatus,
  details: {
    contract_value?: number
    win_reason?: string
    loss_reason?: string
    customer_feedback?: string
    recorded_by: string
  }
): Promise<WorkflowOutcome> {
  const workflowOutcome: WorkflowOutcome = {
    id: `outcome-${Date.now()}`,
    workflow_id: workflowId,
    outcome,
    contract_value: details.contract_value,
    win_reason: details.win_reason,
    loss_reason: details.loss_reason,
    customer_feedback: details.customer_feedback,
    recorded_at: new Date().toISOString(),
    recorded_by: details.recorded_by,
  }

  workflowOutcomes.push(workflowOutcome)

  // Create ledger entry
  await createLedgerEntry(
    'OUTCOME_RECORDED' as any,
    {
      workflow_id: workflowId,
      outcome,
      contract_value: details.contract_value,
      recorded_by: details.recorded_by,
    },
    workflowId
  )

  return workflowOutcome
}

// Simulate delivery status updates
export function updateDeliveryStatus(
  deliveryId: string,
  status: DeliveryStatus,
  metadata?: { opened_at?: string; error_message?: string }
): DeliveryAttempt | null {
  const index = deliveryAttempts.findIndex((d) => d.id === deliveryId)
  if (index === -1) return null

  deliveryAttempts[index] = {
    ...deliveryAttempts[index],
    status,
    opened_at: metadata?.opened_at,
    error_message: metadata?.error_message,
  }

  return deliveryAttempts[index]
}
