

# Plan: Analytics Dashboard, Password Reset, and Community Leaderboard

## 1. Password Reset Flow

**Database changes:** None needed.

**New files:**
- `src/pages/ResetPassword.tsx` — Page at `/reset-password` where users land after clicking the reset link in their email. Checks for `type=recovery` in URL hash, shows a "set new password" form, calls `supabase.auth.updateUser({ password })`.

**Modified files:**
- `src/components/AuthModal.tsx` — Add "Forgot password?" link in login mode. Calls `supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/reset-password' })` and shows a toast confirming email was sent.
- `src/App.tsx` — Add route for `/reset-password`.

## 2. Analytics Dashboard

**Database changes:** None — we'll query the existing `hook_history` table which already stores scores, strength, hooks, and timestamps per user.

**New files:**
- `src/pages/Dashboard.tsx` — Protected route showing:
  - Score trend chart (line chart of scores over time using recharts, already available via the chart component)
  - Average score, total hooks analyzed, best score stats cards
  - Score distribution breakdown (how many hooks in each verdict category)
  - Recent history list
- `src/components/dashboard/ScoreTrendChart.tsx` — Recharts line chart
- `src/components/dashboard/StatsCards.tsx` — Summary stat cards
- `src/components/dashboard/ScoreDistribution.tsx` — Bar/pie chart of verdict categories

**Modified files:**
- `src/App.tsx` — Add `/dashboard` route
- `src/pages/Index.tsx` — Add "Dashboard" link in nav for authenticated users

## 3. Community Leaderboard

**Database changes (migration):**
- Add a `public_hooks` table: `id`, `user_id`, `hook`, `score`, `verdict`, `shared_at` with RLS allowing anyone to SELECT but only the owner to INSERT/DELETE
- Add an RLS policy on `profiles` allowing public SELECT of `id` and `email` (for display names), or add a `display_name` column to profiles

**New files:**
- `src/pages/Leaderboard.tsx` — Public page showing top-scoring hooks from the community, sorted by score descending. Each entry shows the hook text, score badge, verdict, and anonymized creator name.
- `src/components/leaderboard/LeaderboardTable.tsx` — The ranked list component

**Modified files:**
- `src/components/HookTester.tsx` — Add a "Share to Leaderboard" button on results with score >= 60
- `src/App.tsx` — Add `/leaderboard` route
- `src/pages/Index.tsx` — Add "Leaderboard" link in nav

## Implementation Order

1. Password Reset (simplest, standalone)
2. Analytics Dashboard (uses existing data)
3. Community Leaderboard (new table + sharing logic)

## Technical Notes

- Charts will use the existing recharts integration via shadcn's chart component
- Dashboard is auth-gated; redirects to home if not logged in
- Leaderboard is public; no auth required to view
- All new pages will match the existing creator-native dark theme with glass effects

