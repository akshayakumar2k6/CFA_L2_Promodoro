"use client"
import { Flame, Star, LogOut, Send } from 'lucide-react'
import { useDisciplineStore } from '@/store/useDisciplineStore'
import { useGamificationStore } from '@/store/useGamificationStore'
import { cn } from '@/lib/utils'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'

function TelegramShareButton({ username, xp, level, streak }: { username: string, xp: number, level: number, streak: number }) {
  const handleShare = () => {
    const url = `${window.location.origin}/share/${username}`
    const text = `🎓 My CFA L2 Study Progress on CFA OS!\n\n📊 Level ${level} | ${xp} XP\n🔥 ${streak}-day streak\n\nCheck my full stats: ${url}`
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#2AABEE]/10 border border-[#2AABEE]/20 text-[#2AABEE] text-sm font-medium hover:bg-[#2AABEE]/20 transition-colors"
      title="Share progress on Telegram"
    >
      <Send className="w-3.5 h-3.5" />
      <span>Share</span>
    </button>
  )
}

export function Header() {
  const { data: session } = useSession()
  const currentStreak = useDisciplineStore((state) => state.currentStreak)
  const xp = useGamificationStore((state) => state.xp)
  const level = useGamificationStore((state) => state.level)

  const xpInCurrentLevel = xp % 1000
  const xpProgressPct = (xpInCurrentLevel / 1000) * 100
  const username = (session?.user as any)?.username || session?.user?.name || 'User'
  const displayName = session?.user?.name || username

  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-8 bg-background border-b border-border">
      {/* Left: user greeting */}
      <div className="text-sm text-foreground/50 font-medium">
        Hey, <span className="text-foreground font-semibold">{displayName}</span> 👋
      </div>

      <div className="flex items-center space-x-4">
        {/* Telegram Share */}
        <TelegramShareButton username={username} xp={xp} level={level} streak={currentStreak} />

        {/* XP Level Badge */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
            <Star className="h-4 w-4 text-warning fill-warning" />
            <span className="text-sm font-bold text-foreground">Lvl {level}</span>
          </div>
          <div className="w-16 h-1.5 bg-foreground/10 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${xpProgressPct}%` }} />
          </div>
          <span className="text-xs text-foreground/40">{xpInCurrentLevel} XP</span>
        </div>

        {/* Streak */}
        <div className={cn(
          "flex items-center space-x-2 px-3 py-1.5 rounded-full border",
          currentStreak > 0 ? "bg-danger/10 border-danger/20" : "bg-foreground/5 border-border"
        )}>
          <Flame className={cn("h-4 w-4", currentStreak > 0 ? "text-danger fill-danger" : "text-foreground/30")} />
          <span className="text-sm font-bold text-foreground">
            {currentStreak > 0 ? `${currentStreak} Day Streak` : 'Start streak!'}
          </span>
        </div>

        {/* Sign out */}
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="p-2 rounded-lg text-foreground/30 hover:text-foreground hover:bg-foreground/5 transition-colors"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
