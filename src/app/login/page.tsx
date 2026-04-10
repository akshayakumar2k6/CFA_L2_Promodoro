"use client"
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { registerUser } from '@/app/api/auth/register/actions'
import { Zap, User, Lock, Eye, EyeOff, Loader2, ArrowRight, AtSign } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (mode === 'register') {
      const res = await registerUser(username.trim(), password, displayName.trim() || undefined)
      if (res?.error) {
        setError(res.error)
        setLoading(false)
        return
      }
    }

    // Sign in (both login and after register)
    const result = await signIn('credentials', {
      username: username.trim(),
      password,
      redirect: false,
    })

    if (result?.error) {
      setError(mode === 'login' ? 'Invalid username or password' : 'Registration succeeded but login failed. Please try logging in.')
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[15%] w-[700px] h-[700px] bg-primary/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] right-[25%] w-[300px] h-[300px] bg-warning/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-3xl border border-primary/20 mb-5 shadow-2xl shadow-primary/20">
            <Zap className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">CFA OS</h1>
          <p className="text-foreground/50 mt-2 text-sm">
            {mode === 'login' ? 'Sign in to your study system' : 'Create your study account'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl shadow-black/50">
          {/* Tab Switch */}
          <div className="flex bg-background rounded-xl p-1 mb-8 border border-border">
            {(['login', 'register'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                className={cn(
                  "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all",
                  mode === m
                    ? "bg-primary text-white shadow-sm shadow-primary/30"
                    : "text-foreground/50 hover:text-foreground"
                )}
              >
                {m === 'login' ? '🔑 Sign In' : '✨ Register'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground/70">Username</label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="your_username"
                  autoComplete="username"
                  required
                  className="w-full h-11 bg-background border border-border rounded-xl pl-10 pr-4 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Display Name (register only) */}
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground/70">Display Name <span className="text-foreground/30">(optional)</span></label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="Akshay Kumar"
                    className="w-full h-11 bg-background border border-border rounded-xl pl-10 pr-4 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground/70">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'Min 6 characters' : '••••••••'}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                  className="w-full h-11 bg-background border border-border rounded-xl pl-10 pr-12 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary text-white font-semibold rounded-xl flex items-center justify-center space-x-2 hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-primary/25 mt-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-foreground/30 mt-6">
            Your progress is private and linked to your account only.
            {mode === 'register' && (
              <> Username must be alphanumeric. You can share progress stats on Telegram after logging in.</>
            )}
          </p>
        </div>

        {/* Decorative stats preview */}
        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
          {[
            { label: 'Study Sessions', value: '∞', icon: '🎯' },
            { label: 'Track Progress', value: '📊', icon: '📊' },
            { label: 'Share on Telegram', value: '📨', icon: '📨' },
          ].map((item, i) => (
            <div key={i} className="bg-card/50 border border-border/50 rounded-xl p-3">
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-xs text-foreground/50">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
