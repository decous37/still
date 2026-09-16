import { expect, it } from 'vitest';
import membership from './group-membership.fixture.json';
import {
  bank,
  groups,
  groupQuestions,
  createPracticeSet,
  contentLength,
  lengthLimits,
} from './questions';
import { initial, reduce } from './engine';
import {
  completeInGroup,
  readGroupProgress,
  saveGroupProgress,
  restartGroup,
  progressKey,
  progressStorageKey,
  completionStorageKey,
  readCompletionCounts,
} from './group-progress';

it('preserves every original ID and group position; 600 questions, 60 localized groups', () => {
  const ids: string[] = [];
  for (const lang of ['en', 'zh-CN'] as const)
    for (const mode of ['word', 'sentence', 'recall'] as const) {
      expect(bank(lang, mode)).toHaveLength(100);
      expect(groups(mode)).toHaveLength(10);
      for (const [i, g] of groups(mode).entries()) {
        const theme = Object.keys(membership[mode][lang])[
          i
        ] as keyof typeof membership.word.en;
        expect(g.questionIds[lang]).toEqual(membership[mode][lang][theme]);
        const round = createPracticeSet(lang, mode, g.id);
        expect(round.map((q) => q.id)).toEqual(g.questionIds[lang]);
        expect(round).toHaveLength(10);
        expect(round.map((q) => q.lengthTier)).toEqual([
          'short',
          'medium',
          'medium',
          'medium',
          'medium',
          'medium',
          'medium',
          'medium',
          'long',
          'medium',
        ]);
        ids.push(...g.questionIds[lang]);
      }
    }
  expect(new Set(ids).size).toBe(600);
});
it('meets length and block limits, lowercase word rules, gap structure and uniqueness', () => {
  for (const lang of ['en', 'zh-CN'] as const)
    for (const mode of ['word', 'sentence', 'recall'] as const) {
      const seen = new Set<string>();
      for (const q of bank(lang, mode)) {
        const tier = ['short', 'medium', 'long'].indexOf(q.lengthTier);
        const [min, max] =
          lengthLimits[lang][mode === 'word' ? 'word' : 'text'][tier];
        const n = contentLength(q.reference, lang, mode);
        expect(n, q.id + ' ' + q.reference).toBeGreaterThanOrEqual(min);
        expect(n, q.id + ' ' + q.reference).toBeLessThanOrEqual(max);
        const normalized = q.reference
          .normalize('NFKC')
          .toLowerCase()
          .replace(/[\p{P}\p{Z}\s]/gu, '');
        expect(seen.has(normalized), q.id).toBe(false);
        seen.add(normalized);
        expect(new Set(q.blocks.map((b) => b.id)).size).toBe(q.blocks.length);
        expect(q.blocks.every((b) => b.text.trim().length > 0)).toBe(true);
        expect(q.reference).not.toMatch(/[。.!！?？…]$/u);
        if (mode === 'word' && lang === 'en')
          expect(q.reference).toMatch(/^[a-z]+$/);
        if (mode !== 'word' && lang === 'en') {
          expect(q.reference).toMatch(/^[A-Z]/);
          const tokens = q.reference.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g)!;
          // Deliberately bounded exceptions in this edition; grammar still needs editorial review.
          expect(
            tokens
              .slice(1)
              .filter((t) => /^[A-Z]/.test(t))
              .every((t) => ['I', 'Sunday'].includes(t)),
            q.id,
          ).toBe(true);
        }
        if (mode === 'sentence') {
          expect(q.blocks.length).toBeGreaterThanOrEqual([3, 5, 7][tier]);
          expect(q.blocks.length).toBeLessThanOrEqual([4, 6, 8][tier]);
        }
        if (mode === 'recall') {
          const count = tier === 0 ? 1 : 2;
          expect(q.answers[0]).toHaveLength(count);
          expect(q.blocks).toHaveLength(count + 2);
          expect(new Set(q.blocks.map((b) => b.text.toLowerCase())).size).toBe(
            count + 2,
          );
          expect(
            q.segments!.filter((s) => s.kind === 'gap').map((s) => s.text),
          ).toEqual(q.answers[0]);
          expect(q.segments!.map((s) => s.text).join('')).toBe(q.reference);
        }
        let state =
          mode === 'recall' ? reduce(initial, { type: 'reveal' }) : initial;
        for (const text of q.answers[0]) {
          const block = q.blocks.find(
            (b) => b.text === text && !state.selected.includes(b.id),
          )!;
          expect(block, q.id).toBeDefined();
          state = reduce(state, { type: 'pick', id: block.id, q });
        }
        expect(state.phase, q.id).toBe('success');
      }
    }
});
it('counts English contractions and hyphenated words once', () => {
  expect(contentLength("Don't move the well-worn book", 'en', 'sentence')).toBe(
    5,
  );
  expect(contentLength('窗外，下雨了。', 'zh-CN', 'sentence')).toBe(5);
});
function storage() {
  const values = new Map<string, string>();
  return {
    getItem: (k: string) => values.get(k) ?? null,
    setItem: (k: string, v: string) => {
      values.set(k, v);
    },
  };
}
it('starts v2 empty, preserves v1 backups, and never reseeds restarted groups', () => {
  const local = storage();
  const oldCounts = JSON.stringify({ 'en-word-0': 9 });
  const oldProgress = JSON.stringify({ 'en:word-home': ['en-word-0'] });
  local.setItem('still:question-completions:v1', oldCounts);
  local.setItem('still:group-progress:v1', oldProgress);
  local.setItem('still:group-progress-migrated:v1', '1');
  expect(readCompletionCounts(local)).toEqual({});
  let p = readGroupProgress(local);
  expect(p[progressKey('en', 'word-home')]).toEqual([]);
  p = completeInGroup(p, 'en', 'word', 'word-home', 'en-word-0');
  saveGroupProgress(local, p);
  local.setItem(completionStorageKey, JSON.stringify({ 'en-word-0': 1 }));
  expect(readCompletionCounts(local)).toEqual({ 'en-word-0': 1 });
  expect(readGroupProgress(local)[progressKey('en', 'word-home')]).toEqual([
    'en-word-0',
  ]);
  p = restartGroup(p, 'en', 'word-home');
  saveGroupProgress(local, p);
  expect(readGroupProgress(local)[progressKey('en', 'word-home')]).toEqual([]);
  expect(readCompletionCounts(local)['en-word-0']).toBe(1);
  expect(local.getItem('still:question-completions:v1')).toBe(oldCounts);
  expect(local.getItem('still:group-progress:v1')).toBe(oldProgress);
  expect(local.getItem('still:group-progress-migrated:v1')).toBe('1');
});
it('deduplicates progress, isolates languages/groups and filters invalid data', () => {
  const local = storage();
  const once = completeInGroup({}, 'en', 'word', 'word-home', 'en-word-0');
  expect(completeInGroup(once, 'en', 'word', 'word-home', 'en-word-0')).toBe(
    once,
  );
  expect(completeInGroup(once, 'en', 'word', 'word-home', 'en-word-12')).toBe(
    once,
  );
  const both = completeInGroup(
    once,
    'zh-CN',
    'word',
    'word-home',
    'zh-CN-word-0',
  );
  expect(restartGroup(both, 'en', 'word-home')['zh-CN:word-home']).toEqual([
    'zh-CN-word-0',
  ]);
  const last = groupQuestions('en', 'word', 'word-home')[9];
  expect(
    completeInGroup(once, 'en', 'word', 'word-home', last.id)['en:word-home'],
  ).toHaveLength(2);
  local.setItem(
    progressStorageKey,
    JSON.stringify({ 'en:word-home': ['en-word-0', 'bad', 'en-word-0'] }),
  );
  expect(readGroupProgress(local)['en:word-home']).toEqual(['en-word-0']);
});
it('handles unavailable and malformed storage without blocking practice', () => {
  const blocked = {
    getItem: () => {
      throw Error('blocked');
    },
    setItem: () => {
      throw Error('blocked');
    },
  };
  expect(readGroupProgress(blocked)).toEqual({});
  expect(readCompletionCounts(blocked)).toEqual({});
  expect(() => saveGroupProgress(blocked, {})).not.toThrow();
  const local = storage();
  local.setItem(completionStorageKey, '{bad');
  expect(readCompletionCounts(local)).toEqual({});
  local.setItem(
    completionStorageKey,
    JSON.stringify({ 'en-word-0': -1, 'en-word-1': 'bad', 'en-word-2': 2 }),
  );
  expect(readCompletionCounts(local)).toEqual({ 'en-word-2': 2 });
});
