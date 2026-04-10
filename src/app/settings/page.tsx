"use client"
import { useSettingsStore } from '@/store/useSettingsStore'
import { usePomodoroStore } from '@/store/usePomodoroStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Bell, Clock, Target, Calendar, Zap, Save } from 'lucide-react'
import { useState } from 'react'

export default function Settings() {
  const settings = useSettingsStore()
  const { setStudyDuration, setBreakDuration } = usePomodoroStore()
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setStudyDuration(settings.defaultStudyMins)
    setBreakDuration(settings.defaultBreakMins)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-foreground/60 mt-2">Configure your CFA OS study environment.</p>
      </div>

      {/* Exam Date */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span>Exam Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">CFA L2 Exam Date</label>
            <input
              type="date"
              value={settings.examDate || ''}
              onChange={e => settings.setExamDate(e.target.value)}
              className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Daily Minimum Study Goal: <span className="text-primary font-bold">{settings.dailyMinGoalHours}h</span>
            </label>
            <input
              type="range" min="0.5" max="10" step="0.5"
              value={settings.dailyMinGoalHours}
              onChange={e => settings.setDailyMinGoalHours(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-foreground/40">
              <span>0.5h</span><span>5h</span><span>10h</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timer Defaults */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-primary" />
            <span>Default Timer Durations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Study Duration (min)</label>
            <input
              type="number" min="5" max="180"
              value={settings.defaultStudyMins}
              onChange={e => settings.setDefaultStudyMins(Number(e.target.value))}
              className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Break Duration (min)</label>
            <input
              type="number" min="1" max="60"
              value={settings.defaultBreakMins}
              onChange={e => settings.setDefaultBreakMins(Number(e.target.value))}
              className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-primary" />
            <span>Notifications & Sound</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Session End Chime & Browser Alert</p>
              <p className="text-xs text-foreground/50 mt-0.5">Play a sound and send a notification when your timer ends</p>
            </div>
            <button
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.soundEnabled ? 'bg-primary' : 'bg-foreground/20'}`}
              onClick={() => settings.setSoundEnabled(!settings.soundEnabled)}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.soundEnabled ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* XP Visibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-primary" />
            <span>Gamification</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Show XP Rules</p>
              <p className="text-xs text-foreground/50 mt-0.5">Display XP breakdown info icon on Focus Hub</p>
            </div>
            <button
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.showXpRules ? 'bg-primary' : 'bg-foreground/20'}`}
              onClick={() => settings.setShowXpRules(!settings.showXpRules)}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.showXpRules ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full h-12 text-base">
        <Save className="w-4 h-4 mr-2" />
        {saved ? '✓ Saved!' : 'Save Settings'}
      </Button>
    </div>
  )
}
