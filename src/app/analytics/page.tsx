"use client"
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { useDisciplineStore } from '@/store/useDisciplineStore'
import { Flame, Target, Trophy, AlertTriangle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { usePlannerStore } from '@/store/usePlannerStore'

export default function Analytics() {
  const { currentStreak, weeklyTargetHours, dailyLogs } = useDisciplineStore()
  const { tasks } = usePlannerStore()

  // Calculate simple stats
  const totalStudiedMinutes = Object.values(dailyLogs).reduce((acc, log) => acc + log.studiedMinutes, 0)
  const totalHours = (totalStudiedMinutes / 60).toFixed(1)

  // Calculate generic efficiency
  const totalPlanned = tasks.reduce((acc, t) => acc + t.plannedPomodoros, 0)
  const totalCompleted = tasks.reduce((acc, t) => acc + (t.isCompleted ? t.plannedPomodoros : t.completedPomodoros), 0)
  const efficiency = totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 0

  // Calculate weekly score (mock implementation for visuals)
  const weeklyScore = Math.min(100, Math.round(efficiency * 0.7 + (currentStreak * 5)))
  
  let scoreStatus = "Off Track"
  let scoreColor = "text-danger"
  if (weeklyScore >= 85) { scoreStatus = "On Track"; scoreColor = "text-success" }
  else if (weeklyScore >= 70) { scoreStatus = "At Risk"; scoreColor = "text-warning" }

  // Compute subject allocation
  const subjectMap: Record<string, number> = {}
  tasks.forEach(t => {
    // We assume 50 mins per pomodoro for simplicity
    const hours = (t.completedPomodoros * 50) / 60
    subjectMap[t.subject] = (subjectMap[t.subject] || 0) + hours
  })
  
  const subjectData = Object.entries(subjectMap).map(([name, hours]) => ({
    name: name.split(' ')[0], // Short name for chart
    hours: Number(hours.toFixed(1))
  })).sort((a, b) => b.hours - a.hours).slice(0, 5) // Top 5

  // Find weakest subject
  let weakSubject = null
  if (tasks.length > 0) {
    const subjectStats: Record<string, { planned: number, completed: number }> = {}
    tasks.forEach(t => {
      if (!subjectStats[t.subject]) subjectStats[t.subject] = { planned: 0, completed: 0 }
      subjectStats[t.subject].planned += t.plannedPomodoros
      subjectStats[t.subject].completed += t.completedPomodoros
    })
    
    let minEff = 100
    for (const [sub, stats] of Object.entries(subjectStats)) {
      if (stats.planned > 0) {
        const eff = Math.round((stats.completed / stats.planned) * 100)
        if (eff <= minEff) {
          minEff = eff
          weakSubject = { name: sub, efficiency: eff, allocatedHours: ((stats.planned * 50)/60).toFixed(1) }
        }
      }
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
        <p className="text-foreground/60 mt-2">Deep dive into your study metrics and detect weak spots.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <Trophy className="w-8 h-8 text-primary mb-3" />
            <h3 className="text-sm font-medium text-foreground/60">Total Study Time</h3>
            <p className="text-3xl font-bold mt-1">{totalHours}h</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <Target className="w-8 h-8 text-success mb-3" />
            <h3 className="text-sm font-medium text-foreground/60">Efficiency Score</h3>
            <p className="text-3xl font-bold mt-1">{efficiency}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <Flame className="w-8 h-8 text-danger mb-3" />
            <h3 className="text-sm font-medium text-foreground/60">Current Streak</h3>
            <p className="text-3xl font-bold mt-1">{currentStreak} days</p>
          </CardContent>
        </Card>
        <Card className="border-primary">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <div className="w-8 h-8 flex items-center justify-center font-bold text-lg bg-primary/20 text-primary rounded-full mb-3">#</div>
            <h3 className="text-sm font-medium text-foreground/60">Weekly Score</h3>
            <p className={`text-3xl font-bold mt-1 ${scoreColor}`}>{weeklyScore}</p>
            <span className="text-xs font-semibold uppercase tracking-wider mt-1">{scoreStatus}</span>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Subject Allocation (Hrs)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectData}>
                  <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }} />
                  <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#27272a'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-warning/50 bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center text-warning">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Weak Subject Detection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {weakSubject ? (
              <div className="p-4 bg-background rounded-lg border border-border">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-lg">{weakSubject.name}</h4>
                    <p className="text-sm text-foreground/60">Low time allocation & completion rate.</p>
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
             <div className="p-4 bg-background rounded-lg border border-border text-center text-foreground/60 py-8">
               Not enough data to detect weak subjects.
             </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
