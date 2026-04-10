# Pomodoro OS – CFA Level 2 Walkthrough

The Pomodoro Productivity application is successfully implemented as a robust, offline-first Next.js web application.

## Key Accomplishments

### Architecture & Tech Stack
- **Framework**: Next.js 15 (App Router) initialized with TypeScript, Tailwind CSS, and ESLint.
- **State Management**: **Zustand** stores (`usePomodoroStore`, `usePlannerStore`, `useDisciplineStore`, `useGamificationStore`) have been integrated. They perfectly utilize the `persist` middleware with `localStorage`, guaranteeing a strict offline-first capability.
- **Data Visualization**: Incorporated `recharts` for the Analytics Dashboard to chart focus hours.

### Implemented UI Features
- **Strict Dark Mode**: Tailwind CSS's Root and Layout have been hardcoded to enforce a sleek, distraction-free Dark Mode aesthetic.
- **Focus Hub (Timer)**: A visually engaging circular timer (`src/app/page.tsx`). Includes the requested **Hardcore Mode** switch. When toggled, players cannot pause or skip a session, creating strict discipline constraints.
- **Strategic Planner (`/planner`)**: A system to outline blocks by CFA Subject. Each block requires an estimation of Pomodoros. Tasks can be directly mapped to completion.
- **Analytics Dashboard (`/analytics`)**: Automatically calculates efficiency scores based on planned vs completed Pomodoros, displaying visually engaging Recharts with "At Risk/On Track" status labels.
- **Discipline Calendar (`/calendar`)**: Month view directly connecting to the `useDisciplineStore`. Colors indicate whether daily minimums were met, failed, or completely abandoned.
- **Global Gamification Header**: Level progression & daily streaks stay glued to the top of the interface across all routes.

## Deployment to Vercel

This repository is strictly configured to be deployed on Vercel without a database.
To deploy:
1. Initialize a git repository: `git init`
2. Commit all changes: `git add . && git commit -m "Initial commit"`
3. Push to GitHub.
4. Import the repo via Vercel Dashboard, select "Next.js" framework setup, and deploy instantly. No environment variables are necessary.

> [!TIP]
> Since this uses `localStorage` heavily, the data relies on the user's browser. If you switch computers (e.g. Desktop to Laptop), data won't port over unless you run the app on the same device. For Version 2.0, adding a Firebase or Supabase sync endpoint inside the Zustand `persist` middleware can enable cloud backups.

Enjoy the ultimate discipline-boosting CFA Level 2 study system!
