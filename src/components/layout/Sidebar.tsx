"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Timer, LayoutDashboard, Calendar, Activity, BookOpen, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDisciplineStore } from '@/store/useDisciplineStore'
import { useSettingsStore } from '@/store/useSettingsStore'
import { ExamCountdownBanner } from '@/components/ExamCountdownBanner'

const navigation = [
  { name: 'Focus Hub', href: '/', icon: Timer },
  { name: 'Planner', href: '/planner', icon: BookOpen },
  { name: 'Analytics', href: '/analytics', icon: Activity },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { dailyLogs } = useDisciplineStore()
  const { dailyMinGoalHours } = useSettingsStore()

  const todayDate = new Date().toISOString().split('T')[0]
  const todayLog = dailyLogs[todayDate]
  const studiedHours = todayLog ? (todayLog.studiedMinutes / 60).toFixed(1) : '0'
  const goalPercent = todayLog ? Math.min(100, (todayLog.studiedMinutes / (dailyMinGoalHours * 60)) * 100) : 0
  const goalMet = todayLog?.minimumMet

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r border-border">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-border">
        <LayoutDashboard className="h-6 w-6 text-primary mr-2 shrink-0" />
        <span className="text-lg font-bold tracking-tight text-foreground">CFA OS</span>
      </div>

      {/* Exam Countdown */}
      <ExamCountdownBanner />

      {/* Navigation */}
      <div className="flex flex-1 flex-col overflow-y-auto pt-4 pb-4">
        <nav className="flex-1 space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  isActive ? 'bg-primary/10 text-primary' : 'text-foreground/70 hover:bg-white/5 hover:text-foreground',
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

      {/* Today's progress bottom bar */}
      <div className="p-4 border-t border-border space-y-2">
        <div className="flex items-center justify-between text-xs text-foreground/60">
          <span>Today's Study</span>
          <span className={cn("font-semibold", goalMet ? "text-success" : "text-foreground/60")}>
            {studiedHours}h / {dailyMinGoalHours}h
          </span>
        </div>
        <div className="w-full h-1.5 bg-foreground/10 rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", goalMet ? "bg-success" : "bg-primary")}
            style={{ width: `${goalPercent}%` }}
          />
        </div>
        {goalMet && (
          <p className="text-xs text-success font-medium text-center">✓ Daily minimum met!</p>
        )}
      </div>
    </div>
  )
}
