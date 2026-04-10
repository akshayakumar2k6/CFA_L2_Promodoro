# Pomodoro Productivity OS for CFA Level 2

This plan outlines the architecture and implementation steps for building a production-grade, offline-first Pomodoro study system.

## User Review Required

> [!IMPORTANT]
> Since this application uses `localStorage` heavily as the primary database, data will be tied to the user's specific browser and device. If cross-device syncing is needed in the future, a remote backend integration (like Firebase/Supabase) will be required. Please confirm if strictly offline with `localStorage` is completely sufficient for version 1.

> [!WARNING]
> Hardcore mode disabling pausing is clear, but be aware that if a user accidentally starts a session and closes the tab, the state might persist as running or be considered abandoned depending on the specific implementation choice. We will treat abandoned sessions without a proper end as "failed" to enforce strict discipline, unless specified otherwise.

## Proposed Architecture

The application will be built using **Next.js (App Router)** with a strict Dark Mode aesthetic. It will leverage **Zustand** for global state and `localStorage` persistence, and **Recharts** for analytics visualizations.

### 1. Project Setup & Configuration
- Initialize Next.js with TypeScript and Tailwind CSS.
- Configure Tailwind for extreme dark-mode aesthetics (deep blacks, slate grays, neon accents for gamification/alerts).
- Install core libraries: `zustand` (state), `recharts` (charts), `date-fns` (date manipulation), `lucide-react` (icons), `use-sound` (audio feedback).

### 2. State Management (Zustand Stores)
We will split the state logic into modular slices using Zustand's `persist` middleware to ensure offline capabilities:
- **`usePomodoroStore`**: Manages current timer state (running, paused, hardcore mode), session configuration (study/break duration), and logs completed sessions.
- **`usePlannerStore`**: Manages CFA subjects, study tags, and the daily planner tasks (planned Pomodoros vs completed).
- **`useDisciplineStore`**: Tracks streaks, daily minimums (2h weekday / 4h weekend), weekly targets (30 hours), penalties, and Focus/Efficiency scores.
- **`useGamificationStore`**: Manages user XP, unlocked rewards, and milestone tracking.

### 3. Core Features & UI Components

#### Main Dashboard Layout (`/app/page.tsx`)
A SaaS-style layout with a sidebar navigation and a main content area.
- Sidebar: Navigation between Focus Hub, Planner, Analytics, Calendar.
- Header: Quick stats (Current Streak, XP, Weekly Progress Bar).

#### Focus Hub (`/components/hub/...`)
- **Pomodoro Timer**: Circular progress indicator, Start/Pause/Reset controls. Hardcore mode toggle (disables Pause/Reset).
- **End-Session Modal**: Prompts for a 1-5 star Focus rating and optional notes.
- **Audio Feedback**: Subtle chimes on start, end, and failure warnings.

#### Strategic Planner (`/components/planner/...`)
- Interactive to-do list for daily tasks categorized by the 10 CFA subjects and core tags (Study, Revision, Question Solving, etc.).
- Task definition includes planned Pomodoro sessions and a completion toggle. 

#### Analytics & Performance (`/components/analytics/...`)
- **Dashboard**: High-level metrics for Total Study Time, Focus Score, Efficiency Score.
- **Charts**: Recharts bar/pie charts for subject-wise and tag-wise distribution.
- **Weak Subject Detection**: Warning cards for subjects with low time allocation or sub-optimal efficiency.
- **Performance Scoring**: An aggregated 0-100 score classifying the user as "On Track", "At Risk", or "Off Track".

#### Calendar & Discipline (`/components/calendar/...`)
- **Monthly Grid**: Displays indicators for daily success (`✅`), failure (`❌`), and ongoing streaks (`🔥`).
- **Discipline Engine**: Background checks (on state hydration and daily rollover) to verify if minimum study hours were met, applying streak resets and penalties as necessary.

### 4. Gamification & Visual Assets
- **XP Bar**: Fills up as minutes are logged, with level-up animations.
- **Sound Effects**: Integration of public domain or generated soft UI sounds for interactions.

## Verification Plan

### Automated/Offline Testing
- Use Next.js local development server (`npm run dev`) to verify responsiveness, zero-hydration errors, and Dark Mode enforcement.
- Verify `localStorage` persistence by hard-refreshing the browser during a Pomodoro session and checking if the state (current time logged, streak, tasks) is accurately recovered.
- Manipulate system time locally to verify daily minimum penalties and rollover logic.

### Manual Verification
- Go through a full user journey: Create a task -> Start Hardcore Pomodoro -> Finish & Rate Session -> View Analytics -> Check Calendar update.
- Ensure Recharts render appropriately without layout shifts.

Once approved, we will execute standard Next.js scaffolding in the `C:\Users\acer\Desktop\Promodoro Timer` directory and start building the components iteratively.
