'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Mail,
  TrendingUp,
  Webhook,
  FileCheck,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Trophy,
  ThumbsDown,
} from 'lucide-react'

const channelIcons: Record<string, any> = {
  EMAIL: Mail,
  CRM: TrendingUp,
  WEBHOOK: Webhook,
  PORTAL: FileCheck,
  DOCUSIGN: FileCheck,
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-800 border-gray-200',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-200',
  DELIVERED: 'bg-green-100 text-green-800 border-green-200',
  OPENED: 'bg-purple-100 text-purple-800 border-purple-200',
  FAILED: 'bg-red-100 text-red-800 border-red-200',
  BOUNCED: 'bg-orange-100 text-orange-800 border-orange-200',
}

const outcomeColors: Record<string, string> = {
  WON: 'bg-green-100 text-green-800 border-green-200',
  LOST: 'bg-red-100 text-red-800 border-red-200',
  PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
  NO_RESPONSE: 'bg-gray-100 text-gray-800 border-gray-200',
}

export default function ExecutionPage() {
  const [deliveries, setDeliveries] = useState<any[]>([])
  const [workflows, setWorkflows] = useState<any[]>([])
  const [integrations, setIntegrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [deliveriesRes, workflowsRes, integrationsRes] = await Promise.all([
        fetch('/api/delivery'),
        fetch('/api/workflows'),
        fetch('/api/integrations'),
      ])

      const deliveriesData = await deliveriesRes.json()
      const workflowsData = await workflowsRes.json()
      const integrationsData = await integrationsRes.json()

      setDeliveries(deliveriesData)
      setWorkflows(workflowsData)
      setIntegrations(integrationsData)
    } catch (error) {
      console.error('Failed to fetch execution data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleIntegration = async (id: string, enabled: boolean) => {
    try {
      await fetch('/api/integrations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, enabled }),
      })
      fetchData()
    } catch (error) {
      console.error('Failed to toggle integration:', error)
    }
  }

  const metrics = {
    totalDeliveries: deliveries.length,
    delivered: deliveries.filter((d) => d.status === 'DELIVERED' || d.status === 'OPENED').length,
    inProgress: deliveries.filter((d) => d.status === 'IN_PROGRESS').length,
    failed: deliveries.filter((d) => d.status === 'FAILED' || d.status === 'BOUNCED').length,
  }

  const dispatchedWorkflows = workflows.filter((w) => w.status === 'DISPATCHED')

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-4xl font-bold text-slate-900 mb-2"
          style={{ fontFamily: 'Crimson Pro, serif' }}
        >
          Execution & Delivery
        </h1>
        <p className="text-slate-600">Track workflow delivery and outcomes</p>
      </div>

      {/* Metrics */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-white border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Deliveries
            </CardTitle>
            <Mail className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 font-mono">
              {loading ? '...' : metrics.totalDeliveries}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Delivered
            </CardTitle>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 font-mono">
              {loading ? '...' : metrics.delivered}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              In Progress
            </CardTitle>
            <Clock className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 font-mono">
              {loading ? '...' : metrics.inProgress}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Failed</CardTitle>
            <XCircle className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 font-mono">
              {loading ? '...' : metrics.failed}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Deliveries */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Crimson Pro, serif' }}>
            Recent Deliveries
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-slate-500">Loading...</div>
          ) : deliveries.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No deliveries yet</p>
              <p className="text-sm text-slate-400 mt-2">
                Dispatch approved workflows to see delivery tracking
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workflow</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Delivered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliveries.slice(0, 10).map((delivery) => {
                  const workflow = workflows.find((w) => w.id === delivery.workflow_id)
                  const Icon = channelIcons[delivery.channel] || Mail

                  return (
                    <TableRow key={delivery.id}>
                      <TableCell className="font-medium">
                        {workflow?.subject || delivery.workflow_id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-slate-500" />
                          <span className="text-sm">{delivery.channel}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {delivery.recipient}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[delivery.status]}>
                          {delivery.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {new Date(delivery.sent_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {delivery.delivered_at
                          ? new Date(delivery.delivered_at).toLocaleString()
                          : '-'}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Crimson Pro, serif' }}>
            Integration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {integrations.map((integration) => {
              const Icon = channelIcons[integration.type] || Mail
              return (
                <div
                  key={integration.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="font-medium text-slate-900">{integration.name}</p>
                      <p className="text-xs text-slate-500">{integration.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={
                        integration.enabled
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : 'bg-gray-100 text-gray-800 border-gray-200'
                      }
                    >
                      {integration.enabled ? 'Active' : 'Disabled'}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleToggleIntegration(integration.id, !integration.enabled)
                      }
                    >
                      {integration.enabled ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Dispatched Workflows */}
      {dispatchedWorkflows.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Crimson Pro, serif' }}>
              Dispatched Workflows
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Dispatched</TableHead>
                  <TableHead>Deliveries</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dispatchedWorkflows.map((workflow) => {
                  const workflowDeliveries = deliveries.filter(
                    (d) => d.workflow_id === workflow.id
                  )
                  return (
                    <TableRow key={workflow.id}>
                      <TableCell className="font-medium">{workflow.subject}</TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {workflow.completed_at
                          ? new Date(workflow.completed_at).toLocaleDateString()
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {workflowDeliveries.map((d) => {
                            const Icon = channelIcons[d.channel] || Mail
                            return (
                              <div
                                key={d.id}
                                className={`p-1 rounded ${
                                  d.status === 'DELIVERED' || d.status === 'OPENED'
                                    ? 'bg-green-100'
                                    : d.status === 'FAILED'
                                    ? 'bg-red-100'
                                    : 'bg-blue-100'
                                }`}
                              >
                                <Icon className="w-3 h-3" />
                              </div>
                            )
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
