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
import { Policy } from '@/lib/types/policy'
import { Plus, FileText } from 'lucide-react'

const statusColors = {
  DRAFT: 'bg-gray-100 text-gray-800 border-gray-200',
  ACTIVE: 'bg-green-100 text-green-800 border-green-200',
  RETIRED: 'bg-red-100 text-red-800 border-red-200',
}

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPolicies()
  }, [])

  const fetchPolicies = async () => {
    try {
      const response = await fetch('/api/policies')
      const data = await response.json()
      setPolicies(data)
    } catch (error) {
      console.error('Failed to fetch policies:', error)
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
            Policy Manager
          </h1>
          <p className="text-slate-600">
            Define and manage governance policies and rules
          </p>
        </div>
        <Link href="/admin/policies/new">
          <Button className="bg-slate-800 hover:bg-slate-900">
            <Plus className="w-4 h-4 mr-2" />
            New Policy
          </Button>
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading policies...</div>
        ) : policies.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">No policies yet</p>
            <Link href="/admin/policies/new">
              <Button variant="outline">Create your first policy</Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ fontFamily: 'Crimson Pro, serif' }}>
                  Name
                </TableHead>
                <TableHead style={{ fontFamily: 'Crimson Pro, serif' }}>
                  Version
                </TableHead>
                <TableHead style={{ fontFamily: 'Crimson Pro, serif' }}>
                  Status
                </TableHead>
                <TableHead style={{ fontFamily: 'Crimson Pro, serif' }}>
                  Effective From
                </TableHead>
                <TableHead style={{ fontFamily: 'Crimson Pro, serif' }}>
                  Rule Count
                </TableHead>
                <TableHead style={{ fontFamily: 'Crimson Pro, serif' }}>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell className="font-medium">{policy.name}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {policy.version}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusColors[policy.status]}
                    >
                      {policy.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {new Date(policy.effective_from).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-mono">
                    {policy.rules.length}
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/policies/${policy.id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
