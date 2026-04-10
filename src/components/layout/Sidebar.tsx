"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Timer, LayoutDashboard, Calendar, Activity, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Focus Hub', href: '/', icon: Timer },
  { name: 'Planner', href: '/planner', icon: BookOpen },
  { name: 'Analytics', href: '/analytics', icon: Activity },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r border-border">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-border">
        <LayoutDashboard className="h-6 w-6 text-primary mr-2" />
        <span className="text-lg font-bold tracking-tight text-foreground">Pomodoro OS</span>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <nav className="flex-1 space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  isActive ? 'bg-primary/10 text-primary' : 'text-foreground/70 hover:bg-black/10 dark:hover:bg-white/5 hover:text-foreground',
                  'group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all'
                )}
              >
                <item.icon
                  className={cn(
                    isActive ? 'text-primary' : 'text-foreground/50 group-hover:text-foreground/80',
                    'mr-3 h-5 w-5 flex-shrink-0'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-border">
        <div className="flex items-center text-xs text-foreground/50">
          <span className="w-2 h-2 rounded-full bg-success mr-2" /> All systems online
        </div>
      </div>
    </div>
  )
}
