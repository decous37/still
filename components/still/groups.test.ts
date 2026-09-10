import { expect, it } from 'vitest';
import { bank, groups, groupQuestions, createPracticeSet } from './questions';
import { initial, reduce } from './engine';
import {
  completeInGroup,
  readGroupProgress,
  saveGroupProgress,
  restartGroup,
  progressKey,
  progressStorageKey,
  migrationStorageKey,
} from './group-progress';

it('has 60 localized groups of ten, with no omissions or duplicate membership', () => {
  for (const lang of ['en', 'zh-CN'] as const)
    for (const mode of ['word', 'sentence', 'recall'] as const) {
      const all = groups(mode);
      expect(all).toHaveLength(10);
      const ids: string[] = [];
      for (const g of all) {
        expect(g.questionIds[lang]).toHaveLength(10);
        const round = createPracticeSet(lang, mode, g.id);
        expect(round.map((q) => q.id)).toEqual(g.questionIds[lang]);
        ids.push(...g.questionIds[lang]);
      }
      expect(new Set(ids).size).toBe(100);
      expect([...ids].sort()).toEqual(
        bank(lang, mode)
          .map((q) => q.id)
          .sort(),
      );
    }
});

it('has no normalized duplicate text within a language and module', () => {
  for (const lang of ['en', 'zh-CN'] as const)
    for (const mode of ['word', 'sentence', 'recall'] as const) {
      const seen = new Map<string, string>();
      for (const q of bank(lang, mode)) {
        const normalized = q.reference
          .normalize('NFKC')
          .toLocaleLowerCase()
          .replace(/[\p{P}\p{Z}\s]/gu, '');
        expect(
          seen.get(normalized),
          `${q.id} duplicates ${seen.get(normalized)}`,
        ).toBeUndefined();
        seen.set(normalized, q.id);
        expect(
          q.blocks.every(
            (b) => typeof b.text === 'string' && b.text.length > 0,
          ),
        ).toBe(true);
        if (mode === 'recall') {
          expect(q.blocks).toHaveLength(3);
          expect(new Set(q.blocks.map((b) => b.text)).size).toBe(3);
          expect(q.answers[0]).toHaveLength(1);
        }
      }
    }
});

it('can finish every question using only its displayed answer and available pieces', () => {
  for (const lang of ['en', 'zh-CN'] as const)
    for (const mode of ['word', 'sentence', 'recall'] as const) {
      for (const q of bank(lang, mode)) {
        let state =
          mode === 'recall' ? reduce(initial, { type: 'reveal' }) : initial;
        for (const word of q.answers[0]) {
          const block = q.blocks.find(
            (b) => b.text === word && !state.selected.includes(b.id),
          )!;
          state = reduce(state, { type: 'pick', id: block.id, q });
        }
        expect(state.phase, q.id).toBe('success');
        if (mode === 'word' && !/\d+$/.test(q.id)) {
          expect(q.answers[0].length).toBeGreaterThanOrEqual(
            lang === 'en' ? 4 : 2,
          );
          expect(q.answers[0].length).toBeLessThanOrEqual(
            lang === 'en' ? 8 : 4,
          );
        }
        if (mode === 'sentence') {
          expect(q.answers[0].length).toBeGreaterThanOrEqual(3);
          expect(q.answers[0].length).toBeLessThanOrEqual(5);
        }
      }
    }
});

function storage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
}
it('migrates legacy counts once and never reseeds a restarted group', () => {
  const local = storage();
  const counts = { 'en-word-0': 3, 'zh-CN-word-0': 2 };
  const initial = readGroupProgress(local, counts);
  expect(initial[progressKey('en', 'word-home')]).toEqual(['en-word-0']);
  saveGroupProgress(local, initial);
  expect(local.getItem(migrationStorageKey)).toBe('1');
  const restarted = restartGroup(initial, 'en', 'word-home');
  saveGroupProgress(local, restarted);
  const restored = readGroupProgress(local, counts);
  expect(restored[progressKey('en', 'word-home')]).toEqual([]);
  expect(restored[progressKey('zh-CN', 'word-home')]).toEqual(['zh-CN-word-0']);
  expect(counts['en-word-0']).toBe(3);
});
it('deduplicates group completion and ignores unrelated questions', () => {
  const once = completeInGroup({}, 'en', 'word', 'word-home', 'en-word-0');
  expect(completeInGroup(once, 'en', 'word', 'word-home', 'en-word-0')).toBe(
    once,
  );
  expect(completeInGroup(once, 'en', 'word', 'word-home', 'en-word-12')).toBe(
    once,
  );
  const q = groupQuestions('en', 'word', 'word-home')[9];
  expect(
    completeInGroup(once, 'en', 'word', 'word-home', q.id)['en:word-home'],
  ).toHaveLength(2);
});
it('handles blocked storage without blocking practice', () => {
  const blocked = {
    getItem: () => {
      throw new Error('blocked');
    },
    setItem: () => {
      throw new Error('blocked');
    },
  };
  expect(readGroupProgress(blocked, {})).toEqual({});
  expect(() => saveGroupProgress(blocked, {})).not.toThrow();
  expect(
    completeInGroup({}, 'en', 'word', 'word-home', 'en-word-0')['en:word-home'],
  ).toEqual(['en-word-0']);
});
it('filters invalid stored IDs and retains empty groups', () => {
  const local = storage();
  local.setItem(
    progressStorageKey,
    JSON.stringify({ 'en:word-home': ['en-word-0', 'bad', 'en-word-0'] }),
  );
  expect(readGroupProgress(local, {})['en:word-home']).toEqual(['en-word-0']);
});
