'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CheckCircle, XCircle, ShieldCheck, BookOpen } from 'lucide-react'

const eventColors: Record<string, string> = {
  WORKFLOW_CREATED: 'bg-blue-100 text-blue-800 border-blue-200',
  STEP_COMPLETED: 'bg-gray-100 text-gray-800 border-gray-200',
  AUTHORITY_CHECK_PERFORMED: 'bg-purple-100 text-purple-800 border-purple-200',
  APPROVAL_GRANTED: 'bg-green-100 text-green-800 border-green-200',
  APPROVAL_REJECTED: 'bg-red-100 text-red-800 border-red-200',
  APPROVAL_CHANGES_REQUESTED: 'bg-amber-100 text-amber-800 border-amber-200',
  EVIDENCE_SEALED: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  WORKFLOW_DISPATCHED: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  OUTCOME_RECORDED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
}

export default function LedgerPage() {
  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [verifying, setVerifying] = useState(false)
  const [verifyResult, setVerifyResult] = useState<any>(null)

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/ledger')
      const data = await response.json()
      setEntries(data)
    } catch (error) {
      console.error('Failed to fetch ledger:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    setVerifying(true)
    try {
      const response = await fetch('/api/ledger/verify')
      const result = await response.json()
      setVerifyResult(result)
    } catch (error) {
      console.error('Failed to verify chain:', error)
    } finally {
      setVerifying(false)
    }
  }

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expanded)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpanded(newExpanded)
  }

  const truncateHash = (hash: string) => {
    if (hash.length <= 16) return hash
    return `${hash.substring(0, 12)}...${hash.substring(hash.length - 8)}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-4xl font-bold text-slate-900 mb-2"
            style={{ fontFamily: 'Crimson Pro, serif' }}
          >
            Ledger
          </h1>
          <p className="text-slate-600">
            Immutable audit trail of all governance actions
          </p>
        </div>
        <Button
          onClick={handleVerify}
          disabled={verifying || entries.length === 0}
          className="bg-slate-800 hover:bg-slate-900"
        >
          <ShieldCheck className="w-4 h-4 mr-2" />
          {verifying ? 'Verifying...' : 'Verify Chain Integrity'}
        </Button>
      </div>

      {verifyResult && (
        <Card>
          <CardContent className="p-4">
            <div
              className={`flex items-center gap-3 ${
                verifyResult.valid ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {verifyResult.valid ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <div>
                    <p className="font-medium">Chain Integrity Verified ✓</p>
                    <p className="text-sm text-slate-600">
                      All {entries.length} entries validated successfully
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5" />
                  <div>
                    <p className="font-medium">Chain Integrity Failed ✗</p>
                    <p className="text-sm text-red-600">
                      {verifyResult.errors.length} error(s) detected
                    </p>
                  </div>
                </>
              )}
            </div>
            {verifyResult.errors && verifyResult.errors.length > 0 && (
              <div className="mt-3 space-y-1">
                {verifyResult.errors.map((error: string, idx: number) => (
                  <p key={idx} className="text-xs text-red-600 font-mono">
                    {error}
                  </p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Crimson Pro, serif' }}>
            Recent Entries
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-slate-500">
              Loading ledger entries...
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No ledger entries yet</p>
              <p className="text-sm text-slate-400 mt-2">
                Create workflows to generate ledger entries
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead style={{ fontFamily: 'Crimson Pro, serif' }}>
                    Sequence
                  </TableHead>
                  <TableHead style={{ fontFamily: 'Crimson Pro, serif' }}>
                    Event Type
                  </TableHead>
                  <TableHead style={{ fontFamily: 'Crimson Pro, serif' }}>
                    Workflow
                  </TableHead>
                  <TableHead style={{ fontFamily: 'Crimson Pro, serif' }}>
                    Timestamp
                  </TableHead>
                  <TableHead style={{ fontFamily: 'Crimson Pro, serif' }}>
                    Hash
                  </TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <>
                    <TableRow key={entry.id} className="cursor-pointer hover:bg-slate-50">
                      <TableCell className="font-mono text-sm">
                        #{entry.sequence}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={eventColors[entry.event_type] || 'bg-gray-100'}
                        >
                          {entry.event_type.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {entry.workflow_id ? truncateHash(entry.workflow_id) : '-'}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {new Date(entry.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-500">
                        {truncateHash(entry.chain_hash)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpanded(entry.id)}
                        >
                          {expanded.has(entry.id) ? 'Hide' : 'Show'}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expanded.has(entry.id) && (
                      <TableRow>
                        <TableCell colSpan={6} className="bg-slate-50">
                          <div className="p-4 space-y-3">
                            <div>
                              <p className="text-xs font-semibold text-slate-700 mb-1">
                                Payload Hash:
                              </p>
                              <code className="text-xs font-mono bg-white px-2 py-1 rounded border">
                                {entry.payload_hash}
                              </code>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-700 mb-1">
                                Previous Hash:
                              </p>
                              <code className="text-xs font-mono bg-white px-2 py-1 rounded border">
                                {entry.previous_hash || 'null (genesis)'}
                              </code>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-700 mb-1">
                                Chain Hash:
                              </p>
                              <code className="text-xs font-mono bg-white px-2 py-1 rounded border">
                                {entry.chain_hash}
                              </code>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-700 mb-1">
                                Payload:
                              </p>
                              <pre className="text-xs font-mono bg-white px-2 py-2 rounded border overflow-x-auto">
                                {JSON.stringify(entry.payload, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
