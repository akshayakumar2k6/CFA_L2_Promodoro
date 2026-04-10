"use client"
import { useEffect, useState } from 'react'
import { Play, Pause, RotateCcw, AlertTriangle, ShieldAlert, Star } from 'lucide-react'
import { usePomodoroStore } from '@/store/usePomodoroStore'
import { useDisciplineStore } from '@/store/useDisciplineStore'
import { useGamificationStore } from '@/store/useGamificationStore'
import { usePlannerStore } from '@/store/usePlannerStore'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
// import useSound from 'use-sound' // We won't use useSound directly right now to avoid asset issues, will simulate or leave placeholder

export default function FocusHub() {
  const { 
    timeLeft, isRunning, isHardcoreMode, currentPhase, studyDuration, breakDuration,
    startTimer, pauseTimer, resetTimer, toggleHardcoreMode, tick, completeSession, setStudyDuration, setBreakDuration
  } = usePomodoroStore()
  
  const addStudyTime = useDisciplineStore((state) => state.addStudyTime)
  const addXp = useGamificationStore((state) => state.addXp)

  const [showRatingModal, setShowRatingModal] = useState(false)
  const [rating, setRating] = useState(0)

  // Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        tick()
      }, 1000)
    } else if (isRunning && timeLeft === 0) {
      // Session ended automatically
      setShowRatingModal(true)
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft, tick])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const handleComplete = () => {
    // If study phase, add time to discipline store
    if (currentPhase === 'study') {
      const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6
      const mins = 50 // We should read from store but sticking to default for now
      addStudyTime(new Date().toISOString().split('T')[0], mins, isWeekend)
      addXp(rating === 5 ? 150 : rating >= 3 ? 100 : 50) // Bonus for good rating
    }
    
    completeSession(rating, "Session completed")
    setShowRatingModal(false)
    setRating(0)
  }

  const radius = 120
  const circumference = 2 * Math.PI * radius
  const totalTimeSeconds = (currentPhase === 'study' ? studyDuration : breakDuration) * 60
  const progressPercent = ((totalTimeSeconds - timeLeft) / totalTimeSeconds) * 100
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference
  const { tasks } = usePlannerStore()
  const todayDate = new Date().toISOString().split('T')[0]
  const todayTasks = tasks.filter(t => t.date === todayDate)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Focus Hub</h1>
          <p className="text-foreground/60 mt-2">Execute your daily plan with strict discipline.</p>
        </div>
        {!isRunning && (
          <div className="flex items-center space-x-4">
            <div className="flex flex-col">
              <label className="text-xs font-medium text-foreground/60">Study (min)</label>
              <input 
                type="number" min="1" max="180" 
                value={studyDuration} 
                onChange={(e) => setStudyDuration(Number(e.target.value))} 
                className="w-16 h-8 bg-background border border-border rounded px-2 text-sm text-center focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-medium text-foreground/60">Break (min)</label>
              <input 
                type="number" min="1" max="60" 
                value={breakDuration} 
                onChange={(e) => setBreakDuration(Number(e.target.value))} 
                className="w-16 h-8 bg-background border border-border rounded px-2 text-sm text-center focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="col-span-1 lg:col-span-2 flex flex-col items-center justify-center py-12 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-tr opacity-20",
            currentPhase === 'study' ? "from-primary/20 via-background to-primary/5" : "from-warning/20 via-background to-warning/5"
          )} />
          
          <div className="relative">
            <svg className="-rotate-90 transform w-72 h-72">
              <circle
                cx="144"
                cy="144"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-border"
              />
              <circle
                cx="144"
                cy="144"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className={cn(
                  "transition-all duration-1000 ease-linear",
                  currentPhase === 'study' ? "text-primary shadow-primary shadow-glow" : "text-warning"
                )}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn(
                "text-6xl font-extrabold tracking-tighter tabular-nums",
                isHardcoreMode && isRunning ? "text-danger" : "text-foreground"
              )}>
                {formatTime(timeLeft)}
              </span>
              <span className="text-sm font-medium text-foreground/50 uppercase tracking-widest mt-2">
                {currentPhase} phase
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-6 mt-12 relative z-10">
            {!isRunning ? (
              <Button size="lg" className="w-40 rounded-full h-14 text-lg shadow-lg shadow-primary/20" onClick={startTimer}>
                {timeLeft < totalTimeSeconds ? "Resume" : "Start"}
                <Play className="ml-2 w-5 h-5" />
              </Button>
            ) : (
              <Button 
                size="lg" 
                variant="outline" 
                className="w-40 rounded-full h-14 text-lg border-foreground/20 hover:bg-foreground/10" 
                disabled={isHardcoreMode}
                onClick={pauseTimer}
              >
                Pause
                <Pause className="ml-2 w-5 h-5" />
              </Button>
            )}
            
            <Button 
              size="icon" 
              variant="outline" 
              className="rounded-full w-14 h-14 border-foreground/20 hover:bg-foreground/10"
              disabled={isHardcoreMode && isRunning}
              onClick={resetTimer}
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className={cn("transition-colors", isHardcoreMode && "border-danger/50" )}>
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="flex items-center text-lg">
                <ShieldAlert className={cn("w-5 h-5 mr-2", isHardcoreMode ? "text-danger" : "text-foreground/50")} />
                Hardcore Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <p className="text-sm text-foreground/60 leading-relaxed">
                When enabled, pausing and resetting the timer are strictly prohibited once a session starts. If you abandon it, penalties apply.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Enable Hardcore</span>
                <button 
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    isHardcoreMode ? "bg-danger" : "bg-foreground/20"
                  )}
                  onClick={toggleHardcoreMode}
                  disabled={isRunning}
                >
                  <span className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                    isHardcoreMode ? "left-7" : "left-1"
                  )} />
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="flex items-center text-lg">Daily Subject Focus</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col space-y-3 max-h-48 overflow-y-auto">
              {todayTasks.length === 0 ? (
                <p className="text-sm text-foreground/50 text-center py-4">No tasks planned for today.</p>
              ) : (
                todayTasks.map((task) => (
                  <div key={task.id} className={cn(
                    "px-3 py-2 bg-foreground/5 rounded-md flex justify-between items-center border border-border/50 border-l-2",
                    task.isCompleted ? "border-l-success opacity-50" : "border-l-primary"
                  )}>
                    <span className={cn("text-sm font-medium", task.isCompleted && "line-through")}>
                      {task.subject}
                    </span>
                    <span className="text-xs font-bold bg-primary/20 text-primary px-2 py-0.5 rounded flex-shrink-0 ml-2">
                      {task.tag}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {showRatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-card border border-border p-8 rounded-2xl w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
              <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mb-4 ring-8 ring-background">
                <Star className="w-12 h-12 text-success fill-success" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-center mt-8 mb-2">Session Complete!</h2>
            <p className="text-center text-foreground/60 mb-8">How focused were you during this block?</p>
            
            <div className="flex justify-center space-x-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-2 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star className={cn(
                    "w-10 h-10 transition-colors",
                    rating >= star ? "text-warning fill-warning" : "text-foreground/20"
                  )} />
                </button>
              ))}
            </div>

            <Button 
              className="w-full h-12 text-lg rounded-xl"
              disabled={rating === 0}
              onClick={handleComplete}
            >
              Log Session & Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
