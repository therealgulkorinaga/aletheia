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
  badge: {
    display: 'inline-block',
    padding: '3 8',
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    marginRight: 8,
    marginBottom: 4,
  },
  timeline: {
    marginTop: 8,
  },
  timelineEntry: {
    marginBottom: 8,
    paddingLeft: 12,
    borderLeft: '2 solid #cbd5e1',
  },
  hash: {
    fontFamily: 'Courier',
    fontSize: 8,
    color: '#475569',
    marginTop: 4,
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
  qa: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
  },
  question: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  answer: {
    fontSize: 9,
    color: '#475569',
    marginBottom: 6,
  },
  flag: {
    backgroundColor: '#fef3c7',
    padding: 6,
    marginTop: 4,
    borderRadius: 3,
  },
  flagText: {
    fontSize: 8,
    color: '#92400e',
  },
})

interface EvidencePackProps {
  workflow: any
  approvals: any[]
  ledgerEntries: any[]
}

export function EvidencePackDocument({ workflow, approvals, ledgerEntries }: EvidencePackProps) {
  return (
    <Document>
      {/* Page 1: Cover */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Evidence Pack</Text>
          <Text style={styles.subtitle}>Aletheia Governance Platform</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workflow Summary</Text>
          <Text style={styles.label}>Workflow ID</Text>
          <Text style={styles.text}>{workflow.id}</Text>
          <Text style={styles.label}>Subject</Text>
          <Text style={styles.text}>{workflow.subject}</Text>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.text}>{workflow.status}</Text>
          <Text style={styles.label}>Created</Text>
          <Text style={styles.text}>{new Date(workflow.created_at).toLocaleString()}</Text>
          {workflow.completed_at && (
            <>
              <Text style={styles.label}>Completed</Text>
              <Text style={styles.text}>{new Date(workflow.completed_at).toLocaleString()}</Text>
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Governance Authority</Text>
          <Text style={styles.text}>
            This workflow was executed under the authority of the Board-approved RFP Response
            Authority Policy v1. All steps were subject to automated policy checks and human
            approval where required.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>Generated on {new Date().toLocaleString()} • Page 1</Text>
          <Text>This document contains cryptographically sealed evidence</Text>
        </View>
      </Page>

      {/* Page 2: Timeline */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Workflow Timeline</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.timeline}>
            {workflow.steps.map((step: any, idx: number) => (
              <View key={idx} style={styles.timelineEntry}>
                <Text style={styles.label}>{step.name}</Text>
                <Text style={styles.text}>Status: {step.status}</Text>
                {step.completed_at && (
                  <Text style={styles.text}>
                    Completed: {new Date(step.completed_at).toLocaleString()}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Page 2</Text>
        </View>
      </Page>

      {/* Page 3: Questions & Answers */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Questions & Drafted Answers</Text>
        </View>

        <View style={styles.section}>
          {workflow.questions.map((q: any, idx: number) => (
            <View key={idx} style={styles.qa}>
              <Text style={styles.question}>Q{idx + 1}: {q.question}</Text>
              <Text style={styles.answer}>{q.draft}</Text>
              {q.flags && q.flags.length > 0 && (
                <View style={styles.flag}>
                  {q.flags.map((flag: any, fIdx: number) => (
                    <Text key={fIdx} style={styles.flagText}>
                      ⚠ {flag.ruleName} ({flag.severity})
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text>Page 3</Text>
        </View>
      </Page>

      {/* Page 4: Authority Checks */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Authority Checks & Policy Flags</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Policy Enforcement</Text>
          <Text style={styles.text}>
            All drafted answers were automatically checked against the RFP Response Authority
            Policy v1. The following flags were raised:
          </Text>

          {workflow.questions
            .filter((q: any) => q.flags && q.flags.length > 0)
            .map((q: any, idx: number) => (
              <View key={idx} style={{ marginTop: 12 }}>
                <Text style={styles.label}>Question: {q.question}</Text>
                {q.flags.map((flag: any, fIdx: number) => (
                  <View key={fIdx} style={{ marginTop: 4, marginLeft: 8 }}>
                    <Text style={styles.text}>• {flag.ruleName}</Text>
                    <Text style={styles.text}>  Severity: {flag.severity}</Text>
                    <Text style={styles.text}>  Action: {flag.action}</Text>
                    {flag.matchedPatterns && flag.matchedPatterns.length > 0 && (
                      <Text style={styles.text}>
                        Matched: {flag.matchedPatterns.join(', ')}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            ))}
        </View>

        <View style={styles.footer}>
          <Text>Page 4</Text>
        </View>
      </Page>

      {/* Page 5: Approvals */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Approval Records</Text>
        </View>

        <View style={styles.section}>
          {approvals.length === 0 ? (
            <Text style={styles.text}>No approvals required for this workflow.</Text>
          ) : (
            approvals.map((approval: any, idx: number) => (
              <View key={idx} style={{ marginBottom: 16 }}>
                <Text style={styles.label}>Approval {idx + 1}</Text>
                <Text style={styles.text}>Role: {approval.approver_role}</Text>
                <Text style={styles.text}>Decision: {approval.decision}</Text>
                {approval.decided_at && (
                  <Text style={styles.text}>
                    Decided: {new Date(approval.decided_at).toLocaleString()}
                  </Text>
                )}
                {approval.decided_by && (
                  <Text style={styles.text}>By: {approval.decided_by}</Text>
                )}
                {approval.comment && (
                  <Text style={styles.text}>Comment: {approval.comment}</Text>
                )}
              </View>
            ))
          )}
        </View>

        <View style={styles.footer}>
          <Text>Page 5</Text>
        </View>
      </Page>

      {/* Page 6: Chain Verification */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Cryptographic Chain Verification</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ledger Entries</Text>
          <Text style={styles.text}>
            This workflow generated {ledgerEntries.length} ledger entries. Each entry is
            cryptographically linked to the previous entry, forming an immutable audit trail.
          </Text>

          {ledgerEntries.slice(0, 10).map((entry: any, idx: number) => (
            <View key={idx} style={{ marginTop: 12 }}>
              <Text style={styles.label}>
                #{entry.sequence} - {entry.event_type}
              </Text>
              <Text style={styles.text}>
                {new Date(entry.created_at).toLocaleString()}
              </Text>
              <Text style={styles.hash}>{entry.chain_hash}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text>Page 6 • End of Evidence Pack</Text>
        </View>
      </Page>
    </Document>
  )
}
