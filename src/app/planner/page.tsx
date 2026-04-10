"use client"
import { useState } from 'react'
import { Plus, Check, PlayCircle } from 'lucide-react'
import { usePlannerStore, CFASubject, StudyTag } from '@/store/usePlannerStore'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

const SUBJECTS: CFASubject[] = [
  'Ethical and Professional Standards', 'Quantitative Methods', 'Economics', 
  'Financial Statement Analysis', 'Corporate Issuers', 'Equity Investments', 
  'Fixed Income', 'Derivatives', 'Alternative Investments', 'Portfolio Management'
]

const TAGS: StudyTag[] = ['Study', 'Revision', 'Question Solving', 'Mock Exams', 'Subject Mocks', 'Weekend Revision']

export default function Planner() {
  const { tasks, addTask, toggleTaskCompletion } = usePlannerStore()
  
  const [showAdd, setShowAdd] = useState(false)
  const [newSubject, setNewSubject] = useState<CFASubject>(SUBJECTS[0])
  const [newTag, setNewTag] = useState<StudyTag>(TAGS[0])
  const [newPomodoros, setNewPomodoros] = useState(2)
  const [newTime, setNewTime] = useState("09:00")

  const handleAdd = () => {
    addTask({
      date: new Date().toISOString().split('T')[0],
      plannedTime: newTime,
      subject: newSubject,
      tag: newTag,
      plannedPomodoros: newPomodoros
    })
    setShowAdd(false)
  }

  // Filter tasks for today simply
  const todayDate = new Date().toISOString().split('T')[0]
  const todayTasks = tasks.filter(t => t.date === todayDate)

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

      {showAdd && (
        <Card className="animate-in fade-in slide-in-from-top-4">
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="space-y-2 flex flex-col">
              <label className="text-sm font-medium">Subject</label>
              <select 
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value as CFASubject)}
              >
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-2 flex flex-col">
              <label className="text-sm font-medium">Tag</label>
              <select 
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value as StudyTag)}
              >
                {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-2 flex flex-col">
              <label className="text-sm font-medium">Time</label>
              <input 
                type="time" 
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />
            </div>
            <div className="space-y-2 flex flex-col">
              <label className="text-sm font-medium">Pomodoros</label>
              <input 
                type="number" 
                min="1" max="10"
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={newPomodoros}
                onChange={(e) => setNewPomodoros(parseInt(e.target.value))}
              />
            </div>
            <Button onClick={handleAdd} className="w-full">Save Task</Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Today's Mission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {todayTasks.length === 0 ? (
            <div className="text-center py-12 text-foreground/50 border-2 border-dashed border-border rounded-lg">
              No tasks planned for today. Add a block to get started.
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
                    <h3 className={cn("font-semibold text-lg", task.isCompleted && "line-through text-foreground/50")}>
                      {task.subject}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {task.plannedTime && (
                        <span className="text-xs font-medium bg-foreground/10 text-foreground px-2 py-0.5 rounded">
                          {task.plannedTime}
                        </span>
                      )}
                      <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
                        {task.tag}
                      </span>
                      <span className="text-xs text-foreground/50">
                        {task.completedPomodoros} / {task.plannedPomodoros} Pomodoros
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80">
                    <PlayCircle className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
