'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, Clock, AlertTriangle, CheckCircle, Download, FileText } from 'lucide-react'

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    workflowsThisMonth: 0,
    pendingApprovals: 0,
    exceptions: 0,
    avgApprovalTime: '0h',
  })
  const [workflowsByStatus, setWorkflowsByStatus] = useState<any>({})
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch workflows
      const workflowsRes = await fetch('/api/workflows')
      const workflows = await workflowsRes.json()

      // Fetch approvals
      const approvalsRes = await fetch('/api/approvals')
      const approvals = await approvalsRes.json()

      // Fetch ledger
      const ledgerRes = await fetch('/api/ledger')
      const ledger = await ledgerRes.json()

      // Calculate metrics
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

      const workflowsThisMonth = workflows.filter((w: any) =>
        new Date(w.created_at) >= thirtyDaysAgo
      ).length

      const pendingApprovals = approvals.filter((a: any) =>
        a.decision === 'PENDING'
      ).length

      // Count exceptions (high severity approvals granted)
      const exceptions = ledger.filter((e: any) =>
        e.event_type === 'APPROVAL_GRANTED' &&
        e.payload?.severity === 'HIGH'
      ).length

      // Calculate avg approval time
      const decidedApprovals = approvals.filter((a: any) => a.decided_at)
      const avgTime = decidedApprovals.length > 0
        ? decidedApprovals.reduce((sum: number, a: any) => {
            const created = new Date(a.created_at).getTime()
            const decided = new Date(a.decided_at).getTime()
            return sum + (decided - created)
          }, 0) / decidedApprovals.length
        : 0
      const avgHours = (avgTime / (1000 * 60 * 60)).toFixed(1)

      setMetrics({
        workflowsThisMonth,
        pendingApprovals,
        exceptions,
        avgApprovalTime: avgHours + 'h',
      })

      // Workflows by status
      const statusCounts = workflows.reduce((acc: any, w: any) => {
        acc[w.status] = (acc[w.status] || 0) + 1
        return acc
      }, {})
      setWorkflowsByStatus(statusCounts)

      // Recent activity (last 10 ledger entries)
      setRecentActivity(ledger.slice(-10).reverse())

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateReport = () => {
    window.open('/api/reports/committee', '_blank')
  }

  const handleSeedData = async (dataset: 'demo' | 'enterprise') => {
    const datasetName = dataset === 'enterprise' ? 'Enterprise' : 'Demo'
    const confirmed = confirm(
      `Load ${datasetName} Data?\n\n` +
        (dataset === 'enterprise'
          ? '12 workflows covering:\n- Marketing approval\n- Deal desk\n- Vendor onboarding\n- AI use-case\n- DPIA\n- Complaint response\n- ESG claims\n- Product launch\n- Regulatory filing\n- Incident response\n- Senior hire\n- Price change'
          : '5 basic workflows:\n- Barclays RFP (dispatched)\n- HSBC (pending)\n- Lloyds (pending)\n- NatWest (rejected)\n- Santander (approved)')
    )

    if (!confirmed) return

    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataset }),
      })
      const result = await response.json()
      if (result.success) {
        alert(`✅ ${result.message}\n\nPage will refresh.`)
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to seed data:', error)
      alert('❌ Failed to seed data')
    }
  }

  const metricCards = [
    {
      title: 'Workflows this month',
      value: loading ? '...' : metrics.workflowsThisMonth.toString(),
      icon: CheckCircle,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Pending approvals',
      value: loading ? '...' : metrics.pendingApprovals.toString(),
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'Exceptions',
      value: loading ? '...' : metrics.exceptions.toString(),
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      title: 'Avg approval time',
      value: loading ? '...' : metrics.avgApprovalTime,
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
            Dashboard
          </h1>
          <p className="text-slate-600">
            Overview of governance activity and workflow status
          </p>
        </div>
        <div className="flex gap-2">
          {(metrics.workflowsThisMonth === 0 && recentActivity.length === 0) && (
            <>
              <Button
                onClick={() => handleSeedData('demo')}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                🌱 Load Demo Data (5)
              </Button>
              <Button
                onClick={() => handleSeedData('enterprise')}
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                🏢 Load Enterprise Data (12)
              </Button>
            </>
          )}
          <Button onClick={handleGenerateReport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Generate Committee Report
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.title} className="bg-white border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {metric.title}
                </CardTitle>
                <div className={`p-2 rounded ${metric.bg}`}>
                  <Icon className={`w-4 h-4 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900 font-mono">
                  {metric.value}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Workflows by Status */}
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Crimson Pro, serif' }}>
              Workflows by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-slate-500">Loading...</div>
            ) : Object.keys(workflowsByStatus).length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <p className="text-sm">No workflows yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(workflowsByStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center">
                    <div className="w-32 text-sm text-slate-600">
                      {status.replace(/_/g, ' ')}
                    </div>
                    <div className="flex-1 bg-slate-100 rounded-full h-8 relative">
                      <div
                        className="bg-blue-500 h-8 rounded-full flex items-center justify-end pr-3"
                        style={{ width: `${Math.max((count as number) * 20, 10)}%` }}
                      >
                        <span className="text-white text-sm font-bold">
                          {count as number}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Crimson Pro, serif' }}>
              Recent Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-slate-500">Loading...</div>
            ) : recentActivity.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-sm">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {recentActivity.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded"
                  >
                    <div className="w-1 h-1 rounded-full bg-blue-500 mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {entry.event_type.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(entry.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
