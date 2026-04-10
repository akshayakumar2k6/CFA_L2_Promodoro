"use client"
import { useSettingsStore } from '@/store/useSettingsStore'

function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr)
  const now = new Date()
  now.setHours(0,0,0,0)
  target.setHours(0,0,0,0)
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function ExamCountdownBanner() {
  const examDate = useSettingsStore(s => s.examDate)
  
  if (!examDate) return null
  
  const days = getDaysUntil(examDate)
  
  if (days < 0) return null

  const urgencyColor = days <= 14 ? 'from-danger/20 to-danger/5 border-danger/30 text-danger' 
    : days <= 30 ? 'from-warning/20 to-warning/5 border-warning/30 text-warning'
    : 'from-primary/20 to-primary/5 border-primary/30 text-primary'

  return (
    <div className={`mx-6 mt-4 mb-2 rounded-xl border bg-gradient-to-r ${urgencyColor} py-2.5 px-4 flex items-center justify-between`}>
      <div className="text-sm font-semibold">
        🎯 CFA L2 Exam
      </div>
      <div className="text-sm font-bold">
        {days === 0 ? 'Today is exam day!' : `${days} days remaining`}
      </div>
    </div>
  )
}
