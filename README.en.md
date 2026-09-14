# Still

[简体中文](./README.md) | [English](./README.en.md)

Still is a small attention-training website for short breaks. Open the page and start with a few letters: follow their order, piece together a sentence, or read a line and recall a hidden word.

Each group has ten questions. There are no timers, rankings, or unlock requirements. The interface keeps the text in focus, with translucent light and dark themes. Sound and haptics can be turned off.

## How to play

Opening or refreshing the page starts at the first question in the first Words group, using your current language.

| Mode | What you do |
| --- | --- |
| Words | Follow the visible word and select its characters from left to right |
| Sentences | Select word blocks in the order shown by the sentence |
| Recall | Read the sentence, choose “Hide word,” then fill the gap from three options |

Correct selections turn green. A wrong selection briefly turns the whole text red, then resets the question. Finishing a question moves you to the next one automatically. For repeated characters, any unused block with the matching text is accepted.

Use Collection in the header to browse modes, groups, and questions. Opening Collection or Preferences freezes the exercise. After leaving the tab for another app or page, click “Continue” when you return.

Regular selections use a light key click. Finishing a question plays a short metallic chime; a mistake plays one electronic beep. Mute controls all three sounds, while haptics have a separate setting. Practice still works when the browser cannot play audio or vibrate.

## Questions and progress

The bank contains **600 questions**: 300 in Chinese and 300 in English. Each language has three modes, each mode has ten groups, and each group has ten questions.

The ten themes are Home, Nature, Light, Weather, Plants, Food, Reading, Travel, Objects, and Sound. Both languages share these themes, but the questions are not intended as line-by-line translations.

- The question number shows your position in the group. The progress strip counts distinct questions completed in that group.
- The number beside a question in Collection is its lifetime completion count. Unfinished questions show `0`.
- Repeating a question increases its completion count, but does not count twice toward group progress.
- Reaching question ten opens the group-end page. If you started partway through, the group may still have unfinished questions.
- “Repeat this group” clears progress for the current language and group, without erasing completion counts. “Next group” keeps any progress already saved for that group.

## Run locally

You need Node.js **22.13 or later** and npm. From the `still` directory containing `package.json`, run:

```sh
npm ci
npm run dev
```

Open the local address printed in the terminal, usually `http://localhost:3000`. The exercises do not require an account, API key, or database.

Available commands:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npx tsc --noEmit` | Check TypeScript types |
| `npx vitest run` | Run automated tests |
| `npm run lint` | Check code conventions |
| `npm run format` | Format code; this modifies files |
| `npm run build` | Create a production build |
| `npm start` | Run the build locally with Wrangler; build first |

`npm start` does not publish the website. Use the address printed in the terminal.

## Stack and source files

The interface uses React 19, TypeScript, Vinext / Vite, and Tailwind CSS 4. Controls such as the collection drawer use the existing Base UI component system. Web Audio synthesizes the sounds in the browser. Answer checking and progress tracking run on the client; there is no account system, application backend, or leaderboard.

| File | Responsibility |
| --- | --- |
| `app/page.tsx`, `app/layout.tsx` | Page entry, metadata, and initial language and theme |
| `components/still/air-app.tsx` | Navigation, preferences, group-end page, completion counts, and progress coordination |
| `components/still/live-practice.tsx` | Exercise interactions, background pausing, and question transitions |
| `components/still/engine.ts` | Answer checking and exercise state transitions |
| `components/still/draft-text.tsx`, `candidate-words.tsx` | Reference text and selectable blocks |
| `components/still/collection-drawer.tsx` | Collection drawer, group browsing, and question selection |
| `components/still/questions.ts` | Legacy questions, question types, group lookup, and display cleanup |
| `components/still/group-content.ts` | Content for the ten themes and references to legacy questions |
| `components/still/group-progress.ts` | Progress storage, deduplication, and migration of old records |
| `components/still/feedback.ts` | Key clicks, success and error sounds, and haptics |
| `components/still/use-preferences.ts`, `use-feedback-preferences.ts` | Language, theme, sound, and haptic preferences |
| `app/globals.css`, `air.css`, `live.css`, `fill.css` | Page styles, loaded in this order |

## Saved data

Language, theme, sound, haptics, question completion counts, and group progress are stored in the current browser’s `localStorage`. Chinese and English group progress are kept separately. Refreshing preserves these records, but does not resume the question you were answering.

There is no cross-device sync. Switching browsers or site addresses, or clearing site data, may make previous records unavailable. If storage is blocked, you can still practice, but records may not survive your next visit.

## Editing questions

The bank combines legacy questions in `questions.ts` with theme content in `group-content.ts`. The latter uses `@number` references for old questions and stable text IDs for new ones. Line order determines the order within a group.

Keep existing question and group IDs intact: local records depend on them. Maintain ten groups of ten questions for each language and mode, with no missing questions or duplicate group membership.

Sentence display and answer checking both use `answers[0]`. Alternative answers remain in the data, but the current exercise does not accept an order that differs from the visible sentence. Recall questions have one answer and two distinct distractors. Spaces in English sentence fragments are part of the content; a shared function removes sentence-ending punctuation.

Run `npx vitest run` after making changes. Existing tests cover bank size, group membership, normalized duplicate text, solvable answers, repeated characters, error resets, progress migration, and audio cancellation. Automated checks do not replace editorial review in either language.

## Scope and limitations

Still offers exercises in observation, sequencing, and short-term recall. Whether they improve attention during everyday reading or work has not been established through research. Completion counts and game accuracy are not evidence of that effect. This project does not diagnose or treat attention disorders.

Keyboard controls, screen-reader announcements, and reduced-motion support are implemented. Full screen-reader flows, 200% zoom, and audio and haptics on Safari and mobile devices still need hands-on testing. The reported pointer stutter or drift has no confirmed root cause and should not be considered fixed.

## Related documentation

These documents are in Chinese, except for the historical progress log:

- [Frontend handoff](./HANDOFF.md)
- [Question-bank review](./docs/CONTENT_AUDIT.md)
- [Pointer issue investigation](./docs/MOUSE_DIAGNOSTIC.md)
- [Historical progress log](./logs/2026-09-09_10-55-38_CST_still-practice-ready.md)

They record earlier stages of development. Some passages still describe the old 204-question bank, entry flow, or sounds. Check their dates and consult the current source when details differ. Keep both README files in sync when features change.
