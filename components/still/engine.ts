import { accepts, type Question } from './questions';
export type State = {
  selected: string[];
  error: string | null;
  errors: number;
  hidden: boolean;
  phase: 'input' | 'error' | 'success' | 'transition';
  paused: boolean;
};
export const initial: State = {
  selected: [],
  error: null,
  errors: 0,
  hidden: false,
  phase: 'input',
  paused: false,
};
export type Action =
  | { type: 'pick'; id: string; q: Question }
  | { type: 'undo' | 'reveal' | 'pause' | 'resume' | 'transition' | 'reset' };
export function reduce(s: State, a: Action): State {
  if (a.type === 'reset') return { ...initial };
  if (a.type === 'pause') return { ...s, paused: true };
  if (a.type === 'resume') return { ...s, paused: false };
  if (s.paused) return s;
  if (a.type === 'transition')
    return s.phase === 'success' ? { ...s, phase: 'transition' } : s;
  if (s.phase === 'success' || s.phase === 'transition') return s;
  if (a.type === 'undo')
    return s.error
      ? { ...s, error: null, phase: 'input' }
      : { ...s, selected: s.selected.slice(0, -1), errors: 0 };
  if (a.type === 'reveal')
    return { ...s, hidden: !s.hidden, error: null, phase: 'input' };
  if (a.type === 'pick') {
    if (s.selected.includes(a.id) || (a.q.mode === 'recall' && !s.hidden))
      return s;
    const block = a.q.blocks.find((b) => b.id === a.id);
    if (!block) return s;
    const prefix = s.selected.map(
      (id) => a.q.blocks.find((b) => b.id === id)!.text,
    );
    if (!accepts(a.q, prefix, block.text))
      return {
        ...s,
        selected: [],
        error: null,
        errors: s.errors + 1,
        phase: 'input',
      };
    const selected = [...s.selected, a.id];
    const complete = a.q.answers.some(
      (answer) =>
        answer.length === selected.length &&
        [...prefix, block.text].every((text, i) => text === answer[i]),
    );
    return {
      ...s,
      selected,
      error: null,
      errors: 0,
      phase: complete ? 'success' : 'input',
    };
  }
  return s;
}
