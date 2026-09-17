import { describe, expect, it } from 'vitest';
import {
  KEY_FLOW_KEYS,
  KEY_FLOW_STORAGE,
  keyFlowIndex,
  readKeyFlow,
  saveKeyFlow,
} from './key-flow';
import { initial, reduce } from './engine';
import { groupQuestions } from './questions';

const key = (value: string, overrides = {}) => ({
  key: value,
  repeat: false,
  isComposing: false,
  keyCode: 0,
  ctrlKey: false,
  metaKey: false,
  altKey: false,
  defaultPrevented: false,
  ...overrides,
});

describe('Key Flow', () => {
  it('maps all 19 letters in order, including uppercase; never wraps', () => {
    [...KEY_FLOW_KEYS].forEach((letter, index) => {
      expect(keyFlowIndex(key(letter), false)).toBe(index);
      expect(keyFlowIndex(key(letter.toUpperCase()), false)).toBe(index);
    });
    expect(KEY_FLOW_KEYS[9]).toBe('q');
    expect(KEY_FLOW_KEYS[19]).toBeUndefined();
    for (const value of ['Enter', 'Tab', ' ', 'z', '中'])
      expect(keyFlowIndex(key(value), false)).toBe(-1);
  });
  it('ignores held keys, composition, modifiers, editable and handled events', () => {
    for (const flag of [
      'repeat',
      'isComposing',
      'ctrlKey',
      'metaKey',
      'altKey',
      'defaultPrevented',
    ])
      expect(keyFlowIndex(key('a', { [flag]: true }), false)).toBe(-1);
    expect(keyFlowIndex(key('a', { keyCode: 229 }), false)).toBe(-1);
    expect(keyFlowIndex(key('a'), true)).toBe(-1);
  });
  it('honors stored choices and falls back to device defaults without storage', () => {
    for (const desktop of [false, true]) {
      expect(readKeyFlow({ getItem: () => null }, desktop)).toBe(desktop);
      expect(readKeyFlow({ getItem: () => 'true' }, desktop)).toBe(true);
      expect(readKeyFlow({ getItem: () => 'false' }, desktop)).toBe(false);
      expect(
        readKeyFlow(
          {
            getItem: () => {
              throw Error();
            },
          },
          desktop,
        ),
      ).toBe(desktop);
    }
    const values = new Map<string, string>();
    saveKeyFlow(
      {
        setItem: (k, v) => {
          values.set(k, v);
        },
      },
      true,
    );
    expect(values.get(KEY_FLOW_STORAGE)).toBe('true');
    expect(() =>
      saveKeyFlow(
        {
          setItem: () => {
            throw Error();
          },
        },
        false,
      ),
    ).not.toThrow();
  });
  it('uses fixed candidate positions and the existing reducer in all modes', () => {
    for (const mode of ['word', 'sentence', 'recall'] as const) {
      const q = groupQuestions('en', mode, `${mode}-home`)[1];
      let state = { ...initial, hidden: mode === 'recall' };
      for (const answer of q.answers[0]) {
        const index = q.blocks.findIndex(
          (b) => b.text === answer && !state.selected.includes(b.id),
        );
        const id = q.blocks[keyFlowIndex(key(KEY_FLOW_KEYS[index]), false)].id;
        state = reduce(state, { type: 'pick', id, q });
        expect(reduce(state, { type: 'pick', id, q })).toBe(state);
      }
      expect(state.phase).toBe('success');
    }
  });
});
