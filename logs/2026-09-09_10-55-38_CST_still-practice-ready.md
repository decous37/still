# Still Practice Progress Log

updated_at: 2026-09-09 10:55:38 CST
status: ready
version: 0.1.0
commit: 1a5c396
scope: expanded practice bank, visible question list, local completion stats, simplified wrong-answer flow

## Project Basics

- Project path: `/Users/decous/TempFiles/Earn_tring/still`
- Active route: `app/page.tsx`
- Main app component: `components/still/air-app.tsx`
- Practice component: `components/still/live-practice.tsx`
- Question source: `components/still/questions.ts`
- Engine logic: `components/still/engine.ts`
- Current local URL: `http://localhost:3000`

## Current User-Facing Behavior

- The app opens directly into practice, defaulting to sentence ordering: `整理一句话`.
- The old six-question mini-practice entry and sample data have been removed.
- The old `完整混合题库` space is no longer shown.
- Current practice set list is visible above the exercise and supports direct question selection.
- Each list item displays a locally persisted completion count.
- Completion counts are stored per browser/user in `localStorage` under `still:question-completions:v1`.
- Wrong input now immediately triggers feedback, clears current input, and lets the user retry without a `继续` prompt.
- Sentence ordering blocks have trailing sentence periods removed.

## Content State

- Total active questions: 204.
- English: 102 questions.
- Chinese: 102 questions.
- Per language: 34 word rebuild, 34 sentence ordering, 34 recall questions.
- `createPracticeSet(locale, mode)` returns the selected language and mode collection instead of a fixed 12-question sample.
- Stable question IDs are preserved for old questions; added questions use non-overlapping IDs.

## Verification

- `npx vitest run` passed.
- `npx tsc --noEmit` passed.
- Targeted `npx oxlint` passed for active Still files and styles.
- `npm run build` passed.
- Browser checks confirmed:
  - Library page shows three 34-question mode entries.
  - Practice page shows `01 / 34` for the selected mode.
  - Question list selection works.
  - Completion count increments after success.
  - Completion count persists after refresh.
  - Wrong selection clears current input.
  - Sentence blocks render without trailing periods.

## Known Notes

- Full `npm run lint` may still report unrelated existing UI-library warnings outside the active Still flow; do not treat that as newly introduced Still logic unless rechecked.
- Mouse pointer stutter has not been conclusively reproduced or claimed fixed. Style cleanup reduced hover movement risk, but system/browser/dev-preview causes still require evidence.
- Real-device, Safari, keyboard, screen reader, 200% zoom, and reduced-motion validation remain separate acceptance items.

## Git State At Log Time

- Latest commit: `1a5c396 Initialize Still practice app`
- Commit fields:
  - `version: 0.1.0`
  - `status: ready`
  - `summary: Connect expanded 204-question practice bank, direct sentence entry, question list selection, local completion counts, simplified wrong-answer reset flow, and handoff diagnostics.`
- Working tree was clean before this log file was created.

## Log Policy Reminder

- The `logs` folder should only be updated when the user explicitly asks for a progress log.
- Do not routinely or automatically update these files during normal development.
