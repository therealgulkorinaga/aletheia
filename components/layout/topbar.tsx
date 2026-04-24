'use client'

import { User } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, User as UserIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface TopbarProps {
  user: User
}

const roleColors = {
  OPERATOR: 'bg-blue-100 text-blue-800 border-blue-200',
  APPROVER: 'bg-amber-100 text-amber-800 border-amber-200',
  COMPLIANCE: 'bg-purple-100 text-purple-800 border-purple-200',
  ADMIN: 'bg-slate-100 text-slate-800 border-slate-200',
}

export function Topbar({ user }: TopbarProps) {
  const router = useRouter()

  const handleLogout = async () => {
    // Use mock logout API
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <div className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-slate-900" style={{ fontFamily: 'Crimson Pro, serif' }}>
          Aletheia
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                <span className="font-medium">{user.name}</span>
              </div>
              <Badge
                variant="outline"
                className={cn('text-xs font-mono', roleColors[user.role])}
              >
                {user.role}
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-slate-500 font-mono">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
