'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Eye, Pause, Play, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPracticeSet, type Locale, type Mode } from './questions';
import { initial, reduce, type State, type Action } from './engine';
import { keySound, errorHaptic, stopFeedback } from './feedback';
import { DraftText } from './draft-text';
import { CandidateWords } from './candidate-words';
const copy = {
  en: {
    instructions: [
      'Fill the word from left to right.',
      'Fill the sentence from left to right.',
      'Read the sentence, then hide a word.',
    ],
    pause: 'Pause',
    resume: 'Resume',
    undo: 'Undo',
    ready: 'Hide word',
    reveal: 'Read again',
    leave: 'Finish',
    error: 'Incorrect. The sentence will reset.',
    success: 'Complete.',
  },
  'zh-CN': {
    instructions: ['按顺序填满词语', '按顺序填满句子', '读一遍，再藏起一个词'],
    pause: '暂停',
    resume: '继续',
    undo: '撤回',
    ready: '藏起词语',
    reveal: '再读一遍',
    leave: '结束',
    error: '输入错误，句子将重置。',
    success: '已完成。',
  },
};
export function LivePractice({
  lang,
  mode,
  selectedQuestionId,
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
  active: boolean;
  sound: boolean;
  haptics: boolean;
  onFinish: () => void;
  onQuestionSelect: (id: string) => void;
  onQuestionComplete: (id: string) => void;
}) {
  const round = useMemo(() => createPracticeSet(lang, mode), [lang, mode]);
  const index = Math.max(
      0,
      round.findIndex((q) => q.id === selectedQuestionId),
    ),
    q = round[index],
    c = copy[lang];
  const [state, setState] = useState<State>({ ...initial });
  const latest = useRef(state),
    completed = useRef(false),
    heading = useRef<HTMLHeadingElement>(null);
  const enabled = active && !state.paused;
  function send(action: Action) {
    const before = latest.current,
      after = reduce(before, action);
    latest.current = after;
    setState(after);
    return { before, after };
  }
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    if (!active) stopFeedback();
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
    if (!enabled) return;
    if (state.phase === 'error') {
      const timer = setTimeout(() => send({ type: 'retry' }), 300);
      return () => clearTimeout(timer);
    }
    if (state.phase === 'success') {
      if (!completed.current) {
        completed.current = true;
        onQuestionComplete(q.id);
      }
      const timer = setTimeout(() => send({ type: 'transition' }), 250);
      return () => clearTimeout(timer);
    }
    if (state.phase === 'transition') {
      const timer = setTimeout(() => {
        if (index === round.length - 1) onFinish();
        else onQuestionSelect(round[index + 1].id);
      }, 160);
      return () => clearTimeout(timer);
    }
  }, [
    enabled,
    state.phase,
    q.id,
    index,
    round,
    onFinish,
    onQuestionSelect,
    onQuestionComplete,
  ]);
  const locked = state.phase !== 'input' || !enabled;
  function pick(id: string) {
    if (locked) return;
    const { before, after } = send({ type: 'pick', id, q });
    if (after === before) return;
    if (after.selected.length > before.selected.length) {
      if (sound) keySound();
    } else if (after.phase === 'error' && haptics) errorHaptic();
  }
  return (
    <section
      className={`practice-space live-space fill-space ${state.phase === 'transition' && enabled ? 'is-transitioning' : ''}`}
    >
      <div className="practice-kicker">
        {String(index + 1).padStart(2, '0')} <span>/ {round.length}</span>
      </div>
      <h1 ref={heading} tabIndex={-1} className="sr-only">
        {q.mode === 'sentence'
          ? lang === 'en'
            ? 'Sentence practice'
            : '句子练习'
          : q.mode === 'word'
            ? lang === 'en'
              ? 'Word practice'
              : '文字练习'
            : lang === 'en'
              ? 'Recall practice'
              : '阅读补回'}
      </h1>
      <p className="fill-instruction">
        {c.instructions[['word', 'sentence', 'recall'].indexOf(mode)]}
      </p>
      <div className="fill-stage">
        {state.paused ? (
          <div className="pause-surface">
            <Button
              variant="ghost"
              className="resume-control"
              onClick={() => send({ type: 'resume' })}
            >
              <Play />
              {c.resume}
            </Button>
          </div>
        ) : (
          <>
            <DraftText question={q} state={state} lang={lang} />
            <div className="recall-control">
              {q.mode === 'recall' && (
                <Button
                  variant="ghost"
                  className="air-text-button"
                  disabled={locked}
                  onClick={() => send({ type: 'reveal' })}
                >
                  <Eye />
                  {state.hidden ? c.reveal : c.ready}
                </Button>
              )}
            </div>
            <div className="candidate-space">
              {q.mode !== 'recall' || state.hidden ? (
                <CandidateWords
                  question={q}
                  selected={state.selected}
                  locked={locked}
                  onPick={pick}
                />
              ) : null}
            </div>
          </>
        )}
      </div>
      <output className="sr-only" aria-live="polite">
        {state.phase === 'error'
          ? c.error
          : state.phase === 'success'
            ? c.success
            : ''}
      </output>
      <div
        className="edit-tools"
        style={{ visibility: state.paused ? 'hidden' : 'visible' }}
      >
        <Button
          variant="ghost"
          className="air-text-button"
          disabled={locked || !state.selected.length}
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
            send({ type: 'pause' });
            stopFeedback();
          }}
        >
          <Pause />
          {c.pause}
        </Button>
        <span className="kicker-divider" />
        <a className="finish-link" href="#complete">
          {c.leave}
        </a>
      </div>
    </section>
  );
}
