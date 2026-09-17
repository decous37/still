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
| Recall | Read, hide, and fill from left to right: one gap with three options for short questions, two gaps sharing four options for medium and long questions |

Correct selections turn green. A wrong selection briefly turns the whole text red, then resets the question. Finishing a question moves you to the next one automatically. For repeated characters, any unused block with the matching text is accepted.

For two-gap questions, a wrong answer in either gap resets both without revealing the sentence. “Read again” clears the attempt and shows the original text.

In Recall, Space also hides or reveals the words, even with Key Flow off. Revealing clears the current attempt. This shortcut is inactive while paused, browsing Collection, or transitioning between questions.

Use Collection in the header to browse modes, groups, and questions. Opening Collection or Preferences freezes the exercise. After leaving the tab for another app or page, click “Continue” when you return.

Regular selections use a light key click. Finishing a question plays a short metallic chime; a mistake plays one electronic beep. Mute controls all three sounds, while haptics have a separate setting. Practice still works when the browser cannot play audio or vibrate.

## Key Flow

Use the keyboard to choose words without moving the mouse. Turn Key Flow on or off in Preferences. It starts enabled on devices with a fine pointer and hover support; your choice is saved on this device.

Options follow `asdfghjkl`, then `qwertyuiop` after the ninth option. A small letter inside each option shows its key. Used options keep their position and key; pressing that key again does nothing and makes no sound. Mouse and touch selection still work.

Use English input. Shortcuts follow the typed letter, in either case, rather than physical keyboard positions. Held-key repeats, IME composition, and Ctrl/Command/Alt combinations are ignored. Shortcuts pause in Collection, Preferences, paused or transitioning exercises, and the initial Recall reading stage. Tab, Enter, and Space keep their usual behavior; hiding, rereading, and resuming have no extra letter shortcuts. Up to 19 options receive keys; any additional options remain available by clicking or using Tab.

## Prism (local experiment)

Prism is a separate rhythm-themed word game: a dark stage, an original synthesized 120 BPM groove, and a continuous shuffled question queue. Play at your own pace; beat timing is not scored. The prototype has 12 Chinese and 12 English questions, split evenly between Words and Sentences. It does not change the regular 600-question bank or its records.

Each correct selection earns 10 points and extends your combo. A mistake breaks the combo but keeps previous correct answers, so you can retry immediately. Time counts upward until you end the session. Results show session score, questions completed, accuracy, best combo, and active time. There are no permanent scores or rankings.

Music starts after you press Start. Music, effects, mute, and low motion have separate controls. Leaving the tab or opening settings pauses play; resume manually when ready. Leaving or refreshing does not restore the session. System reduced-motion settings take priority, and practice remains available without audio. Scores are game feedback, not a measure of attention.

Prism is off by default. Add `VITE_PRISM_ENABLED=true` to `.env.development.local` and restart the dev server to use the top-left Prism entry. See `.env.example`; the local file is excluded from Git. Production needs an explicit flag before building; this is not a live remote switch. Prism code and audiovisual resources load on demand.

See [Prism handoff and verification](./docs/PRISM.md) for prototype checks and remaining release gates.

## Questions and progress

The bank contains **600 questions**: 300 in Chinese and 300 in English. Each language has three modes, each mode has ten groups, and each group has ten questions.

In each group, question 1 is short and question 9 is long; the other eight are medium. That makes 480 medium questions (80%), 60 short, and 60 long.

| Content | Short | Medium | Long |
| --- | --- | --- | --- |
| Chinese Words | 3–5 characters | 6–7 characters | 8–10 characters |
| English Words | 4–6 letters | 7–9 letters | 10–12 letters |
| Chinese Sentences / Recall | 10–15 characters | 16–24 characters | 25–32 characters |
| English Sentences / Recall | 6–8 words | 9–13 words | 14–18 words |
| Sentence blocks | 3–4 | 5–6 | 7–8 |

