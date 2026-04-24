'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { UserRole } from '@/lib/types'
import {
  LayoutDashboard,
  FileText,
  FilePlus,
  CheckSquare,
  BookOpen,
  FileBarChart,
  Shield,
  Users,
  ScrollText,
  Send,
} from 'lucide-react'

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: UserRole[]
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['OPERATOR', 'APPROVER', 'COMPLIANCE', 'ADMIN'],
  },
  {
    title: 'Workflows',
    href: '/workflows',
    icon: FileText,
    roles: ['OPERATOR', 'COMPLIANCE'],
  },
  {
    title: 'New Workflow',
    href: '/workflows/new',
    icon: FilePlus,
    roles: ['OPERATOR'],
  },
  {
    title: 'Approval Inbox',
    href: '/approvals',
    icon: CheckSquare,
    roles: ['APPROVER'],
  },
  {
    title: 'Execution',
    href: '/execution',
    icon: Send,
    roles: ['OPERATOR', 'COMPLIANCE', 'ADMIN'],
  },
  {
    title: 'Ledger',
    href: '/ledger',
    icon: BookOpen,
    roles: ['COMPLIANCE', 'ADMIN'],
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: FileBarChart,
    roles: ['COMPLIANCE', 'ADMIN'],
  },
  {
    title: 'Policies',
    href: '/admin/policies',
    icon: Shield,
    roles: ['ADMIN'],
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
    roles: ['ADMIN'],
  },
  {
    title: 'Authorities',
    href: '/admin/authorities',
    icon: ScrollText,
    roles: ['ADMIN'],
  },
]

interface SidebarProps {
  userRole: UserRole
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()

  const visibleItems = navItems.filter((item) => item.roles.includes(userRole))

  return (
    <div className="w-64 bg-slate-900 text-slate-100 min-h-screen border-r border-slate-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'Crimson Pro, serif' }}>
          Aletheia
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-mono">Governance Platform</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {visibleItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors',
                isActive
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
              )}
            >
              <Icon className="w-4 h-4" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="text-xs text-slate-500 font-mono">
          v1.0.0
        </div>
      </div>
    </div>
  )
}
