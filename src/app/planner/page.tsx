"use client"
import { useState } from 'react'
import { Plus, Check, PlayCircle, Target, Trash2 } from 'lucide-react'
import { usePlannerStore } from '@/store/usePlannerStore'
import { useSettingsStore } from '@/store/useSettingsStore'
import { useDisciplineStore } from '@/store/useDisciplineStore'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

const CFA_SUBJECTS = [
  'Basics of Multiple Regression',
  'Evaluating Regression Model Fit and Interpreting Model Results',
  'Model Misspecification',
  'Extensions of Multiple Regression',
  'Time Series Analysis',
  'Machine Learning',
  'Big Data Projects',
  'Currency Exchange Rates: Understanding Equilibrium Value',
  'Economic Growth',
  'Intercorporate Investments',
  'Employee Compensation: Post-Employment and Share-Base',
  'Multinational Operations',
  'Analysis of Financial Institutions',
  'Evaluating Quality of Financial Reports',
  'Integration of Financial Statement Analysis Techniques',
  'Analysis of Dividends and Share Repurchases',
  'ESG Considerations in Investment Analysis',
  'Cost of Capital: Advanced Topics',
  'Corporate Restructuring',
  'Equity Valuation: Applications and Processes',
  'Discounted Dividend Valuation',
  'Free Cash Flow Valuation',
  'Market-Based Valuation: Price and Enterprise Value Multiples',
  'Residual Income Valuation',
  'Private Company Valuation',
  'The Term Structure and Interest Rate Dynamics',
  'The Arbitrage-Free Valuation Framework',
  'Valuation and Analysis of Bonds with Embedded Options',
  'Credit Analysis Models',
  'Credit Default Swaps',
  'Pricing and Valuation of Forward Commitments',
  'Valuation of Contingent Claims',
  'Introduction to Commodities & Commodities Derivatives',
  'Overviews & Types of REI',
  'Real Estate Investments (REI) via Publicily Traded Investments',
  'Hedge Fund Strategies (HFS)',
  'Exchange Traded Funds: Mechanics & Applications',
  'Using Multifactor Models',
  'Measuring & Managing Market Risk',
  'Backtesting & Simulation',
  'Economics & Investment Markets',
  'Analysis of Active Portfolio Management',
  'Code of Ethics and Standards Professional Conduct',
  'Guidance for Standards I-VII',
  'Application of Code and Standards: Level II',
]

const TAGS = ['Module', 'Study', 'Revision', 'Question Solving', 'Mock Exams', 'Subject Mocks', 'Weekend Revision']

