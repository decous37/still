import type { Question } from './questions';
import { KEY_FLOW_KEYS } from './key-flow';
export function CandidateWords({
  question,
  selected,
  locked,
  onPick,
  keyFlow,
  pressedId,
  lang,
}: {
  question: Question;
  selected: string[];
  locked: boolean;
  onPick: (id: string) => void;
  keyFlow: boolean;
  pressedId?: string;
  lang: string;
}) {
  return (
    <div className="piece-bank">
      {question.blocks.map((b, index) => (
        <button
          key={b.id}
          className={`letter-piece ${selected.includes(b.id) ? 'is-used' : ''} ${pressedId === b.id ? 'is-pressed' : ''} ${keyFlow && KEY_FLOW_KEYS[index] ? 'has-key' : ''}`}
          aria-keyshortcuts={keyFlow ? KEY_FLOW_KEYS[index] : undefined}
          aria-label={
            keyFlow && KEY_FLOW_KEYS[index]
              ? `${b.text}${lang === 'en' ? ', key ' : '，快捷键 '}${KEY_FLOW_KEYS[index]}`
              : undefined
          }
          disabled={locked || selected.includes(b.id)}
          onClick={() => onPick(b.id)}
        >
          <span>
            {b.text}
            {keyFlow && KEY_FLOW_KEYS[index] && (
              <kbd aria-hidden="true" className="key-flow-hint">
                {KEY_FLOW_KEYS[index]}
              </kbd>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}
