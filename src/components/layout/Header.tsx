"use client"
import { Flame, Star } from 'lucide-react'
import { useDisciplineStore } from '@/store/useDisciplineStore'
import { useGamificationStore } from '@/store/useGamificationStore'
import { cn } from '@/lib/utils'

export function Header() {
  const currentStreak = useDisciplineStore((state) => state.currentStreak)
  const xp = useGamificationStore((state) => state.xp)
  const level = useGamificationStore((state) => state.level)

  const xpInCurrentLevel = xp % 1000
  const xpProgressPct = (xpInCurrentLevel / 1000) * 100

  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-8 bg-background border-b border-border">
      <div className="flex-1" />
      <div className="flex items-center space-x-5">
        {/* XP Level Badge */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
            <Star className="h-4 w-4 text-warning fill-warning" />
            <span className="text-sm font-bold text-foreground">Lvl {level}</span>
          </div>
          {/* Mini XP bar */}
          <div className="w-20 h-1.5 bg-foreground/10 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${xpProgressPct}%` }} />
          </div>
          <span className="text-xs text-foreground/40">{xpInCurrentLevel}/1000</span>
        </div>

        {/* Streak */}
        <div className={cn(
          "flex items-center space-x-2 px-3 py-1.5 rounded-full border",
          currentStreak > 0 ? "bg-danger/10 border-danger/20" : "bg-foreground/5 border-border"
        )}>
          <Flame className={cn("h-4 w-4", currentStreak > 0 ? "text-danger fill-danger" : "text-foreground/30")} />
          <span className="text-sm font-bold text-foreground">
            {currentStreak > 0 ? `${currentStreak} Day Streak` : 'Start your streak today!'}
          </span>
        </div>
      </div>
    </header>
  )
}