export default function Planner() {
  const { tasks, addTask, toggleTaskCompletion, deleteTask } = usePlannerStore()
  const { dailyMinGoalHours } = useSettingsStore()
  const { dailyLogs } = useDisciplineStore()

  const [showAdd, setShowAdd] = useState(false)
  const [newSubject, setNewSubject] = useState(CFA_SUBJECTS[0])
  const [newTag, setNewTag] = useState(TAGS[0])
  const [newPomodoros, setNewPomodoros] = useState(2)
  const [newTime, setNewTime] = useState('09:00')
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0])

  const handleAdd = async () => {
    await addTask({
      date: newDate,
      plannedTime: newTime,
      subject: newSubject,
      tag: newTag,
      plannedPomodoros: newPomodoros
    })
    setShowAdd(false)
  }

  const todayDate = new Date().toISOString().split('T')[0]
  const todayTasks = tasks.filter(t => t.date === todayDate)
  const completedToday = todayTasks.filter(t => t.isCompleted).length
  const todayLog = dailyLogs[todayDate]
  const studiedHoursToday = todayLog ? (todayLog.studiedMinutes / 60) : 0
  const goalProgress = Math.min(100, (studiedHoursToday / dailyMinGoalHours) * 100)

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Strategic Planner</h1>
          <p className="text-foreground/60 mt-2">Map out your study blocks and commit.</p>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)}>
          <Plus className="w-5 h-5 mr-2" />
          Add Block
        </Button>
      </div>

      {/* Daily Progress Bar */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="font-medium">Daily Goal Progress</span>
            </div>
            <span className={cn("font-bold", goalProgress >= 100 ? "text-success" : "text-foreground/70")}>
              {studiedHoursToday.toFixed(1)}h / {dailyMinGoalHours}h
            </span>
          </div>
          <div className="w-full bg-foreground/10 h-2.5 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", goalProgress >= 100 ? "bg-success" : "bg-primary")}
              style={{ width: `${goalProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-foreground/50">
            <span>{completedToday} tasks completed today</span>
            {goalProgress >= 100
              ? <span className="text-success font-semibold">✓ Daily minimum met!</span>
              : <span>{((dailyMinGoalHours - studiedHoursToday) * 60).toFixed(0)}min to go</span>}
          </div>
        </CardContent>
      </Card>

      {/* Add Task Form */}
      {showAdd && (
        <Card className="animate-in fade-in slide-in-from-top-4">
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium">Subject</label>
              <select
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
              >
                {CFA_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Tag</label>
              <select
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              >
                {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Date</label>
              <input
                type="date"
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Time Slot</label>
              <input
                type="time"
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Pomodoros</label>
              <input
                type="number" min="1" max="10"
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={newPomodoros}
                onChange={(e) => setNewPomodoros(parseInt(e.target.value))}
              />
            </div>
            <div className="md:col-span-3 flex space-x-3">
              <Button onClick={handleAdd} className="flex-1">Save Task</Button>
              <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Today's Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Mission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {todayTasks.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
              <p className="text-foreground/50 text-sm mb-3">No sessions yet — complete your first one to see stats</p>
              <Button size="sm" onClick={() => setShowAdd(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Block
              </Button>
            </div>
          ) : (
            todayTasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  "p-4 rounded-xl border flex items-center justify-between transition-colors hover:bg-foreground/5",
                  task.isCompleted ? "border-success/50 bg-success/5" : "border-border"
                )}
              >
                <div className="flex items-center space-x-4">
                  <button
                    className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                      task.isCompleted ? "border-success bg-success" : "border-border"
                    )}
                    onClick={() => toggleTaskCompletion(task.id)}
                  >
                    {task.isCompleted && <Check className="w-4 h-4 text-background" />}
                  </button>
                  <div>
                    <h3 className={cn("font-semibold", task.isCompleted && "line-through text-foreground/50")}>
                      {task.subject}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1 flex-wrap gap-y-1">
                      {task.plannedTime && (
                        <span className="text-xs font-medium bg-foreground/10 text-foreground px-2 py-0.5 rounded">
                          {task.plannedTime}
                        </span>
                      )}
                      <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
                        {task.tag}
                      </span>
                      <span className="text-xs text-foreground/50">
                        {task.completedPomodoros}/{task.plannedPomodoros} 🍅
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Pomodoro mini progress */}
                  <div className="flex space-x-1">
                    {Array.from({ length: task.plannedPomodoros }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-2 h-2 rounded-full",
                          i < task.completedPomodoros ? "bg-primary" : "bg-border"
                        )}
                      />
                    ))}
                  </div>
                  <Button variant="ghost" size="icon" className="text-foreground/30 hover:text-danger"
                    onClick={() => deleteTask(task.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Upcoming Tasks */}
      {tasks.filter(t => t.date > todayDate).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Blocks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks
              .filter(t => t.date > todayDate)
              .sort((a, b) => a.date.localeCompare(b.date))
              .slice(0, 5)
              .map(task => (
                <div key={task.id} className="p-4 rounded-xl border border-border flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm">{task.subject}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-foreground/50">{task.date}</span>
                      {task.plannedTime && <span className="text-xs text-foreground/50">@ {task.plannedTime}</span>}
                      <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded">{task.tag}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-foreground/30 hover:text-danger"
                    onClick={() => deleteTask(task.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