Chinese counts exclude punctuation and spaces. English contractions and hyphenated words count as one word. English word exercises use lowercase; sentences follow normal capitalization rules.

The ten themes are Home, Nature, Light, Weather, Plants, Food, Reading, Travel, Objects, and Sound. Both languages share these themes, but the questions are not intended as line-by-line translations.

- The question number shows your position in the group. The progress strip counts distinct questions completed in that group.
- The number beside a question in Collection is its completion count for the current question-bank version. Unfinished questions show `0`.
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
| `components/still/questions.ts` | Question types, length limits, group lookup, and display cleanup |
| `components/still/group-content.ts` | All 600 questions with explicit IDs preserving the original group order |
| `components/still/group-progress.ts` | v2 completion counts, group progress storage, and deduplication |
| `components/still/feedback.ts` | Key clicks, success and error sounds, and haptics |
| `components/still/use-preferences.ts`, `use-feedback-preferences.ts` | Language, theme, sound, and haptic preferences |
| `app/globals.css`, `air.css`, `live.css`, `fill.css` | Page styles, loaded in this order |

## Saved data

Language, theme, sound, haptics, question completion counts, and group progress are stored in the current browser’s `localStorage`. Chinese and English group progress are kept separately. Refreshing preserves these records, but does not resume the question you were answering.

This revision uses `still:question-completions:v2` and `still:group-progress:v2`, starting practice records from zero. The old `v1` counts, progress, and migration marker remain in the browser as a backup. They are not imported into v2, and there is no automatic restore control. Language, theme, sound, and haptic preferences are unchanged.

There is no cross-device sync. Switching browsers or site addresses, or clearing site data, may make previous records unavailable. If storage is blocked, you can still practice, but records may not survive your next visit.

## Editing questions

All questions live in `group-content.ts`. Each line starts with an explicit ID, followed by `~` and the content. Words contain the full word or phrase; sentences use `|` to separate blocks. Recall marks gaps with `[word]` and appends two distractors separated by `|`. Spaces in English sentences are significant.

`questions.ts` builds the question objects and assigns a `lengthTier`. Recall uses ordered text and gap `segments` to generate reading, hidden, and completed views from one source. Positions 1 and 9 determine the short and long tiers.

Keep existing question and group IDs intact: local records depend on them. Maintain ten groups of ten questions for each language and mode, with no missing questions or duplicate group membership.

Sentence display and checking both use `answers[0]`; a different order is not accepted. Short recall has one answer, while medium and long recall have two distinct answers. Both use two distinct distractors. A shared function removes sentence-ending punctuation. Write correct capitalization in the source rather than applying a display transform.

Run `npx vitest run` after making changes. Existing tests cover bank size, group membership, normalized duplicate text, solvable answers, repeated characters, two-gap resets, v1/v2 storage isolation, and audio cancellation. Automated checks do not replace editorial review in either language.

## Scope and limitations

Still offers exercises in observation, sequencing, and short-term recall. Whether they improve attention during everyday reading or work has not been established through research. Completion counts and game accuracy are not evidence of that effect. This project does not diagnose or treat attention disorders.

Keyboard controls, screen-reader announcements, and reduced-motion support are implemented. Full screen-reader flows, 200% zoom, and audio and haptics on Safari and mobile devices still need hands-on testing. The reported pointer stutter or drift has no confirmed root cause and should not be considered fixed.

## Related documentation

These documents are in Chinese, except for the historical progress log:

- [Frontend handoff](./HANDOFF.md)
- [Question-bank review](./docs/CONTENT_AUDIT.md)
- [Pointer issue investigation](./docs/MOUSE_DIAGNOSTIC.md)
- [Historical progress log](./logs/2026-09-09_10-55-38_CST_still-practice-ready.md)

The handoff and content review describe the new rules. The historical log still describes the old 204-question bank, not the current behavior. Check dates and consult the source when details differ. Keep both README files in sync when features change.
