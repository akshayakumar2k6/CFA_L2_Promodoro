"use client"
import { useDisciplineStore } from '@/store/useDisciplineStore'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Flame, Check, X } from 'lucide-react'
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns'
import { cn } from '@/lib/utils'

export default function CalendarView() {
  const { dailyLogs } = useDisciplineStore()

  const today = new Date()
  const monthStart = startOfMonth(today)
  const monthEnd = endOfMonth(today)
  const startDate = startOfWeek(monthStart)
  const endDate = addDays(startOfWeek(monthEnd), 6)

  const dateInterval = eachDayOfInterval({ start: startDate, end: endDate })

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Discipline Calendar</h1>
        <p className="text-foreground/60 mt-2">Visualizing your commitment. Missed days break the streak.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">{format(monthStart, 'MMMM yyyy')}</CardTitle>
          <div className="flex space-x-4 text-sm font-medium">
            <div className="flex items-center"><Check className="w-4 h-4 text-success mr-1" /> Minimum Met</div>
            <div className="flex items-center"><X className="w-4 h-4 text-danger mr-1" /> Failed</div>
            <div className="flex items-center"><Flame className="w-4 h-4 text-warning fill-warning mr-1" /> Streak Active</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-px bg-border rounded-xl overflow-hidden mt-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-background text-center py-3 text-sm font-semibold text-foreground/60 border-b border-border">
                {day}
              </div>
            ))}
            
            {dateInterval.map((day, idx) => {
              const dayStr = format(day, 'yyyy-MM-dd')
              const log = dailyLogs[dayStr]
              const isCurrentMonth = isSameMonth(day, monthStart)
              
              let statusClass = "bg-background"
              let Icon = null
              
              if (log) {
                if (log.failed) {
                  statusClass = "bg-danger/10"
                  Icon = <X className="w-6 h-6 text-danger" />
                } else if (log.minimumMet) {
                  statusClass = "bg-success/10 border-success/30"
                  Icon = <Check className="w-6 h-6 text-success" />
                } else if (log.studiedMinutes > 0) {
                  statusClass = "bg-primary/5" // Partial
                }
              }

              return (
                <div 
                  key={dayStr}
                  className={cn(
                    "min-h-[120px] p-2 transition-colors relative border-r border-b border-border",
                    !isCurrentMonth ? "bg-card/50 text-foreground/30 border-transparent" : statusClass
                  )}
                >
                  <span className={cn("text-xs font-semibold", !isCurrentMonth ? "opacity-50" : "opacity-100")}>
                    {format(day, 'd')}
                  </span>
                  
                  {isCurrentMonth && log && log.studiedMinutes > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className="text-xs font-mono">{Math.floor(log.studiedMinutes / 60)}h {log.studiedMinutes % 60}m</div>
                      <div className="w-full bg-foreground/10 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full", log.minimumMet ? "bg-success" : "bg-primary")} 
                          style={{ width: `${Math.min(100, (log.studiedMinutes / (day.getDay() === 0 || day.getDay() === 6 ? 240 : 120)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-2 right-2 flex space-x-1">
                    {log?.minimumMet && <Flame className="w-4 h-4 text-warning fill-warning opacity-50" />}
                    {Icon}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
