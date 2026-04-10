"use client"
import { Flame, Star } from 'lucide-react'
import { useDisciplineStore } from '@/store/useDisciplineStore'
import { useGamificationStore } from '@/store/useGamificationStore'

export function Header() {
  const currentStreak = useDisciplineStore((state) => state.currentStreak)
  const xp = useGamificationStore((state) => state.xp)
  const level = useGamificationStore((state) => state.level)

  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-8 bg-background border-b border-border">
      <div className="flex-1"></div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 bg-primary/10 px-3 py-1.5 rounded-full">
          <Star className="h-4 w-4 text-warning fill-warning" />
          <span className="text-sm font-bold text-foreground">Lvl {level}</span>
          <span className="text-xs text-foreground/60">({xp} XP)</span>
        </div>
        <div className="flex items-center space-x-2 bg-danger/10 px-3 py-1.5 rounded-full">
          <Flame className={`h-4 w-4 ${currentStreak > 0 ? "text-danger fill-danger" : "text-foreground/30"}`} />
          <span className="text-sm font-bold text-foreground">{currentStreak} Day Streak</span>
        </div>
      </div>
    </header>
  )
}
