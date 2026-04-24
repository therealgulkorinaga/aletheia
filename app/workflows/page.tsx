'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Workflow } from '@/lib/types/workflow'
import { Plus, FileText } from 'lucide-react'

const statusColors = {
  INITIATED: 'bg-gray-100 text-gray-800 border-gray-200',
  IN_REVIEW: 'bg-blue-100 text-blue-800 border-blue-200',
  APPROVALS_PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
  APPROVED: 'bg-green-100 text-green-800 border-green-200',
  DISPATCHED: 'bg-slate-100 text-slate-800 border-slate-200',
  BLOCKED: 'bg-red-100 text-red-800 border-red-200',
}

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWorkflows()
  }, [])

  const fetchWorkflows = async () => {
    try {
      const response = await fetch('/api/workflows')
      const data = await response.json()
      setWorkflows(data)
    } catch (error) {
      console.error('Failed to fetch workflows:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-4xl font-bold text-slate-900 mb-2"
            style={{ fontFamily: 'Crimson Pro, serif' }}
          >
            Workflows
          </h1>
          <p className="text-slate-600">
            View and manage governance workflows
          </p>
        </div>
        <Link href="/workflows/new">
          <Button className="bg-slate-800 hover:bg-slate-900">
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading workflows...</div>
        ) : workflows.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">No workflows yet</p>
            <Link href="/workflows/new">
              <Button variant="outline">Create your first workflow</Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ fontFamily: 'Crimson Pro, serif' }}>
                  Subject
                </TableHead>
                <TableHead style={{ fontFamily: 'Crimson Pro, serif' }}>
                  Type
                </TableHead>
                <TableHead style={{ fontFamily: 'Crimson Pro, serif' }}>
                  Status
                </TableHead>
                <TableHead style={{ fontFamily: 'Crimson Pro, serif' }}>
                  Created
                </TableHead>
                <TableHead style={{ fontFamily: 'Crimson Pro, serif' }}>
                  Progress
                </TableHead>
                <TableHead style={{ fontFamily: 'Crimson Pro, serif' }}>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflows.map((workflow) => {
                const completedSteps = workflow.steps?.filter(s => s.status === 'COMPLETED').length || 0
                const totalSteps = workflow.steps?.length || 5

                return (
                  <TableRow key={workflow.id}>
                    <TableCell className="font-medium">{workflow.subject}</TableCell>
                    <TableCell className="text-slate-600">
                      {workflow.type.replace('_', ' ')}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusColors[workflow.status]}
                      >
                        {workflow.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {new Date(workflow.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {completedSteps} / {totalSteps}
                    </TableCell>
                    <TableCell>
                      <Link href={`/workflows/${workflow.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
