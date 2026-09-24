# Smart Campus 360
Next.js 14 (App Router) · TypeScript · Tailwind · Firebase-ready.
```
npm install && npm run dev
```
Open http://localhost:3000, pick a role on /login (any email works in demo mode).
- `lib/store.tsx` holds simulated real-time state; each action maps to a Firestore call (see `lib/firebase.ts`).
- Role → pages is in `components/Shell.tsx` (`NAV`). Enforce the same rules in Firestore security rules.
- IoT: sensors update `waterPoints/{id}.level`; UI derives status from it.
