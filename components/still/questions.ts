import { themes, wordRows, sentenceRows, recallRows } from './group-content';

export type Mode = 'word' | 'sentence' | 'recall';
export type Locale = 'en' | 'zh-CN';
export type LengthTier = 'short' | 'medium' | 'long';
export type RecallSegment =
  | { kind: 'text'; text: string }
  | { kind: 'gap'; text: string; index: number };
export type Question = {
  id: string;
  mode: Mode;
  lengthTier: LengthTier;
  reference: string;
  blocks: { id: string; text: string }[];
  answers: string[][];
  segments?: RecallSegment[];
};
export type QuestionGroup = {
  id: string;
  mode: Mode;
  title: Record<Locale, string>;
  questionIds: Record<Locale, string[]>;
};
export const lengthLimits = {
  'zh-CN': {
    word: [
      [3, 5],
      [6, 7],
      [8, 10],
    ],
    text: [
      [10, 15],
      [16, 24],
      [25, 32],
    ],
  },
  en: {
    word: [
      [4, 6],
      [7, 9],
      [10, 12],
    ],
    text: [
      [6, 8],
      [9, 13],
      [14, 18],
    ],
  },
} as const;
export function contentLength(text: string, locale: Locale, mode: Mode) {
  return locale === 'en' && mode !== 'word'
    ? (text.match(/[A-Za-z]+(?:['’\u002d][A-Za-z]+)*/g) ?? []).length
    : Array.from(text.replace(/[\p{P}\p{Z}\s]/gu, '')).length;
}
export function stripSentenceEnding(text: string) {
  return text.replace(
    /[。.!！?？…]+(?=[。.!！?？…”’"'」』）)\]】]*\s*$)/gu,
    '',
  );
}
function entries(
  locale: Locale,
  mode: Mode,
  theme: (typeof themes)[number][0],
) {
  const rows = (
    mode === 'word' ? wordRows : mode === 'sentence' ? sentenceRows : recallRows
  )[locale][theme];
  return rows
    .trim()
    .split('\n')
    .map((line) => {
      const split = line.indexOf('~');
      if (split < 1) throw new Error('Invalid question row');
      return { id: line.slice(0, split), content: line.slice(split + 1) };
    });
}
function recallSegments(text: string): RecallSegment[] {
  const segments: RecallSegment[] = [];
  let cursor = 0,
    index = 0;
  for (const match of text.matchAll(/\[([^\]]+)\]/g)) {
    if (match.index! > cursor)
      segments.push({ kind: 'text', text: text.slice(cursor, match.index) });
    segments.push({ kind: 'gap', text: match[1], index: index++ });
    cursor = match.index! + match[0].length;
  }
  if (cursor < text.length)
    segments.push({ kind: 'text', text: text.slice(cursor) });
  if (index < 1 || index > 2)
    throw new Error('Recall requires one or two gaps');
  return segments;
}
const groupCache = new Map<Mode, QuestionGroup[]>();
const bankCache = new Map<string, Question[]>();
export function groups(mode: Mode): QuestionGroup[] {
  if (!groupCache.has(mode))
    groupCache.set(
      mode,
      themes.map(([theme, zh, en]) => ({
        id: `${mode}-${theme}`,
        mode,
        title: { en, 'zh-CN': zh },
        questionIds: {
          en: entries('en', mode, theme).map((q) => q.id),
          'zh-CN': entries('zh-CN', mode, theme).map((q) => q.id),
        },
      })),
    );
  return groupCache.get(mode)!;
}
export function bank(locale: Locale, mode: Mode): Question[] {
  const key = `${locale}:${mode}`;
  if (!bankCache.has(key)) {
    const result = themes.flatMap(([theme]) =>
      entries(locale, mode, theme).map(({ id, content }, slot): Question => {
        const lengthTier =
          slot === 0 ? 'short' : slot === 8 ? 'long' : 'medium';
        const parts = content.split('|');
        const segments =
          mode === 'recall'
            ? recallSegments(stripSentenceEnding(parts[0]))
            : undefined;
        const answer =
          mode === 'word'
            ? Array.from(content)
            : segments
              ? segments.filter((s) => s.kind === 'gap').map((s) => s.text)
              : parts.map(stripSentenceEnding);
        const reference = segments
          ? segments.map((s) => s.text).join('')
          : answer.join(mode === 'sentence' && locale === 'en' ? ' ' : '');
        const candidates =
          mode === 'recall' ? [...answer, ...parts.slice(1)] : answer;
        return {
          id,
          mode,
          lengthTier,
          reference,
          answers: [answer],
          blocks: candidates.map((text, i) => ({ id: `${id}-${i}`, text })),
          ...(segments ? { segments } : {}),
        };
      }),
    );
    bankCache.set(key, result);
  }
  return bankCache.get(key)!;
}
export function groupQuestions(
  locale: Locale,
  mode: Mode,
  groupId: string,
): Question[] {
  const group = groups(mode).find((g) => g.id === groupId);
  if (!group) throw new Error(`Unknown group: ${groupId}`);
  const pool = new Map(bank(locale, mode).map((q) => [q.id, q]));
  return group.questionIds[locale].map((id) => {
    const q = pool.get(id);
    if (!q) throw new Error(`Missing question: ${id}`);
    return q;
  });
}
function shuffled<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function createPracticeSet(
  locale: Locale,
  mode: Mode,
  groupId: string,
): Question[] {
  return groupQuestions(locale, mode, groupId).map((q) => ({
    ...q,
    blocks: shuffled(q.blocks),
  }));
}
export function questionCount(locale: Locale, mode: Mode) {
  return bank(locale, mode).length;
}
export function accepts(q: Question, prefix: string[], text: string) {
  return [...prefix, text].every((word, i) => q.answers[0][i] === word);
}
