import type { Question, Locale } from './questions';
import type { State } from './engine';
export function DraftText({
  question: q,
  state,
  lang,
}: {
  question: Question;
  state: State;
  lang: Locale;
}) {
  const success = state.phase === 'success' || state.phase === 'transition';
  return (
    <div
      className={`draft-text ${q.mode === 'word' ? 'draft-word' : ''} ${state.phase === 'error' ? 'draft-error' : ''} ${success ? 'draft-success' : ''}`}
    >
      {q.mode === 'recall'
        ? q.segments?.map((segment, i) => {
            if (segment.kind === 'text')
              return <span key={i}>{segment.text}</span>;
            const filled =
              state.hidden && segment.index < state.selected.length;
            const current =
              state.hidden &&
              !success &&
              segment.index === state.selected.length;
            const visible = !state.hidden || filled || success;
            return (
              <span
                key={i}
                className={`recall-slot ${filled ? 'is-filled' : ''} ${current ? 'is-current' : ''} ${!visible ? 'is-hidden' : ''}`}
                style={{
                  width: `${Math.max(2, Array.from(segment.text).length * (lang === 'en' ? 0.65 : 1))}em`,
                }}
                aria-label={
                  !visible
                    ? lang === 'en'
                      ? `Gap ${segment.index + 1}`
                      : `第${segment.index + 1}空`
                    : undefined
                }
                aria-current={current ? 'step' : undefined}
              >
                {visible
                  ? segment.text
                  : current && state.error
                    ? state.error
                    : '\u00a0'}
              </span>
            );
          })
        : q.answers[0].map((text, index) => (
            <span
              className={`draft-segment ${index < state.selected.length ? 'is-filled' : ''}`}
              key={index}
            >
              {text}
              {lang === 'en' &&
              q.mode === 'sentence' &&
              index < q.answers[0].length - 1
                ? ' '
                : ''}
            </span>
          ))}
    </div>
  );
}
