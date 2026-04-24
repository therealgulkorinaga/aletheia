import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import { mockGetUser } from '@/lib/auth/mock'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Use mock auth for local demo
  const user = await mockGetUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar userRole={user.role} />
      <div className="flex-1 flex flex-col">
        <Topbar user={user} />
        <main className="flex-1 bg-slate-50 p-6">{children}</main>
      </div>
    </div>
  )
}
