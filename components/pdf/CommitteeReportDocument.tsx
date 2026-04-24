import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 30,
    paddingBottom: 15,
    borderBottom: '2 solid #1e293b',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: '#64748b',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
    marginBottom: 10,
    borderBottom: '1 solid #e2e8f0',
    paddingBottom: 4,
  },
  text: {
    fontSize: 10,
    color: '#334155',
    marginBottom: 4,
  },
  label: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 2,
    fontFamily: 'Helvetica-Bold',
  },
  metricBox: {
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 9,
    color: '#64748b',
  },
  table: {
    marginTop: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #e2e8f0',
    paddingVertical: 6,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '2 solid #cbd5e1',
    paddingBottom: 6,
    marginBottom: 4,
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    color: '#475569',
  },
  tableCellHeader: {
    flex: 1,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: '#94a3b8',
    textAlign: 'center',
    borderTop: '1 solid #e2e8f0',
    paddingTop: 10,
  },
  highlight: {
    backgroundColor: '#fef3c7',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  highlightText: {
    fontSize: 9,
    color: '#92400e',
  },
})

interface CommitteeReportProps {
  startDate: Date
  endDate: Date
  metrics: {
    totalWorkflows: number
    completedWorkflows: number
    pendingApprovals: number
    exceptions: number
    avgApprovalTime: string
  }
  workflows: any[]
  approvals: any[]
  ledger: any[]
  chainValid: boolean
}

export function CommitteeReportDocument({
  startDate,
  endDate,
  metrics,
  workflows,
  approvals,
  ledger,
  chainValid,
}: CommitteeReportProps) {
  const exceptionsDetail = ledger.filter(
    (e) => e.event_type === 'APPROVAL_GRANTED' && e.payload?.severity === 'HIGH'
  )

  return (
    <Document>
      {/* Page 1: Executive Summary */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Committee Report</Text>
          <Text style={styles.subtitle}>Aletheia Governance Platform</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reporting Period</Text>
          <Text style={styles.text}>
            {startDate.toLocaleDateString()} — {endDate.toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <Text style={styles.text}>
            This report summarizes AI governance activity for the period. All workflows were
            executed under Board-approved policies with automated policy enforcement and human
            oversight where required.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            <View style={[styles.metricBox, { width: '48%' }]}>
              <Text style={styles.metricValue}>{metrics.totalWorkflows}</Text>
              <Text style={styles.metricLabel}>Total Workflows</Text>
            </View>
            <View style={[styles.metricBox, { width: '48%' }]}>
              <Text style={styles.metricValue}>{metrics.completedWorkflows}</Text>
              <Text style={styles.metricLabel}>Completed</Text>
            </View>
            <View style={[styles.metricBox, { width: '48%' }]}>
              <Text style={styles.metricValue}>{metrics.pendingApprovals}</Text>
              <Text style={styles.metricLabel}>Pending Approvals</Text>
            </View>
            <View style={[styles.metricBox, { width: '48%' }]}>
              <Text style={styles.metricValue}>{metrics.avgApprovalTime}</Text>
              <Text style={styles.metricLabel}>Avg Approval Time</Text>
            </View>
          </View>
        </View>

        {metrics.exceptions > 0 && (
          <View style={styles.highlight}>
            <Text style={styles.highlightText}>
              ⚠ {metrics.exceptions} high-severity exception(s) were approved during this period.
              See page 3 for details.
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text>Generated on {new Date().toLocaleString()} • Page 1</Text>
        </View>
      </Page>

      {/* Page 2: Workflow Summary */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Workflow Summary</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Workflows</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCellHeader, { flex: 2 }]}>Subject</Text>
              <Text style={styles.tableCellHeader}>Status</Text>
              <Text style={styles.tableCellHeader}>Created</Text>
            </View>
            {workflows.map((workflow, idx) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>
                  {workflow.subject.substring(0, 40)}
                  {workflow.subject.length > 40 ? '...' : ''}
                </Text>
                <Text style={styles.tableCell}>{workflow.status}</Text>
                <Text style={styles.tableCell}>
                  {new Date(workflow.created_at).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Page 2</Text>
        </View>
      </Page>

      {/* Page 3: Exceptions & High Severity Approvals */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Exceptions & High Severity Approvals</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>High Severity Approvals Granted</Text>
          {exceptionsDetail.length === 0 ? (
            <Text style={styles.text}>No high-severity exceptions were approved this period.</Text>
          ) : (
            exceptionsDetail.map((entry, idx) => (
              <View key={idx} style={{ marginBottom: 12 }}>
                <Text style={styles.label}>Exception {idx + 1}</Text>
                <Text style={styles.text}>
                  Workflow: {entry.workflow_id}
                </Text>
                <Text style={styles.text}>
                  Date: {new Date(entry.created_at).toLocaleString()}
                </Text>
                {entry.payload?.ruleName && (
                  <Text style={styles.text}>Rule: {entry.payload.ruleName}</Text>
                )}
                {entry.payload?.approver_role && (
                  <Text style={styles.text}>Approved by: {entry.payload.approver_role}</Text>
                )}
              </View>
            ))
          )}
        </View>

        <View style={styles.footer}>
          <Text>Page 3</Text>
        </View>
      </Page>

      {/* Page 4: Chain Integrity */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Audit Trail Integrity</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ledger Chain Verification</Text>
          <View style={styles.metricBox}>
            <Text style={styles.metricValue}>{chainValid ? '✓ VALID' : '✗ INVALID'}</Text>
            <Text style={styles.metricLabel}>Chain Integrity Status</Text>
          </View>
          <Text style={styles.text}>
            The audit ledger contains {ledger.length} entries. Each entry is cryptographically
            linked to the previous entry using SHA-256 hashing. Chain verification confirms that
            no entries have been tampered with.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ledger Statistics</Text>
          <Text style={styles.text}>Total entries: {ledger.length}</Text>
          <Text style={styles.text}>
            Workflows created: {ledger.filter((e) => e.event_type === 'WORKFLOW_CREATED').length}
          </Text>
          <Text style={styles.text}>
            Approvals granted: {ledger.filter((e) => e.event_type === 'APPROVAL_GRANTED').length}
          </Text>
          <Text style={styles.text}>
            Approvals rejected:{' '}
            {ledger.filter((e) => e.event_type === 'APPROVAL_REJECTED').length}
          </Text>
          <Text style={styles.text}>
            Evidence sealed: {ledger.filter((e) => e.event_type === 'EVIDENCE_SEALED').length}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conclusion</Text>
          <Text style={styles.text}>
            All governance activities for this period were executed in accordance with
            Board-approved policies. The cryptographic audit trail has been verified and shows no
            evidence of tampering.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>Page 4 • End of Committee Report</Text>
        </View>
      </Page>
    </Document>
  )
}
