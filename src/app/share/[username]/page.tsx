import { getUserShareSnapshot } from '@/app/actions'
import { Zap, Flame, Trophy, Target, BookOpen } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props { params: Promise<{ username: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  return {
    title: `${username}'s CFA Study Progress — CFA OS`,
    description: `View ${username}'s CFA Level 2 study stats and progress on CFA OS.`,
  }
}

export default async function SharePage({ params }: Props) {
  const { username } = await params
  const data = await getUserShareSnapshot(username)

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Profile not found</h1>
          <p className="text-foreground/50">No user found with username "{username}"</p>
          <Link href="/login" className="mt-4 inline-block text-primary hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    )
  }

  const totalHours = (data.totalStudiedMin / 60).toFixed(1)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-primary/8 rounded-full blur-[140px]" />
      </div>

      <div className="relative w-full max-w-md space-y-6">
        {/* Profile Card */}
        <div className="bg-card border border-border rounded-2xl p-8 text-center shadow-2xl shadow-black/30">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-3xl border border-primary/20 mb-4">
            <Zap className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">{data.displayName}</h1>
          <p className="text-foreground/40 text-sm mt-1">@{data.username} · CFA Level 2 Candidate</p>
          
          <div className="mt-4 inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
            <span className="text-primary font-bold text-lg">Level {data.level}</span>
            <span className="text-foreground/40 text-sm">• {data.xp} XP</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card border border-danger/20 rounded-2xl p-5 text-center">
            <Flame className="w-8 h-8 text-danger fill-danger mx-auto mb-2" />
            <div className="text-3xl font-extrabold">{data.streakDays}</div>
            <div className="text-sm text-foreground/50 mt-1">Day Streak</div>
          </div>
          <div className="bg-card border border-success/20 rounded-2xl p-5 text-center">
            <Trophy className="w-8 h-8 text-success mx-auto mb-2" />
            <div className="text-3xl font-extrabold">{totalHours}h</div>
            <div className="text-sm text-foreground/50 mt-1">Total Studied</div>
          </div>
          <div className="bg-card border border-primary/20 rounded-2xl p-5 text-center">
            <Target className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-3xl font-extrabold">{data.completedTasks}</div>
            <div className="text-sm text-foreground/50 mt-1">Tasks Done</div>
          </div>
          <div className="bg-card border border-warning/20 rounded-2xl p-5 text-center">
            <BookOpen className="w-8 h-8 text-warning mx-auto mb-2" />
            <div className="text-3xl font-extrabold">{data.level}</div>
            <div className="text-sm text-foreground/50 mt-1">CFA OS Level</div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-card border border-border rounded-2xl p-6 text-center">
          <p className="text-foreground/60 text-sm mb-4">
            Track your own CFA Level 2 journey with CFA OS
          </p>
          <Link
            href="/login"
            className="inline-flex items-center space-x-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Zap className="w-4 h-4" />
            <span>Start your study system</span>
          </Link>
        </div>

        <p className="text-center text-xs text-foreground/20">
          Powered by CFA OS — Discipline-Driven Study Platform
        </p>
      </div>
    </div>
  )
}
