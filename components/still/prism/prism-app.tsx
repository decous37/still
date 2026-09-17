'use client';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
} from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import type { Locale, Question } from '../questions';
import { KEY_FLOW_KEYS, keyFlowIndex, isEditableTarget } from '../key-flow';
import {
  choose,
  elapsedTime,
  finish,
  freshSession,
  InputGate,
  makeBag,
  nextQuestion,
  pause,
  resume,
  type Session,
} from './engine';
import { deal, prismBank } from './content';
import {
  defaults,
  readPreferences,
  savePreferences,
  type PrismPreferences,
} from './preferences';
import { PrismAudio } from './audio';
import { PrismScene } from './scene';
import './prism.css';

export type LeaveGuard = ((destination: string) => boolean) | null;
function timeLabel(ms: number) {
  const seconds = Math.floor(ms / 1000);
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}
function Clock({ session }: { session: Session }) {
  const [now, setNow] = useState(() => performance.now());
  useEffect(() => {
    if (session.status !== 'running') return;
    const id = setInterval(() => setNow(performance.now()), 200);
    return () => clearInterval(id);
  }, [session.status]);
  return <span>{timeLabel(elapsedTime(session, now))}</span>;
}

export default function PrismApp({
  lang,
  keyFlow,
  leaveGuard,
}: {
  lang: Locale;
  keyFlow: boolean;
  leaveGuard: MutableRefObject<LeaveGuard>;
}) {
  const en = lang === 'en';
  const [bank] = useState(() => prismBank(lang));
  const [firstBag] = useState(() => makeBag(bank));
  const queue = useRef(firstBag.slice(1)),
    history = useRef<Question[]>([firstBag[0]]);
  const [question, setQuestion] = useState(() => deal(firstBag[0]));
  const currentQuestion = useRef(question);
  currentQuestion.current = question;
  const [session, setSession] = useState(freshSession),
    live = useRef(session);
  const [audio] = useState(() => new PrismAudio());
  const [preferences, setPreferences] = useState(() => {
    try {
      return readPreferences(localStorage);
    } catch {
      return { ...defaults };
    }
  });
  const [systemReduced, setSystemReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const lowMotion = systemReduced || preferences.lowMotion;
  const [settings, setSettings] = useState(false),
    [leaveTo, setLeaveTo] = useState<string | null>(null);
  const [unavailable, setUnavailable] = useState(false),
    [pulse, setPulse] = useState(0);
  const [feedback, setFeedback] = useState<{
    id: string;
    error: boolean;
  } | null>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const gate = useRef(new InputGate()),
    heading = useRef<HTMLHeadingElement>(null);
  const update = useCallback((value: Session) => {
    live.current = value;
    setSession(value);
  }, []);
  const pauseNow = useCallback(() => {
    update(pause(live.current, performance.now()));
    audio.pause();
  }, [audio, update]);
  const requestLeave = useCallback(
    (destination: string) => {
      if (
        live.current.status === 'running' ||
        live.current.status === 'paused'
      ) {
        pauseNow();
        setLeaveTo(destination);
        return true;
      }
      return false;
    },
    [pauseNow],
  );
  useEffect(() => {
    leaveGuard.current = requestLeave;
    return () => {
      leaveGuard.current = null;
    };
  }, [leaveGuard, requestLeave]);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setSystemReduced(query.matches);
    query.addEventListener('change', change);
    const visibility = () => {
      if (document.hidden) {
        pauseNow();
        gate.current.clear();
      }
    };
    const unload = (e: BeforeUnloadEvent) => {
      if (
        live.current.status === 'running' ||
        live.current.status === 'paused'
      ) {
        pauseNow();
        e.preventDefault();
        e.returnValue = '';
      }
    };
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('beforeunload', unload);
    return () => {
      query.removeEventListener('change', change);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('beforeunload', unload);
      audio.dispose();
      clearTimeout(feedbackTimer.current);
    };
  }, [audio, pauseNow]);
  useEffect(() => {
    audio.configure(preferences);
    try {
      savePreferences(localStorage, preferences);
    } catch {
      /* Session only. */
    }
  }, [audio, preferences]);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, [question.id, session.status]);
  useEffect(() => {
    if (session.status !== 'running' || !session.transitioning) return;
    const id = setTimeout(() => {
      if (document.hidden || live.current.status !== 'running') return;
      if (!queue.current.length) queue.current = makeBag(bank, history.current);
      const q = queue.current.shift()!;
      history.current = [...history.current.slice(-2), q];
      currentQuestion.current = deal(q);
      setQuestion(currentQuestion.current);
      setFeedback(null);
      update(nextQuestion(live.current));
    }, 120);
    return () => clearTimeout(id);
  }, [session.status, session.transitioning, bank, update]);
  const pick = useCallback(
    (id: string) => {
      if (document.hidden) return;
      const result = choose(live.current, currentQuestion.current, id);
      if (!result.cue) return;
      update(result.state);
      audio.cue(result.cue);
      setPulse((p) => p + 1);
      setFeedback({ id, error: result.cue === 'error' });
      clearTimeout(feedbackTimer.current);
      feedbackTimer.current = setTimeout(() => setFeedback(null), 160);
    },
    [audio, update],
  );
  useEffect(() => {
    let composing = false;
    const start = () => {
      composing = true;
    };
    const end = () => {
      composing = false;
    };
    const down = (e: KeyboardEvent) => {
      if (
        !keyFlow ||
        composing ||
        document.hidden ||
        live.current.status !== 'running'
      )
        return;
      const index = keyFlowIndex(e, e.composedPath().some(isEditableTarget));
      if (index < 0 || !gate.current.press(e.code || e.key, e.repeat)) return;
      e.preventDefault();
      const block = currentQuestion.current.blocks[index];
      if (block) pick(block.id);
    };
    const up = (e: KeyboardEvent) => gate.current.release(e.code || e.key);
    const blur = () => {
      composing = false;
      gate.current.clear();
      pauseNow();
    };
    document.addEventListener('keydown', down);
    document.addEventListener('keyup', up);
    document.addEventListener('compositionstart', start);
    document.addEventListener('compositionend', end);
    window.addEventListener('blur', blur);
    return () => {
      document.removeEventListener('keydown', down);
      document.removeEventListener('keyup', up);
      document.removeEventListener('compositionstart', start);
      document.removeEventListener('compositionend', end);
      window.removeEventListener('blur', blur);
    };
  }, [keyFlow, pick, pauseNow]);
  async function start() {
    gate.current.clear();
    update(resume(live.current, performance.now()));
    const ok = await audio.start();
    if (live.current.status === 'running') setUnavailable(!ok);
  }
  function end() {
    update(finish(live.current, performance.now()));
    audio.pause();
    setFeedback(null);
  }
  function exit(destination = '#practice') {
    end();
    leaveGuard.current = null;
    window.location.assign(destination);
  }
  function restart() {
    audio.pause();
    const bag = makeBag(bank);
    queue.current = bag.slice(1);
    history.current = [bag[0]];
    currentQuestion.current = deal(bag[0]);
    setQuestion(currentQuestion.current);
    update(freshSession());
    setFeedback(null);
    void start();
  }
  function change(patch: Partial<PrismPreferences>) {
    setPreferences((p) => ({ ...p, ...patch }));
  }
  const running = session.status === 'running';
  return (
    <section
      className={`prism-app ${lowMotion ? 'prism-low-motion' : ''}`}
      data-status={session.status}
    >
      <PrismScene
        running={running}
        lowMotion={lowMotion}
        pulse={pulse}
        audio={audio}
      />
      <div className="prism-light prism-light-cyan" aria-hidden="true" />
      <div className="prism-light prism-light-pink" aria-hidden="true" />
      <header className="prism-header">
        <button
          className="prism-brand"
          onClick={() => {
            if (!requestLeave('#practice')) exit();
          }}
        >
          still<span>.</span> <b>{en ? 'PRISM' : '幻彩'}</b>
        </button>
        <div className="prism-tools">
          <Button
            className="prism-button"
            onClick={() => {
              pauseNow();
              setSettings(true);
            }}
          >
            {en ? 'Sound & visuals' : '声音与特效'}
          </Button>
          {(running || session.status === 'paused') && (
            <>
              <Button
                className="prism-button"
                onClick={running ? pauseNow : () => void start()}
              >
                {running ? (en ? 'Pause' : '暂停') : en ? 'Continue' : '继续'}
              </Button>
              <Button className="prism-button" onClick={end}>
                {en ? 'End' : '结束'}
              </Button>
            </>
          )}
        </div>
      </header>
      <main className="prism-main">
        <div
          className="prism-meter"
          aria-label={en ? 'Session statistics' : '本局统计'}
        >
          <div>
            <small>{en ? 'SCORE' : '分数'}</small>
            <strong>{session.score.toLocaleString()}</strong>
          </div>
          <div>
            <small>{en ? 'COMBO' : '连击'}</small>
            <strong className="prism-combo">
              {session.combo}
              <i>×</i>
            </strong>
          </div>
          <div>
            <small>{en ? 'TIME' : '时间'}</small>
            <strong>
              <Clock session={session} />
            </strong>
          </div>
        </div>
        <h1 ref={heading} tabIndex={-1} className="sr-only">
          {en ? 'Prism' : '幻彩'}
        </h1>
        {unavailable && (
          <p className="prism-audio-status" role="status">
            {en
              ? 'Audio unavailable. You can keep playing.'
              : '声音暂不可用，仍可继续作答'}
          </p>
        )}
        {session.status === 'ready' && (
          <div className="prism-intro">
            <p className="prism-eyebrow">
              120 BPM · {en ? 'YOUR OWN PACE' : '自由节奏'}
            </p>
            <h2>
              {en ? (
                <>
                  Find your
                  <br />
                  <em>flow.</em>
                </>
              ) : (
                <>
                  让文字
                  <br />
                  <em>跟上心跳</em>
                </>
              )}
            </h2>
            <p>
              {en
                ? 'Follow the text. Choose in order. Keep moving.'
                : '看清文字，按顺序选择，自由作答。'}
            </p>
            <Button
              className="prism-button prism-primary"
              onClick={() => void start()}
            >
              {en ? 'Start' : '开始'}
            </Button>
            <small>
              {en
                ? 'Moving colors and music · adjustable in settings'
                : '包含动态色彩与音乐，可在设置中降低强度'}
            </small>
          </div>
        )}
        {session.status === 'paused' && (
          <div className="prism-pause">
            <h2>{en ? 'Take a breath.' : '稍作停留'}</h2>
            <Button
              className="prism-button prism-primary"
              onClick={() => void start()}
            >
              {en ? 'Continue' : '继续'}
            </Button>
          </div>
        )}
        {running && (
          <div className="prism-play">
            <p className="prism-eyebrow">
              {en
                ? question.mode === 'word'
                  ? 'WORDS'
                  : 'SENTENCES'
                : question.mode === 'word'
                  ? '重组'
                  : '句子'}{' '}
              <span>· {en ? 'FILL IN ORDER' : '按顺序填满'}</span>
            </p>
            <div className="prism-target" aria-label={question.reference}>
              {question.answers[0].map((word, i) => (
                <span
                  key={i}
                  className={i < session.selected.length ? 'prism-filled' : ''}
                >
                  {word}
                  {en &&
                  question.mode === 'sentence' &&
                  i < question.answers[0].length - 1
                    ? ' '
                    : ''}
                </span>
              ))}
            </div>
            <div className="prism-candidates">
              {question.blocks.map((b, i) => (
                <button
                  key={b.id}
                  className={`prism-piece ${session.selected.includes(b.id) ? 'prism-used' : ''} ${feedback?.id === b.id ? (feedback.error ? 'prism-wrong' : 'prism-hit') : ''}`}
                  disabled={
                    session.transitioning || session.selected.includes(b.id)
                  }
                  aria-label={
                    keyFlow
                      ? `${b.text}, ${en ? 'key' : '快捷键'} ${KEY_FLOW_KEYS[i]}`
                      : b.text
                  }
                  aria-keyshortcuts={keyFlow ? KEY_FLOW_KEYS[i] : undefined}
                  onClick={(e) => {
                    if (e.detail <= 1) pick(b.id);
                  }}
                >
                  <span>
                    {b.text}
                    {keyFlow && (
                      <kbd aria-hidden="true">{KEY_FLOW_KEYS[i]}</kbd>
                    )}
                  </span>
                </button>
              ))}
            </div>
            <div className="prism-track" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
        {session.status === 'ended' && (
          <div className="prism-summary">
            <p className="prism-eyebrow">
              {en ? 'SESSION COMPLETE' : '本局结束'}
            </p>
            <h2>{en ? 'A rhythm of your own.' : '这一段，由你完成'}</h2>
            <dl>
              {[
                [en ? 'Questions' : '完成题数', session.completed],
                [
                  en ? 'Accuracy' : '正确率',
                  session.attempts
                    ? `${Math.round((session.correct / session.attempts) * 100)}%`
                    : '—',
                ],
                [en ? 'Best combo' : '最高连击', session.best],
                [en ? 'Active time' : '有效时长', timeLabel(session.elapsed)],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <div className="prism-actions">
              <Button className="prism-button prism-primary" onClick={restart}>
                {en ? 'Play again' : '再来一次'}
              </Button>
              <Button className="prism-button" onClick={() => exit()}>
                {en ? 'Back to practice' : '返回练习'}
              </Button>
            </div>
          </div>
        )}
        <output className="sr-only" aria-live="polite">
          {feedback?.error
            ? en
              ? 'Try again. Previous answers kept.'
              : '请重试，已答对内容保留'
            : session.transitioning
              ? en
                ? 'Complete'
                : '已完成'
              : ''}
        </output>
      </main>
      <footer className="prism-footer">
        <span>STILL / PRISM</span>
        <span>
          {keyFlow
            ? 'A S D F G H J K L  ·  Q W E R T Y U I O P'
            : en
              ? 'CLICK TO PLAY'
              : '点击作答'}
        </span>
        <span>120 BPM</span>
      </footer>
      <Dialog open={settings} onOpenChange={setSettings}>
        <DialogContent className="prism-dialog" showCloseButton={false}>
          <DialogTitle>{en ? 'Sound & visuals' : '声音与特效'}</DialogTitle>
          <DialogDescription>
            {en
              ? 'Close settings, then continue when ready.'
              : '关闭设置后，点击继续恢复练习'}
          </DialogDescription>
          <div className="prism-setting">
            <label htmlFor="prism-mute">{en ? 'Mute all' : '总静音'}</label>
            <Switch
              id="prism-mute"
              checked={preferences.muted}
              onCheckedChange={(muted) => change({ muted })}
            />
          </div>
          {(['music', 'effects'] as const).map((name) => (
            <div className="prism-volume" key={name}>
              <label id={`prism-${name}`}>
                {name === 'music'
                  ? en
                    ? 'Music'
                    : '音乐'
                  : en
                    ? 'Sound effects'
                    : '音效'}{' '}
                · {Math.round(preferences[name] * 100)}%
              </label>
              <Slider
                aria-labelledby={`prism-${name}`}
                value={[preferences[name] * 100]}
                min={0}
                max={100}
                onValueChange={(v) =>
                  change({ [name]: (Array.isArray(v) ? v[0] : v) / 100 })
                }
              />
            </div>
          ))}
          <div className="prism-setting">
            <label htmlFor="prism-motion">{en ? 'Low motion' : '低动态'}</label>
            <Switch
              id="prism-motion"
              checked={lowMotion}
              disabled={systemReduced}
              onCheckedChange={(lowMotion) => change({ lowMotion })}
            />
          </div>
          {systemReduced && (
            <p>
              {en
                ? 'Following your system’s reduced-motion setting.'
                : '已遵循系统的减少动态效果设置'}
            </p>
          )}
          <Button className="prism-button" onClick={() => setSettings(false)}>
            {en ? 'Close' : '关闭'}
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog
        open={leaveTo !== null}
        onOpenChange={(open) => {
          if (!open) setLeaveTo(null);
        }}
      >
        <DialogContent className="prism-dialog" showCloseButton={false}>
          <DialogTitle>
            {en ? 'End this session?' : '结束本局并离开？'}
          </DialogTitle>
          <DialogDescription>
            {en
              ? 'This session is paused. Its score will not be saved.'
              : '本局已暂停，离开后不会保存本局分数'}
          </DialogDescription>
          <Button className="prism-button" onClick={() => setLeaveTo(null)}>
            {en ? 'Stay paused' : '留在这里'}
          </Button>
          <Button
            className="prism-button prism-primary"
            onClick={() => exit(leaveTo ?? '#practice')}
          >
            {en ? 'End and leave' : '结束并离开'}
          </Button>
        </DialogContent>
      </Dialog>
    </section>
  );
}
