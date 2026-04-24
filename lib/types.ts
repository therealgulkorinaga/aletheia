export type UserRole = 'OPERATOR' | 'APPROVER' | 'COMPLIANCE' | 'ADMIN'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  department: string | null
  created_at: string
}
