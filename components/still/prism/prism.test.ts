import { describe, expect, it } from 'vitest';
import { prismBank } from './content';
import {
  choose,
  elapsedTime,
  finish,
  freshSession,
  InputGate,
  makeBag,
  nextQuestion,
  pause,
  resume,
} from './engine';
import { contentLength, lengthLimits } from '../questions';
import { defaults, readPreferences, savePreferences } from './preferences';

describe('Prism content and sequence', () => {
  for (const locale of ['en', 'zh-CN'] as const) {
    it(`${locale}: twelve independently solvable, length-checked questions`, () => {
      const bank = prismBank(locale);
      expect(bank).toHaveLength(12);
      expect(new Set(bank.map((q) => q.reference)).size).toBe(12);
      for (const mode of ['word', 'sentence']) {
        const subset = bank.filter((q) => q.mode === mode);
        expect(subset.map((q) => q.lengthTier)).toEqual([
          'short',
          'medium',
          'medium',
          'medium',
          'medium',
          'long',
        ]);
      }
      for (const q of bank) {
        const tier = ['short', 'medium', 'long'].indexOf(q.lengthTier);
        const [min, max] =
          lengthLimits[locale][q.mode === 'word' ? 'word' : 'text'][tier];
        const length = contentLength(q.reference, locale, q.mode);
        expect(length, q.reference).toBeGreaterThanOrEqual(min);
        expect(length, q.reference).toBeLessThanOrEqual(max);
        expect(q.blocks.length).toBeLessThanOrEqual(19);
        if (q.mode === 'sentence') {
          expect(q.blocks.length).toBeGreaterThanOrEqual([3, 5, 7][tier]);
          expect(q.blocks.length).toBeLessThanOrEqual([4, 6, 8][tier]);
        }
        if (locale === 'en') {
          if (q.mode === 'word') expect(q.reference).toMatch(/^[a-z]+$/);
          else expect(q.reference).toMatch(/^[A-Z][a-z ,'-]+$/);
        }
      }
    });
    it(`${locale}: completes 60 questions across five bags without repetition or runs over three`, () => {
      const bank = prismBank(locale);
      let history: typeof bank = [],
        session = resume(freshSession(), 0);
      for (let bag = 0; bag < 5; bag++) {
        const sequence = makeBag(bank, history, () => 0.42);
        expect(new Set(sequence.map((q) => q.id)).size).toBe(12);
        for (const q of sequence) {
          expect(q.id).not.toBe(history.at(-1)?.id);
          expect(
            [...history.slice(-3), q].length === 4 &&
              [...history.slice(-3), q].every((p) => p.mode === q.mode),
          ).toBe(false);
          for (const answer of q.answers[0]) {
            const block = q.blocks.find(
              (b) => b.text === answer && !session.selected.includes(b.id),
            )!;
            session = choose(session, q, block.id).state;
          }
          expect(session.transitioning).toBe(true);
          session = nextQuestion(session);
          history.push(q);
        }
      }
      expect(session.completed).toBe(60);
      expect(session.score).toBe(session.correct * 10);
    });
  }
});
describe('Prism session', () => {
  const q = prismBank('en')[0];
  it('wrong choices keep the prefix, reset combo and never lock input', () => {
    let s = resume(freshSession(), 100);
    s = choose(s, q, q.blocks[0].id).state;
    const wrong = choose(s, q, q.blocks[2].id);
    expect(wrong.cue).toBe('error');
    expect(wrong.state.selected).toEqual(s.selected);
    expect(wrong.state.score).toBe(10);
    expect(wrong.state.combo).toBe(0);
    expect(wrong.state.transitioning).toBe(false);
    const right = choose(wrong.state, q, q.blocks[1].id);
    expect(right.cue).toBe('key');
    expect(right.state.selected).toHaveLength(2);
    expect(choose(right.state, q, q.blocks[1].id).state).toBe(right.state);
  });
  it('locks ready, paused, ended and completed inputs; counts completion once', () => {
    for (const s of [
      freshSession(),
      pause(resume(freshSession(), 0), 10),
      finish(resume(freshSession(), 0), 10),
    ])
      expect(choose(s, q, q.blocks[0].id).state).toBe(s);
    let s = resume(freshSession(), 0);
    for (const b of q.blocks) s = choose(s, q, b.id).state;
    expect(s.completed).toBe(1);
    expect(choose(s, q, q.blocks[0].id).state).toBe(s);
    expect(nextQuestion(pause(s, 20)).transitioning).toBe(true);
  });
  it('uses monotonic active time and excludes pauses', () => {
    const s = pause(resume(freshSession(), 1000), 2500);
    expect(elapsedTime(s, 999999)).toBe(1500);
    const ended = finish(resume(s, 5000), 5600);
    expect(ended.elapsed).toBe(2100);
    expect(elapsedTime(ended, 10000)).toBe(2100);
  });
  it('requires release before a held key can act on a new question', () => {
    const gate = new InputGate();
    expect(gate.press('KeyA', false)).toBe(true);
    expect(gate.press('KeyA', true)).toBe(false);
    expect(gate.press('KeyA', false)).toBe(false);
    gate.release('KeyA');
    expect(gate.press('KeyA', false)).toBe(true);
    gate.clear();
    expect(gate.press('KeyA', false)).toBe(true);
  });
  it('preferences validate and degrade to session defaults', () => {
    expect(
      readPreferences({
        getItem: () => {
          throw Error();
        },
      }),
    ).toEqual(defaults);
    expect(
      readPreferences({
        getItem: () => '{"music":100,"effects":-2,"muted":"true"}',
      }),
    ).toEqual({ ...defaults, music: 1, effects: 0 });
    expect(() =>
      savePreferences(
        {
          setItem: () => {
            throw Error();
          },
        },
        defaults,
      ),
    ).not.toThrow();
  });
});
