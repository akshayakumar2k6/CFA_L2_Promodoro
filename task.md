# V3 Task List (Online Platform)

- `[x]` Restructure `src/app/actions.ts` into individual atomic CRUD Server Actions mapping accurately to `useDisciplineStore`, `useGamificationStore`, and `usePlannerStore`.
- `[x]` Update all global Zustand stores to remove `persist` middleware entirely.
- `[x]` Wrap Zustand store functions computationally around Prisma DB mutations to await Cloud sync before optimizing UI (or use optimistic rendering).
- `[x]` Fetch global state via Database directly in `src/app/layout.tsx`.
- `[x]` Create `<StoreInitializer />` client component.
- `[x]` Validate app load successfully hydrates local memory stores natively on startup.
- `[x]` Remove deprecated "Sync Cloud" header button.
