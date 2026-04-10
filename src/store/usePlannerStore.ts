import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CFASubject = 
  | 'Ethical and Professional Standards'
  | 'Quantitative Methods'
  | 'Economics'
  | 'Financial Statement Analysis'
  | 'Corporate Issuers'
  | 'Equity Investments'
  | 'Fixed Income'
  | 'Derivatives'
  | 'Alternative Investments'
  | 'Portfolio Management'

export type StudyTag = 'Study' | 'Revision' | 'Question Solving' | 'Mock Exams' | 'Subject Mocks' | 'Weekend Revision'

export interface Task {
  id: string
  date: string // YYYY-MM-DD
  subject: CFASubject
  tag: StudyTag
  plannedPomodoros: number
  completedPomodoros: number
  isCompleted: boolean
  notes?: string
}

export interface PlannerState {
  tasks: Task[]
  
  // Actions
  addTask: (task: Omit<Task, 'id' | 'completedPomodoros' | 'isCompleted'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  incrementTaskPomodoro: (id: string) => void
  toggleTaskCompletion: (id: string) => void
}

export const usePlannerStore = create<PlannerState>()(
  persist(
    (set) => ({
      tasks: [],

      addTask: (task) => set((state) => ({
        tasks: [
          ...state.tasks,
          {
            ...task,
            id: Date.now().toString(),
            completedPomodoros: 0,
            isCompleted: false
          }
        ]
      })),

      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t))
      })),

      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id)
      })),

      incrementTaskPomodoro: (id) => set((state) => ({
        tasks: state.tasks.map((t) => {
          if (t.id === id) {
            const completed = t.completedPomodoros + 1
            return {
              ...t,
              completedPomodoros: completed,
              isCompleted: completed >= t.plannedPomodoros ? true : t.isCompleted
            }
          }
          return t
        })
      })),

      toggleTaskCompletion: (id) => set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))
      }))
    }),
    {
      name: 'planner-storage',
    }
  )
)
