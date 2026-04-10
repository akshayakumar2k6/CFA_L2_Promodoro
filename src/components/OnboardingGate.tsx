"use client"
import { useSettingsStore } from '@/store/useSettingsStore'
import { OnboardingFlow } from '@/components/OnboardingFlow'

export function OnboardingGate() {
  const onboardingComplete = useSettingsStore(s => s.onboardingComplete)
  
  if (onboardingComplete) return null
  
  return <OnboardingFlow />
}
