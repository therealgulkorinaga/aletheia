// Mock Auth for Local Development
// Use this to test the UI without Supabase setup

import { User, UserRole } from '@/lib/types'
import { cookies } from 'next/headers'

export const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'operator@demo.com': {
    password: 'password123',
    user: {
      id: 'mock-operator-uuid',
      email: 'operator@demo.com',
      name: 'Sarah Chen',
      role: 'OPERATOR' as UserRole,
      department: 'Operations',
      created_at: new Date().toISOString(),
    },
  },
  'approver@demo.com': {
    password: 'password123',
    user: {
      id: 'mock-approver-uuid',
      email: 'approver@demo.com',
      name: 'Michael Roberts',
      role: 'APPROVER' as UserRole,
      department: 'Legal',
      created_at: new Date().toISOString(),
    },
  },
  'compliance@demo.com': {
    password: 'password123',
    user: {
      id: 'mock-compliance-uuid',
      email: 'compliance@demo.com',
      name: 'Emily Watson',
      role: 'COMPLIANCE' as UserRole,
      department: 'Compliance',
      created_at: new Date().toISOString(),
    },
  },
  'admin@demo.com': {
    password: 'password123',
    user: {
      id: 'mock-admin-uuid',
      email: 'admin@demo.com',
      name: 'James Anderson',
      role: 'ADMIN' as UserRole,
      department: 'Administration',
      created_at: new Date().toISOString(),
    },
  },
}

export async function mockSignIn(email: string, password: string) {
  const demoUser = DEMO_USERS[email]

  if (!demoUser || demoUser.password !== password) {
    throw new Error('Invalid credentials')
  }

  // Store user in cookie for demo mode
  const cookieStore = await cookies()
  cookieStore.set('mock-user', JSON.stringify(demoUser.user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
  })

  return demoUser.user
}

export async function mockSignOut() {
  const cookieStore = await cookies()
  cookieStore.delete('mock-user')
}

export async function mockGetUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('mock-user')

  if (!userCookie?.value) {
    return null
  }

  try {
    return JSON.parse(userCookie.value) as User
  } catch {
    return null
  }
}
