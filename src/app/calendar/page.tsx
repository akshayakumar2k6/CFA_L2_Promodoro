"use client"
import { useState } from 'react'
import { useDisciplineStore } from '@/store/useDisciplineStore'
import { usePlannerStore } from '@/store/usePlannerStore'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Flame, Check, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths } from 'date-fns'
import { cn } from '@/lib/utils'

interface DayPopoverProps {
  dayStr: string
  log: any
  tasks: any[]
  onClose: () => void
}

function DayPopover({ dayStr, log, tasks, onClose }: DayPopoverProps) {
  const dayTasks = tasks.filter(t => t.date === dayStr)
  const studiedH = log ? Math.floor(log.studiedMinutes / 60) : 0
  const studiedMin = log ? log.studiedMinutes % 60 : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-card border border-border rounded-2xl p-6 w-80 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">{format(new Date(dayStr + 'T00:00'), 'MMMM d, yyyy')}</h3>
          <button onClick={onClose} className="text-foreground/40 hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-foreground/60">Total Study Time</span>
            <span className="font-bold">{log ? `${studiedH}h ${studiedMin}m` : '—'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-foreground/60">Minimum Met</span>
            <span className={cn("font-bold", log?.minimumMet ? "text-success" : "text-foreground/40")}>
              {log?.minimumMet ? "✓ Yes" : "—"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-foreground/60">Sessions Planned</span>
            <span className="font-bold">{dayTasks.length}</span>
          </div>
          {dayTasks.length > 0 && (
            <div className="mt-3 border-t border-border pt-3 space-y-2">
              <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wide">Subjects</p>
              {dayTasks.map(t => (
                <div key={t.id} className="flex items-center justify-between text-sm">
                  <span className="text-foreground/80 truncate">{t.subject}</span>
                  <span className={cn("text-xs font-medium ml-2", t.isCompleted ? "text-success" : "text-foreground/40")}>
                    {t.isCompleted ? "✓ Done" : `${t.completedPomodoros}/${t.plannedPomodoros} 🍅`}
                  </span>
                </div>
              ))}
            </div>
          )}
          {dayTasks.length === 0 && !log && (
            <p className="text-sm text-foreground/40 text-center py-2">No activity recorded</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CalendarView() {
  const { dailyLogs } = useDisciplineStore()
  const { tasks } = usePlannerStore()

  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const startDate = startOfWeek(monthStart)
  const endDate = addDays(startOfWeek(monthEnd), 6)

  const dateInterval = eachDayOfInterval({ start: startDate, end: endDate })

  const selectedLog = selectedDay ? dailyLogs[selectedDay] : null
  const selectedTasks = selectedDay ? tasks.filter(t => t.date === selectedDay) : []

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Discipline Calendar</h1>
        <p className="text-foreground/60 mt-2">Visualizing your commitment. Missed days break the streak.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 rounded-lg border border-border hover:bg-foreground/5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <CardTitle className="text-2xl">{format(monthStart, 'MMMM yyyy')}</CardTitle>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 rounded-lg border border-border hover:bg-foreground/5 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex space-x-4 text-sm font-medium">
            <div className="flex items-center"><Check className="w-4 h-4 text-success mr-1" /> Minimum Met</div>
            <div className="flex items-center"><X className="w-4 h-4 text-danger mr-1" /> Failed</div>
            <div className="flex items-center"><Flame className="w-4 h-4 text-warning fill-warning mr-1" /> Active</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-px bg-border rounded-xl overflow-hidden mt-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-background text-center py-3 text-sm font-semibold text-foreground/60 border-b border-border">
                {day}
              </div>
            ))}

            {dateInterval.map((day) => {
              const dayStr = format(day, 'yyyy-MM-dd')
              const log = dailyLogs[dayStr]
              const isCurrentMonth = isSameMonth(day, monthStart)
              const isToday = dayStr === format(new Date(), 'yyyy-MM-dd')
              const dayTasks = tasks.filter(t => t.date === dayStr)

              let statusClass = "bg-background"
              let Icon = null

              if (log) {
                if (log.failed) {
                  statusClass = "bg-danger/10"
                  Icon = <X className="w-5 h-5 text-danger" />
                } else if (log.minimumMet) {
                  statusClass = "bg-success/10"
                  Icon = <Check className="w-5 h-5 text-success" />
                } else if (log.studiedMinutes > 0) {
                  statusClass = "bg-primary/5"
                }
              }

              return (
                <button
                  key={dayStr}
                  onClick={() => isCurrentMonth && setSelectedDay(dayStr)}
                  className={cn(
                    "min-h-[110px] p-2 transition-colors relative border-r border-b border-border text-left",
                    !isCurrentMonth ? "bg-card/50 text-foreground/20 cursor-default" : cn(statusClass, "hover:brightness-110 cursor-pointer"),
                    isToday && "ring-2 ring-inset ring-primary"
                  )}
                >
                  <span className={cn(
                    "text-xs font-bold inline-flex items-center justify-center w-6 h-6 rounded-full",
                    isToday ? "bg-primary text-white" : "opacity-80"
                  )}>
                    {format(day, 'd')}
                  </span>

                  {isCurrentMonth && log && log.studiedMinutes > 0 && (
                    <div className="mt-1.5 space-y-1">
                      <div className="text-xs font-mono text-foreground/60">
                        {Math.floor(log.studiedMinutes / 60)}h {log.studiedMinutes % 60}m
                      </div>
                      <div className="w-full bg-foreground/10 h-1 rounded-full overflow-hidden">
                        <div
                          className={cn("h-full", log.minimumMet ? "bg-success" : "bg-primary")}
                          style={{ width: `${Math.min(100, (log.studiedMinutes / (day.getDay() === 0 || day.getDay() === 6 ? 240 : 120)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {isCurrentMonth && dayTasks.length > 0 && (
                    <div className="mt-1 flex flex-col gap-1 w-full overflow-hidden">
                      {dayTasks.slice(0, 3).map((t, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "text-[10px] truncate px-1 py-0.5 rounded-sm border font-medium leading-none",
                            t.isCompleted 
                              ? "bg-success/10 text-success border-success/20" 
                              : "bg-primary/10 text-primary border-primary/20"
                          )}
                          title={t.subject}
                        >
                          {t.subject}
                        </div>
                      ))}
                      {dayTasks.length > 3 && (
                        <span className="text-[9px] font-bold text-foreground/40 text-center">+{dayTasks.length - 3} MORE</span>
                      )}
                    </div>
                  )}

                  <div className="absolute bottom-1.5 right-1.5 flex space-x-0.5">
                    {log?.minimumMet && <Flame className="w-3.5 h-3.5 text-warning fill-warning opacity-60" />}
                    {Icon && <div className="scale-75 opacity-80">{Icon}</div>}
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {selectedDay && (
        <DayPopover
          dayStr={selectedDay}
          log={selectedLog}
          tasks={selectedTasks}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  )
}
