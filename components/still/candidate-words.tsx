import type { Question } from './questions';
export function CandidateWords({
  question,
  selected,
  locked,
  onPick,
}: {
  question: Question;
  selected: string[];
  locked: boolean;
  onPick: (id: string) => void;
}) {
  return (
    <div className="piece-bank">
      {question.blocks.map((b) => (
        <button
          key={b.id}
          className={`letter-piece ${selected.includes(b.id) ? 'is-used' : ''}`}
          disabled={locked || selected.includes(b.id)}
          onClick={() => onPick(b.id)}
        >
          <span>{b.text}</span>
        </button>
      ))}
    </div>
  );
}
