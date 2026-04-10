"use client"
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { useDisciplineStore } from '@/store/useDisciplineStore'
import { Flame, Target, Trophy, BookOpen, Download } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { usePlannerStore } from '@/store/usePlannerStore'
import { Button } from '@/components/ui/Button'

const SUBJECT_COLORS = [
  '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#6366f1'
]

const SkeletonBar = () => (
  <div className="h-[300px] w-full flex items-end space-x-3 px-4">
    {[60, 40, 80, 30, 70].map((h, i) => (
      <div key={i} className="flex-1 animate-pulse bg-foreground/10 rounded-t-sm" style={{ height: `${h}%` }} />
    ))}
  </div>
)

export default function Analytics() {
  const { currentStreak, weeklyTargetHours, dailyLogs } = useDisciplineStore()
  const { tasks } = usePlannerStore()

  const totalStudiedMinutes = Object.values(dailyLogs).reduce((acc, log) => acc + log.studiedMinutes, 0)
  const totalHours = (totalStudiedMinutes / 60).toFixed(1)

  const totalPlanned = tasks.reduce((acc, t) => acc + t.plannedPomodoros, 0)
  const totalCompleted = tasks.reduce((acc, t) => acc + (t.isCompleted ? t.plannedPomodoros : t.completedPomodoros), 0)
  const efficiency = totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : -1

  const weeklyScore = efficiency < 0 ? -1 : Math.min(100, Math.round(efficiency * 0.7 + (currentStreak * 5)))

  // Subject allocation
  const subjectMap: Record<string, number> = {}
  tasks.forEach(t => {
    const hours = (t.completedPomodoros * 50) / 60
    subjectMap[t.subject] = (subjectMap[t.subject] || 0) + hours
  })
  const subjectData = Object.entries(subjectMap)
    .map(([name, hours]) => ({ name: name.split(' ')[0], hours: Number(hours.toFixed(1)) }))
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 6)
  const hasSubjectData = subjectData.length > 0

  // Weak subject
  let weakSubject: { name: string, efficiency: number, allocatedHours: string } | null = null
  if (tasks.length > 0) {
    const subjectStats: Record<string, { planned: number, completed: number }> = {}
    tasks.forEach(t => {
      if (!subjectStats[t.subject]) subjectStats[t.subject] = { planned: 0, completed: 0 }
      subjectStats[t.subject].planned += t.plannedPomodoros
      subjectStats[t.subject].completed += t.completedPomodoros
    })
    let minEff = 101
    for (const [sub, stats] of Object.entries(subjectStats)) {
      if (stats.planned > 0) {
        const eff = Math.round((stats.completed / stats.planned) * 100)
        if (eff < minEff) {
          minEff = eff
          weakSubject = { name: sub, efficiency: eff, allocatedHours: ((stats.planned * 50) / 60).toFixed(1) }
        }
      }
    }
  }

  // CSV Export
  const handleExport = () => {
    const rows = [['Date', 'Studied Minutes', 'Minimum Met', 'Failed']]
    Object.entries(dailyLogs).sort().forEach(([date, log]) => {
      rows.push([date, String(log.studiedMinutes), String(log.minimumMet), String(log.failed)])
    })
    const csvContent = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cfa_study_log.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
          <p className="text-foreground/60 mt-2">Deep dive into your study metrics and detect weak spots.</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport} className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <Trophy className="w-8 h-8 text-primary mb-3" />
            <h3 className="text-sm font-medium text-foreground/60">Total Study Time</h3>
            {Number(totalHours) > 0
              ? <p className="text-3xl font-bold mt-1">{totalHours}h</p>
              : <p className="text-sm text-foreground/40 mt-3">No sessions yet —<br />complete your first one</p>
            }
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <Target className="w-8 h-8 text-success mb-3" />
            <h3 className="text-sm font-medium text-foreground/60">Efficiency Score</h3>
            {efficiency >= 0
              ? <p className="text-3xl font-bold mt-1">{efficiency}%</p>
              : <p className="text-sm text-foreground/40 mt-3">Complete tasks to see efficiency</p>
            }
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <Flame className="w-8 h-8 text-danger mb-3" />
            <h3 className="text-sm font-medium text-foreground/60">Current Streak</h3>
            <p className="text-3xl font-bold mt-1">{currentStreak > 0 ? `${currentStreak} days` : '—'}</p>
            {currentStreak === 0 && <p className="text-xs text-foreground/40 mt-1">Start your streak today!</p>}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <BookOpen className="w-8 h-8 text-warning mb-3" />
            <h3 className="text-sm font-medium text-foreground/60">Weekly Score</h3>
            {weeklyScore >= 0
              ? <>
                  <p className={`text-3xl font-bold mt-1 ${weeklyScore >= 85 ? 'text-success' : weeklyScore >= 70 ? 'text-warning' : 'text-danger'}`}>
                    {weeklyScore}
                  </p>
                  <span className="text-xs font-semibold uppercase tracking-wider mt-1">
                    {weeklyScore >= 85 ? 'On Track' : weeklyScore >= 70 ? 'At Risk' : 'Needs Work'}
                  </span>
                </>
              : <p className="text-sm text-foreground/40 mt-3">No data yet</p>
            }
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Subject Allocation Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Subject Allocation (Hrs)</CardTitle>
          </CardHeader>
          <CardContent>
            {hasSubjectData ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectData}>
                    <XAxis dataKey="name" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                    />
                    <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                      {subjectData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={SUBJECT_COLORS[index % SUBJECT_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="relative">
                <SkeletonBar />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-card/90 backdrop-blur-sm rounded-xl p-4 text-center border border-border">
                    <p className="text-sm font-medium text-foreground/70">No sessions yet</p>
                    <p className="text-xs text-foreground/40 mt-1">Complete study sessions to see subject allocation</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weak Subject */}
        <Card className="border-warning/50 bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center text-warning">
              ⚠️ Weak Subject Detection
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weakSubject ? (
              <div className="p-4 bg-background rounded-lg border border-border">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-lg">{weakSubject.name}</h4>
                    <p className="text-sm text-foreground/60">Lowest completion rate</p>
                  </div>
                  {weakSubject.efficiency < 50 && (
                    <span className="bg-danger/20 text-danger px-2 py-1 rounded text-xs font-bold">CRITICAL</span>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-2 text-sm text-center">
                  <div><span className="block text-foreground/50">Allocated</span><span className="font-medium">{weakSubject.allocatedHours} Hrs</span></div>
                  <div><span className="block text-foreground/50">Efficiency</span><span className="font-medium">{weakSubject.efficiency}%</span></div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-lg border border-dashed border-border text-center">
                <p className="text-sm text-foreground/50">No sessions yet — complete your first one to see weak subject detection</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
