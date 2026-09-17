'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useKeyFlowInput } from './use-key-flow';
import { isEditableTarget } from './key-flow';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPracticeSet, type Locale, type Mode } from './questions';
import { initial, reduce, type State, type Action } from './engine';
import {
  keySound,
  errorSound,
  successSound,
  errorHaptic,
  stopFeedback,
} from './feedback';
import { DraftText } from './draft-text';
import { CandidateWords } from './candidate-words';
const copy = {
  en: {
    instructions: [
      'Fill the word from left to right.',
      'Fill the sentence from left to right.',
      'Read the sentence, then hide a word.',
    ],
    resume: 'Click to continue',
    ready: 'Hide word',
    reveal: 'Read again',
    error: 'Incorrect. The sentence will reset.',
    success: 'Complete.',
  },
  'zh-CN': {
    instructions: ['按顺序填满词语', '按顺序填满句子', '读一遍，再藏起一个词'],
    resume: '点击继续',
    ready: '藏起词语',
    reveal: '再读一遍',
    error: '输入错误，句子将重置。',
    success: '已完成。',
  },
};
export function LivePractice({
  lang,
  mode,
  groupId,
  selectedQuestionId,
  active,
  sound,
  haptics,
  keyFlow,
  completedCount,
  onFinish,
  onQuestionSelect,
  onQuestionComplete,
}: {
  lang: Locale;
  mode: Mode;
  groupId: string;
  selectedQuestionId?: string;
  active: boolean;
  sound: boolean;
  haptics: boolean;
  keyFlow: boolean;
  completedCount: number;
  onFinish: () => void;
  onQuestionSelect: (id: string) => void;
  onQuestionComplete: (id: string) => void;
}) {
  const round = useMemo(
    () => createPracticeSet(lang, mode, groupId),
    [lang, mode, groupId],
  );
  const index = Math.max(
      0,
      round.findIndex((q) => q.id === selectedQuestionId),
    ),
    q = round[index],
    c = copy[lang];
  const [state, setState] = useState<State>({ ...initial });
  const [pressedId, setPressedId] = useState<string>();
  const pressTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  useEffect(() => {
    if (!active || !keyFlow) setPressedId(undefined);
    return () => clearTimeout(pressTimer.current);
  }, [active, keyFlow]);
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
      const timer = setTimeout(() => {
        if (!document.hidden) send({ type: 'retry' });
      }, 300);
      return () => clearTimeout(timer);
    }
    if (state.phase === 'success') {
      if (!completed.current) {
        completed.current = true;
        onQuestionComplete(q.id);
      }
      const timer = setTimeout(() => {
        if (!document.hidden) send({ type: 'transition' });
      }, 250);
      return () => clearTimeout(timer);
    }
    if (state.phase === 'transition') {
      const timer = setTimeout(() => {
        if (document.hidden || latest.current.paused) return;
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
  useEffect(() => {
    if (q.mode !== 'recall' || locked) return;
    const toggleRecall = (event: KeyboardEvent) => {
      if (event.key !== ' ' || event.defaultPrevented || event.isComposing ||
          event.keyCode === 229 || event.ctrlKey || event.metaKey || event.altKey ||
          document.hidden || latest.current.paused || latest.current.phase !== 'input' ||
          event.composedPath().some(isEditableTarget)) return;
      const target = event.target;
      // Keep Space native on navigation, settings and other unrelated controls.
      if (target instanceof Element && target.closest('button, a, [role="switch"], [role="checkbox"]') &&
          !target.closest('.candidate-space, .recall-control')) return;
      event.preventDefault();
      if (!event.repeat) send({ type: 'reveal' });
    };
    document.addEventListener('keydown', toggleRecall);
    return () => document.removeEventListener('keydown', toggleRecall);
  }, [q.mode, locked]);
  const twoGaps = q.mode === 'recall' && q.answers[0].length === 2;
  const pick = useCallback(
    (id: string) => {
      if (
        !active ||
        document.hidden ||
        latest.current.paused ||
        latest.current.phase !== 'input'
      )
        return;
      const { before, after } = send({ type: 'pick', id, q });
      if (after === before) return;
      setPressedId(id);
      clearTimeout(pressTimer.current);
      pressTimer.current = setTimeout(() => setPressedId(undefined), 120);
      if (after.selected.length > before.selected.length) {
        if (sound) {
          if (after.phase === 'success') successSound();
          else keySound();
        }
      } else if (after.phase === 'error') {
        if (sound) errorSound();
        if (haptics) errorHaptic();
      }
    },
    [active, q, sound, haptics],
  );
  const pickKey = useCallback(
    (index: number) => {
      const block = q.blocks[index];
      if (block) pick(block.id);
    },
    [q, pick],
  );
  useKeyFlowInput(
    keyFlow && !locked && (q.mode !== 'recall' || state.hidden),
    pickKey,
  );
  return (
    <section
      className={`practice-space live-space fill-space ${state.phase === 'transition' && enabled ? 'is-transitioning' : ''}`}
    >
      <div className="practice-kicker">
        {String(index + 1).padStart(2, '0')} <span>/ {round.length}</span>
      </div>
      <progress
        className="sr-only"
        aria-label={lang === 'en' ? 'Round progress' : '本轮进度'}
        max={round.length}
        value={completedCount}
      />
      <div className="round-light" aria-hidden="true">
        <span style={{ width: `${(completedCount / round.length) * 100}%` }} />
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
        {twoGaps
          ? lang === 'en'
            ? 'Read, then hide two words. Fill from left to right.'
            : '读一遍，藏起两个词，再从左到右补回'
          : c.instructions[['word', 'sentence', 'recall'].indexOf(mode)]}
      </p>
      <div className="fill-stage">
        {state.paused ? (
          <div className="pause-surface">
            <Button
              variant="ghost"
              className="resume-control"
              onClick={() => send({ type: 'resume' })}
            >
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
                  aria-keyshortcuts="Space"
                  title={lang === 'en' ? 'Space to hide or reveal' : '空格键隐藏或显示'}
                  onClick={() => send({ type: 'reveal' })}
                >
                  <Eye />
                  {state.hidden
                    ? c.reveal
                    : twoGaps
                      ? lang === 'en'
                        ? 'Hide two words'
                        : '藏起两个词'
                      : c.ready}
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
                  keyFlow={keyFlow}
                  pressedId={pressedId}
                  lang={lang}
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
            : q.mode === 'recall' && state.hidden && enabled
              ? lang === 'en'
                ? `Fill gap ${state.selected.length + 1} of ${q.answers[0].length}.`
                : `请填写第${state.selected.length + 1}空，共${q.answers[0].length}空。`
              : ''}
      </output>
    </section>
  );
}
