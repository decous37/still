import type { Question } from '../questions';

export type Session = {
  status: 'ready' | 'running' | 'paused' | 'ended';
  selected: string[];
  transitioning: boolean;
  score: number;
  combo: number;
  best: number;
  correct: number;
  attempts: number;
  completed: number;
  elapsed: number;
  startedAt: number | null;
};
export const freshSession = (): Session => ({
  status: 'ready',
  selected: [],
  transitioning: false,
  score: 0,
  combo: 0,
  best: 0,
  correct: 0,
  attempts: 0,
  completed: 0,
  elapsed: 0,
  startedAt: null,
});
export function elapsedTime(s: Session, now: number) {
  return (
    s.elapsed + (s.startedAt === null ? 0 : Math.max(0, now - s.startedAt))
  );
}
export function resume(s: Session, now: number): Session {
  return s.status === 'ready' || s.status === 'paused'
    ? { ...s, status: 'running', startedAt: now }
    : s;
}
export function pause(s: Session, now: number): Session {
  return s.status === 'running'
    ? { ...s, status: 'paused', elapsed: elapsedTime(s, now), startedAt: null }
    : s;
}
export function finish(s: Session, now: number): Session {
  return { ...pause(s, now), status: 'ended', startedAt: null };
}
export function choose(
  s: Session,
  q: Question,
  id: string,
): { state: Session; cue: 'key' | 'error' | 'complete' | null } {
  const block = q.blocks.find((b) => b.id === id);
  if (
    s.status !== 'running' ||
    s.transitioning ||
    !block ||
    s.selected.includes(id)
  )
    return { state: s, cue: null };
  if (block.text !== q.answers[0][s.selected.length])
    return {
      state: { ...s, attempts: s.attempts + 1, combo: 0 },
      cue: 'error',
    };
  const selected = [...s.selected, id],
    complete = selected.length === q.answers[0].length;
  return {
    state: {
      ...s,
      selected,
      transitioning: complete,
      score: s.score + 10,
      correct: s.correct + 1,
      attempts: s.attempts + 1,
      combo: s.combo + 1,
      best: Math.max(s.best, s.combo + 1),
      completed: s.completed + Number(complete),
    },
    cue: complete ? 'complete' : 'key',
  };
}
export function nextQuestion(s: Session): Session {
  return s.status === 'running' && s.transitioning
    ? { ...s, selected: [], transitioning: false }
    : s;
}
export function shuffle<T>(items: T[], random = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Two equally sized queues, with bounded backtracking to preserve the run limit across bags. */
export function makeBag(
  bank: Question[],
  history: Question[] = [],
  random = Math.random,
): Question[] {
  const pool = shuffle(bank, random);
  function arrange(left: Question[], placed: Question[]): Question[] | null {
    if (!left.length) return placed;
    const tail = [...history.slice(-3), ...placed].slice(-3);
    for (let i = 0; i < left.length; i++) {
      const q = left[i];
      if (
        tail.at(-1)?.id === q.id ||
        (tail.length === 3 && tail.every((p) => p.mode === q.mode))
      )
        continue;
      const result = arrange(
        left.filter((_, j) => j !== i),
        [...placed, q],
      );
      if (result) return result;
    }
    return null;
  }
  const result = arrange(pool, []);
  if (!result)
    throw new Error('Prism bank cannot satisfy its sequence constraints');
  return result;
}

export class InputGate {
  private held = new Set<string>();
  press(key: string, repeat: boolean) {
    if (repeat || this.held.has(key)) return false;
    this.held.add(key);
    return true;
  }
  release(key: string) {
    this.held.delete(key);
  }
  clear() {
    this.held.clear();
  }
}
