'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Use mock auth API route for local demo
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Invalid credentials')
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const demoUsers = [
    { email: 'operator@demo.com', role: 'OPERATOR' },
    { email: 'approver@demo.com', role: 'APPROVER' },
    { email: 'compliance@demo.com', role: 'COMPLIANCE' },
    { email: 'admin@demo.com', role: 'ADMIN' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-4xl font-bold mb-2 text-slate-900" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Aletheia
            </h1>
          </Link>
          <p className="text-slate-600">Sign in to your account</p>
        </div>

        <Card className="bg-white border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Sign In
            </CardTitle>
            <CardDescription>
              Enter your credentials to access the governance platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="operator@demo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="password123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-slate-800 hover:bg-slate-900"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-xs text-slate-500 mb-3 font-mono">Demo Credentials:</p>
              <div className="grid grid-cols-2 gap-2">
                {demoUsers.map((user) => (
                  <button
                    key={user.email}
                    onClick={() => {
                      setEmail(user.email)
                      setPassword('password123')
                    }}
                    className="text-left text-xs p-2 rounded border border-slate-200 hover:bg-slate-50 transition-colors"
                    type="button"
                  >
                    <div className="font-mono text-slate-700">{user.role}</div>
                    <div className="text-slate-500 truncate">{user.email}</div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-slate-500 mt-6 font-mono">
          Aletheia — Confidential
        </p>
      </div>
    </div>
  )
}
