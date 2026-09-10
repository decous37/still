import { describe, it, expect } from 'vitest';
import {
  bank,
  createPracticeSet,
  questionCount,
  accepts,
  stripSentenceEnding,
  groups,
} from './questions';
import { initial, reduce } from './engine';
describe('content and rounds', () => {
  it('cleans recall endings consistently across all 200 questions', () => {
    for (const lang of ['en', 'zh-CN'] as const) {
      for (const q of bank(lang, 'recall')) {
        expect(q.reference).toBe(`${q.before}${q.answers[0][0]}${q.after}`);
        expect(q.reference).toBe(stripSentenceEnding(q.reference));
        expect(q.reference).not.toMatch(/[。.!！?？…]$/u);
      }
    }
  });
  it('preserves internal punctuation and closing quotes', () => {
    expect(stripSentenceEnding('他说：“你好！”。')).toBe('他说：“你好”');
    expect(stripSentenceEnding("Wait, don't go...")).toBe("Wait, don't go");
    expect(stripSentenceEnding('（真的吗？）')).toBe('（真的吗）');
    expect(stripSentenceEnding('3.14 is a number.')).toBe('3.14 is a number');
  });
  it('has 600 valid questions, preserving all 204 legacy IDs', () => {
    const allIds = new Set<string>();

    for (const lang of ['en', 'zh-CN'] as const) {
      for (const mode of ['word', 'sentence', 'recall'] as const) {
        const pool = bank(lang, mode);
        expect(pool).toHaveLength(100);
        expect(questionCount(lang, mode)).toBe(100);
        for (let i = 0; i < 34; i++)
          expect(pool.some((q) => q.id === `${lang}-${mode}-${i}`)).toBe(true);
        for (const q of pool) {
          expect(q.id.startsWith(`${lang}-${mode}-`)).toBe(true);
          expect(allIds.has(q.id)).toBe(false);
          allIds.add(q.id);
          expect(q.mode).toBe(mode);
          expect(q.reference.length).toBeGreaterThan(0);
          expect(new Set(q.blocks.map((b) => b.id)).size).toBe(q.blocks.length);
          for (const answer of q.answers) {
            expect(answer.length).toBeGreaterThan(0);
            const remaining = q.blocks.map((b) => b.text);
            for (const text of answer) {
              expect(remaining).toContain(text);
              remaining.splice(remaining.indexOf(text), 1);
            }
          }
        }
      }
      expect(bank(lang, 'word').map((q) => q.reference)).toHaveLength(100);
      for (const mode of ['word', 'sentence', 'recall'] as const) {
        const practiceSet = createPracticeSet(lang, mode, groups(mode)[0].id);
        expect(practiceSet).toHaveLength(10);
        expect(new Set(practiceSet.map((q) => q.id)).size).toBe(10);
        expect(practiceSet.every((q) => q.mode === mode)).toBe(true);
      }
    }

    expect(allIds.size).toBe(600);
  });
  it('removes ending periods from sentence questions', () => {
    for (const lang of ['en', 'zh-CN'] as const) {
      for (const q of bank(lang, 'sentence')) {
        expect(q.reference).not.toMatch(/[。.]$/);
        for (const block of q.blocks) expect(block.text).not.toMatch(/[。.]$/);
        for (const answer of q.answers)
          for (const text of answer) expect(text).not.toMatch(/[。.]$/);
      }
    }
  });
  it('accepts alternate sentence prefixes', () => {
    const q = bank('zh-CN', 'sentence')[11];
    expect(accepts(q, [], '我')).toBe(true);
    expect(accepts(q, ['我'], '今天')).toBe(true);
    expect(accepts(q, [], '在家看书。')).toBe(false);
  });
});
describe('instant input', () => {
  it('replays the success hold when resuming an interrupted transition', () => {
    const paused = reduce(
      { ...initial, phase: 'transition' },
      { type: 'pause' },
    );
    const resumed = reduce(paused, { type: 'resume' });
    expect(resumed.paused).toBe(false);
    expect(resumed.phase).toBe('success');
  });
  const q = bank('zh-CN', 'word')[0];
  it('accepts either repeated character and locks complete input', () => {
    let s = { ...initial };
    for (const id of [q.blocks[1].id, q.blocks[0].id, q.blocks[2].id])
      s = reduce(s, { type: 'pick', id, q });
    expect(s.phase).toBe('success');
    expect(reduce(s, { type: 'undo' })).toBe(s);
  });
  it('preserves input during red feedback, locks clicks, then resets in place', () => {
    let s = reduce(initial, { type: 'pick', id: q.blocks[0].id, q });
    s = reduce(s, { type: 'pick', id: q.blocks[2].id, q });
    expect(s.errors).toBe(1);
    expect(s.error).toBe(q.blocks[2].text);
    expect(s.selected).toHaveLength(1);
    expect(s.phase).toBe('error');
    expect(reduce(s, { type: 'pick', id: q.blocks[1].id, q })).toBe(s);
    expect(reduce(s, { type: 'undo' })).toBe(s);
    s = reduce(s, { type: 'retry' });
    expect(s.selected).toHaveLength(0);
    expect(s.phase).toBe('input');
    s = reduce(s, { type: 'pick', id: q.blocks[0].id, q });
    expect(s.selected).toHaveLength(1);
  });
  it('pause preserves error and blocks retry until resumed', () => {
    let s = reduce(initial, { type: 'pick', id: q.blocks[2].id, q });
    expect(s.phase).toBe('error');
    s = reduce(s, { type: 'pause' });
    expect(reduce(s, { type: 'pick', id: q.blocks[0].id, q })).toBe(s);
    expect(reduce(s, { type: 'transition' })).toBe(s);
    expect(reduce(s, { type: 'retry' })).toBe(s);
    s = reduce(s, { type: 'resume' });
    expect(reduce(s, { type: 'retry' }).phase).toBe('input');
  });
  it('uses the visible draft order even when other sentence orders exist', () => {
    const sentence = bank('zh-CN', 'sentence')[11];
    const other = sentence.blocks.find((b) => b.text === '我')!;
    expect(
      reduce(initial, { type: 'pick', id: other.id, q: sentence }).phase,
    ).toBe('error');
    expect(sentence.answers.length).toBeGreaterThan(1);
  });
  it('keeps recall hidden after error recovery', () => {
    const r = bank('en', 'recall')[0];
    let s = reduce(initial, { type: 'reveal' });
    s = reduce(s, {
      type: 'pick',
      id: r.blocks.find((b) => b.text !== r.answers[0][0])!.id,
      q: r,
    });
    expect(s.phase).toBe('error');
    s = reduce(s, { type: 'retry' });
    expect(s.hidden).toBe(true);
    expect(s.selected).toEqual([]);
  });
  it('does not accept recall before hiding, or used blocks twice', () => {
    const r = bank('en', 'recall')[0];
    expect(reduce(initial, { type: 'pick', id: r.blocks[0].id, q: r })).toBe(
      initial,
    );
    let s = reduce(initial, { type: 'reveal' });
    s = reduce(s, { type: 'pick', id: r.blocks[0].id, q: r });
    expect(s.phase).toBe('success');
    const w = reduce(initial, { type: 'pick', id: q.blocks[0].id, q });
    expect(reduce(w, { type: 'pick', id: q.blocks[0].id, q })).toBe(w);
  });
});
