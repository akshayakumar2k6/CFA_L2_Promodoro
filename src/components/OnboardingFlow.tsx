"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSettingsStore } from '@/store/useSettingsStore'
import { usePlannerStore } from '@/store/usePlannerStore'
import { BookOpen, CalendarDays, ArrowRight, Zap, Loader2 } from 'lucide-react'

const CFA_SUBJECTS = [
  'Equity Investments',
  'Fixed Income',
  'Derivatives',
  'Financial Statement Analysis',
  'Economics',
  'Portfolio Management',
]

export function OnboardingFlow() {
  const router = useRouter()
  const { completeOnboarding, setExamDate, setDailyMinGoalHours } = useSettingsStore()
  const { addTask } = usePlannerStore()

  const [step, setStep] = useState(1)
  const [examDateInput, setExamDateInput] = useState('')
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [goalHours, setGoalHours] = useState(2)
  const [isSaving, setIsSaving] = useState(false)

  const toggleSubject = (s: string) => {
    setSelectedSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  const handleFinish = async () => {
    setIsSaving(true)
    if (examDateInput) setExamDate(examDateInput)
    setDailyMinGoalHours(goalHours)

    // Pre-load selected subjects as today tasks
    const today = new Date().toISOString().split('T')[0]
    for (const subject of selectedSubjects) {
      await addTask({ date: today, subject, tag: 'Study', plannedPomodoros: 2 })
    }

    completeOnboarding()
    setIsSaving(false)
    router.refresh()
  }

  return (
    <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative w-full max-w-xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4 border border-primary/20">
            <Zap className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to CFA OS</h1>
          <p className="text-foreground/60 mt-2">Let's set up your study system in 2 quick steps.</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          {[1, 2].map(s => (
            <div key={s} className={`h-1.5 rounded-full transition-all ${s === step ? 'w-8 bg-primary' : s < step ? 'w-4 bg-primary/50' : 'w-4 bg-border'}`} />
          ))}
        </div>

        {/* Step 1: Exam Date + Goal */}
        {step === 1 && (
          <div className="bg-card border border-border rounded-2xl p-8 space-y-6 shadow-2xl">
            <div>
              <div className="flex items-center space-x-2 mb-5">
                <CalendarDays className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">Your CFA L2 Exam Date</h2>
              </div>
              <label className="block text-sm font-medium text-foreground/70 mb-2">Exam Date</label>
              <input
                type="date"
                value={examDateInput}
                onChange={e => setExamDateInput(e.target.value)}
                className="w-full h-11 bg-background border border-border rounded-lg px-4 text-sm focus:outline-none focus:border-primary text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-2">
                Daily Minimum Study Goal: <span className="text-primary font-bold">{goalHours}h</span>
              </label>
              <input
                type="range" min="1" max="8" step="0.5"
                value={goalHours}
                onChange={e => setGoalHours(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-foreground/40 mt-1">
                <span>1h</span><span>4h</span><span>8h</span>
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!examDateInput}
              className="w-full h-12 bg-primary text-white font-semibold rounded-xl flex items-center justify-center space-x-2 hover:bg-primary/90 transition-colors disabled:opacity-40"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Subject Pre-load */}
        {step === 2 && (
          <div className="bg-card border border-border rounded-2xl p-8 space-y-6 shadow-2xl">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Pre-load Today's CFA Subjects</h2>
            </div>
            <p className="text-sm text-foreground/60">Select the subjects you'll study today. We'll create tasks for each.</p>
            <div className="grid grid-cols-2 gap-3">
              {CFA_SUBJECTS.map(s => (
                <button
                  key={s}
                  onClick={() => toggleSubject(s)}
                  className={`p-3 rounded-xl border text-left text-sm font-medium transition-all ${
                    selectedSubjects.includes(s)
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-foreground/70 hover:border-primary/40'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              onClick={handleFinish}
              disabled={isSaving}
              className="w-full h-12 bg-primary text-white font-semibold rounded-xl flex items-center justify-center space-x-2 hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Launch CFA OS</span>
                  <Zap className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
