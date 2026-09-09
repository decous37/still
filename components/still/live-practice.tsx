'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Eye, Pause, Play, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  accepts,
  createPracticeSet,
  type Locale,
  type Mode,
} from './questions';
import { initial, reduce, type Action, type State } from './engine';
import { errorHaptic, keySound, stopFeedback } from './feedback';
const labels = {
  en: {
    titles: [
      'One letter at a time.',
      'Put a thought together.',
      'Let the words settle.',
    ],
    instructions: [
      'Follow the word. Tap one letter at a time.',
      'Bring the pieces together into a sentence.',
      'Read this line, then hide a word.',
    ],
    error: 'Try this spot again',
    success: 'All together.',
    hint: 'A little hint below.',
    pause: 'Pause',
    resume: 'Resume',
    paused: 'Take your time.',
    undo: 'Undo',
    ready: 'I’m ready',
    reveal: 'See the line',
    leave: 'Leave it here',
    completedTimes: 'completed',
  },
  'zh-CN': {
    titles: [
      '一个字，一点从容。',
      '让一句话，慢慢成形。',
      '读一句，停留片刻。',
    ],
    instructions: [
      '看着目标文字，依次轻点下方字块。',
      '把散落的词语，组成自然的一句话。',
      '读一遍这句话，再藏起一个词。',
    ],
    error: '再看一下',
    success: '刚刚好。',
    hint: '下方有一点小提示。',
    pause: '暂停',
    resume: '继续练习',
    paused: '不急，歇一会儿。',
    undo: '撤回',
    ready: '准备好了',
    reveal: '再看一眼',
    leave: '停在这里',
    completedTimes: '次',
  },
};
export function LivePractice({
  lang,
  mode,
  selectedQuestionId,
  completionCounts,
  active,
  sound,
  haptics,
  onFinish,
  onQuestionSelect,
  onQuestionComplete,
}: {
  lang: Locale;
  mode: Mode;
  selectedQuestionId?: string;
  completionCounts: Record<string, number>;
  active: boolean;
  sound: boolean;
  haptics: boolean;
  onFinish: () => void;
  onQuestionSelect: (id: string) => void;
  onQuestionComplete: (id: string) => void;
}) {
  const rounds = useMemo(
    () => ({
      en: createPracticeSet('en', mode),
      'zh-CN': createPracticeSet('zh-CN', mode),
    }),
    [mode],
  );
  const round = rounds[lang];
  const [index, setIndex] = useState(() =>
    Math.max(
      0,
      round.findIndex((item) => item.id === selectedQuestionId),
    ),
  );
  const [state, setState] = useState<State>({ ...initial });
  const latest = useRef(state);
  const completed = useRef<string | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const q = round[index],
    c = labels[lang],
    mi = ['word', 'sentence', 'recall'].indexOf(q.mode);
  function send(action: Action) {
    const before = latest.current;
    const after = reduce(before, action);
    latest.current = after;
    setState(after);
    return { before, after };
  }
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, [index, lang]);
  useEffect(() => {
    if (!active) {
      send({ type: 'pause' });
      stopFeedback();
    }
  }, [active]);
  useEffect(() => {
    const pause = () => {
      if (document.hidden) {
        send({ type: 'pause' });
        stopFeedback();
      }
    };
    document.addEventListener('visibilitychange', pause);
    return () => {
      document.removeEventListener('visibilitychange', pause);
      stopFeedback();
    };
  }, []);
  useEffect(() => {
    if (!active || state.paused) return;
    if (state.phase === 'success') {
      if (completed.current !== q.id) {
        completed.current = q.id;
        onQuestionComplete(q.id);
      }
      const timer = setTimeout(() => send({ type: 'transition' }), 450);
      return () => clearTimeout(timer);
    }
    if (state.phase === 'transition') {
      const timer = setTimeout(() => {
        if (index === round.length - 1) onFinish();
        else {
          const next = round[index + 1];
          onQuestionSelect(next.id);
          setIndex((i) => i + 1);
          send({ type: 'reset' });
          completed.current = null;
        }
      }, 160);
      return () => clearTimeout(timer);
    }
  }, [
    state.phase,
    state.paused,
    index,
    active,
    onFinish,
    onQuestionComplete,
    q.id,
    round.length,
    round,
    onQuestionSelect,
  ]);
  const prefix = state.selected.map(
    (id) => q.blocks.find((b) => b.id === id)!.text,
  );
  const hint =
    state.errors >= 2
      ? q.blocks.find(
          (b) => !state.selected.includes(b.id) && accepts(q, prefix, b.text),
        )?.id
      : undefined;
  const locked = state.phase === 'success' || state.phase === 'transition';
  function pick(id: string) {
    const { before, after } = send({ type: 'pick', id, q });
    if (after === before) return;
    if (after.selected.length > before.selected.length) {
      if (sound) keySound();
    } else if (after.errors > before.errors && haptics) errorHaptic();
  }
  const status = locked ? c.success : state.errors >= 2 ? c.hint : '';
  function chooseQuestion(nextIndex: number) {
    const next = round[nextIndex];
    onQuestionSelect(next.id);
    stopFeedback();
  }
  return (
    <section
      className={`practice-space live-space ${state.phase === 'transition' ? 'is-transitioning' : ''}`}
    >
      <div className="practice-kicker">
        <span className="status-dot" />
        STILL
        <span className="kicker-divider" />
        {String(index + 1).padStart(2, '0')} /{' '}
        {String(round.length).padStart(2, '0')}
      </div>
      <h1 ref={heading} tabIndex={-1}>
        {c.titles[mi]}
      </h1>
      <p className="air-description">{c.instructions[mi]}</p>
      <div
        className="question-list"
        aria-label={lang === 'en' ? 'Question list' : '题目列表'}
      >
        {round.map((item, itemIndex) => (
          <button
            key={item.id}
            className={`question-list-item ${itemIndex === index ? 'is-current' : ''}`}
            onClick={() => chooseQuestion(itemIndex)}
            type="button"
          >
            <span>{String(itemIndex + 1).padStart(2, '0')}</span>
            <strong>{item.reference}</strong>
            <em>
              {completionCounts[item.id] ?? 0} {c.completedTimes}
            </em>
          </button>
        ))}
      </div>
      <div className="live-stage">
        {state.paused ? (
          <div className="pause-surface">
            <span className="pause-symbol">Ⅱ</span>
            <p>{c.paused}</p>
            <Button
              className="air-primary"
              onClick={() => send({ type: 'resume' })}
            >
              <Play />
              {c.resume}
            </Button>
          </div>
        ) : (
          <div className={`word-workspace mode-${q.mode}`}>
            {q.mode === 'word' && (
              <p className="reference-word">{q.reference}</p>
            )}
            {q.mode === 'recall' ? (
              <>
                <p className="recall-line">
                  {state.hidden ? (
                    <>
                      {q.before}
                      <span
                        key={`${state.errors}-${state.error}`}
                        className={state.error ? 'wrong-piece' : 'recall-gap'}
                      >
                        {state.error ?? prefix[0] ?? '____'}
                      </span>
                      {q.after}
                    </>
                  ) : (
                    q.reference
                  )}
                </p>
                <Button
                  variant="ghost"
                  className="air-text-button"
                  disabled={locked}
                  onClick={() => send({ type: 'reveal' })}
                >
                  <Eye />
                  {state.hidden ? c.reveal : c.ready}
                </Button>
              </>
            ) : (
              <div className="answer-line">
                {prefix.map((text, i) => (
                  <span className="placed-piece" key={state.selected[i]}>
                    {text}
                  </span>
                ))}
                {!locked && (
                  <span className="current-slot" aria-hidden="true" />
                )}
                {q.mode === 'word' &&
                  Array.from(
                    {
                      length: Math.max(
                        0,
                        q.answers[0].length - prefix.length - 1,
                      ),
                    },
                    (_, i) => (
                      <span
                        className="future-slot"
                        key={i}
                        aria-hidden="true"
                      />
                    ),
                  )}
              </div>
            )}
            <div className="piece-bank">
              {(q.mode !== 'recall' || state.hidden) &&
                q.blocks.map((b) => (
                  <button
                    className={`letter-piece ${state.selected.includes(b.id) ? 'is-used' : ''} ${b.id === hint ? 'is-hinted' : ''}`}
                    key={b.id}
                    disabled={locked || state.selected.includes(b.id)}
                    onClick={() => pick(b.id)}
                    aria-label={
                      b.id === hint ? `${b.text} — ${c.hint}` : b.text
                    }
                  >
                    {b.text}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
      <output className="live-feedback" aria-live="polite">
        <span className={state.error ? 'error-message' : ''}>
          {state.paused ? '' : status}
        </span>
        {hint && !state.paused && <span>{c.hint}</span>}
      </output>
      <div
        className="edit-tools"
        style={{ visibility: state.paused ? 'hidden' : 'visible' }}
      >
        <Button
          variant="ghost"
          className="air-text-button"
          disabled={
            state.paused || locked || (!state.selected.length && !state.error)
          }
          onClick={() => send({ type: 'undo' })}
        >
          <Undo2 />
          {c.undo}
        </Button>
        <span className="kicker-divider" />
        <Button
          variant="ghost"
          className="air-text-button"
          onClick={() => {
            send({ type: state.paused ? 'resume' : 'pause' });
            stopFeedback();
          }}
        >
          {state.paused ? <Play /> : <Pause />}
          {state.paused ? c.resume : c.pause}
        </Button>
      </div>
      <a className="leave-link" href="#complete">
        {c.leave}
      </a>
    </section>
  );
}
