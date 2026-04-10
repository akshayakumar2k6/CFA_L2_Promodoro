import { create } from 'zustand'
import { createTaskDB, toggleTaskCompletionDB, incrementTaskPomodoroDB, deleteTaskDB } from '@/app/actions'

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
  plannedTime?: string | null
  subject: string
  module?: string | null
  tag: string
  plannedPomodoros: number
  completedPomodoros: number
  isCompleted: boolean
  notes?: string | null
}

export interface PlannerState {
  tasks: Task[]
  
  // Actions
  setTasks: (tasks: Task[]) => void
  addTask: (task: Omit<Task, 'id' | 'completedPomodoros' | 'isCompleted'>) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => Promise<void>
  incrementTaskPomodoro: (id: string) => Promise<void>
  toggleTaskCompletion: (id: string) => Promise<void>
}

export const usePlannerStore = create<PlannerState>()((set, get) => ({
  tasks: [],

  setTasks: (tasks) => set({ tasks }),

  addTask: async (task) => {
    // Optimistic update omitted for simplicity, fetching exact DB object
    const res = await createTaskDB(task)
    if (res.success && res.task) {
      set((state) => ({
        tasks: [...state.tasks, res.task as Task]
      }))
    }
  },

  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t))
  })),

  deleteTask: async (id) => {
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }))
    await deleteTaskDB(id)
  },

  incrementTaskPomodoro: async (id) => {
    const task = get().tasks.find(t => t.id === id)
    if (!task) return
    
    // Optimistic
    const newCompleted = task.completedPomodoros + 1
    const isCompleted = newCompleted >= task.plannedPomodoros ? true : task.isCompleted
    
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, completedPomodoros: newCompleted, isCompleted } : t))
    }))

    await incrementTaskPomodoroDB(id, task.completedPomodoros, task.plannedPomodoros)
  },

  toggleTaskCompletion: async (id) => {
    const task = get().tasks.find(t => t.id === id)
    if (!task) return

    // Optimistic
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))
    }))

    await toggleTaskCompletionDB(id, !task.isCompleted)
  }
}))
