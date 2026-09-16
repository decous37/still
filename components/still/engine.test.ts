import { describe, it, expect } from 'vitest';
import { bank, stripSentenceEnding, type Question } from './questions';
import { initial, reduce } from './engine';

const q: Question = {
  id: 'repeated',
  mode: 'word',
  lengthTier: 'short',
  reference: '慢慢来',
  answers: [['慢', '慢', '来']],
  blocks: [
    { id: 'a', text: '慢' },
    { id: 'b', text: '慢' },
    { id: 'c', text: '来' },
  ],
};
const pick = (s: typeof initial, id: string, question = q) =>
  reduce(s, { type: 'pick', id, q: question });
describe('instant feedback', () => {
  it('accepts either repeated character, rejects reuse and locks completion', () => {
    let s = pick(initial, 'b');
    expect(pick(s, 'b')).toBe(s);
    s = pick(s, 'a');
    s = pick(s, 'c');
    expect(s.phase).toBe('success');
    expect(pick(s, 'c')).toBe(s);
    expect(reduce(s, { type: 'undo' })).toBe(s);
  });
  it('locks during red feedback then clears all confirmed input', () => {
    const s = pick(pick(initial, 'a'), 'c');
    expect(s.phase).toBe('error');
    expect(s.selected).toEqual(['a']);
    expect(pick(s, 'b')).toBe(s);
    expect(reduce(s, { type: 'retry' })).toEqual(initial);
  });
  it('preserves errors on pause and restarts a success hold after transition', () => {
    const s = reduce(pick(initial, 'c'), { type: 'pause' });
    expect(reduce(s, { type: 'retry' })).toBe(s);
    expect(reduce(reduce(s, { type: 'resume' }), { type: 'retry' })).toEqual(
      initial,
    );
    const t = reduce({ ...initial, phase: 'transition' }, { type: 'pause' });
    expect(reduce(t, { type: 'resume' }).phase).toBe('success');
  });
});
describe('recall', () => {
  for (const lang of ['en', 'zh-CN'] as const) {
    const r = bank(lang, 'recall').find((q) => q.lengthTier === 'medium')!;
    const a = r.blocks[0].id,
      b = r.blocks[1].id,
      wrong = r.blocks[2].id;
    it(
      lang + ': hides both gaps, accepts them in order, completes only once',
      () => {
        expect(pick(initial, a, r)).toBe(initial);
        let s = reduce(initial, { type: 'reveal' });
        expect(pick(s, b, r).phase).toBe('error');
        s = pick(s, a, r);
        expect(s.phase).toBe('input');
        expect(pick(s, a, r)).toBe(s);
        s = pick(s, b, r);
        expect(s.phase).toBe('success');
        expect(pick(s, b, r)).toBe(s);
      },
    );
    it(
      lang + ': a wrong second gap resets both but never reveals the sentence',
      () => {
        let s = pick(reduce(initial, { type: 'reveal' }), a, r);
        s = pick(s, wrong, r);
        expect(s.phase).toBe('error');
        expect(s.selected).toHaveLength(1);
        s = reduce(s, { type: 'retry' });
        expect(s.hidden).toBe(true);
        expect(s.selected).toEqual([]);
        expect(pick(s, a, r).phase).toBe('input');
      },
    );
    it(lang + ': read again clears a partial attempt before rehiding', () => {
      let s = pick(reduce(initial, { type: 'reveal' }), a, r);
      s = reduce(s, { type: 'reveal' });
      expect(s).toEqual(initial);
      s = reduce(s, { type: 'reveal' });
      expect(s.hidden).toBe(true);
      expect(s.selected).toEqual([]);
    });
  }
  it('short recall still completes with one answer', () => {
    const r = bank('en', 'recall')[0];
    expect(
      pick(reduce(initial, { type: 'reveal' }), r.blocks[0].id, r).phase,
    ).toBe('success');
  });
  it('reconstructs all references and preserves internal punctuation', () => {
    for (const lang of ['en', 'zh-CN'] as const)
      for (const r of bank(lang, 'recall')) {
        expect(r.segments!.map((s) => s.text).join('')).toBe(r.reference);
        expect(stripSentenceEnding(r.reference)).toBe(r.reference);
      }
    expect(stripSentenceEnding('他说：“你好！”。')).toBe('他说：“你好”');
    expect(stripSentenceEnding("Wait, don't go...")).toBe("Wait, don't go");
    expect(stripSentenceEnding('3.14 is a number.')).toBe('3.14 is a number');
  });
});
