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
      {q.mode === 'recall' ? (
        <>
          {q.before}
          <span className="recall-slot">
            {state.hidden
              ? (state.error ?? (success ? q.answers[0][0] : '____'))
              : q.answers[0][0]}
          </span>
          {q.after}
        </>
      ) : (
        q.answers[0].map((text, index) => (
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
        ))
      )}
    </div>
  );
}
