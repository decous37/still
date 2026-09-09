'use client';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Moon,
  Sun,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { usePreferences } from './use-preferences';

import { LivePractice } from './live-practice';
import { bank, questionCount } from './questions';
import { useFeedbackPreferences } from './use-feedback-preferences';
import { stopFeedback } from './feedback';
import { Switch } from '@/components/ui/switch';

type View = 'practice' | 'library' | 'settings' | 'complete';
type Mode = 'word' | 'sentence' | 'recall';
const modes: Mode[] = ['word', 'sentence', 'recall'];
const completionStorageKey = 'still:question-completions:v1';
function readCompletionCounts(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = window.localStorage.getItem(completionStorageKey);
    if (!stored) return {};
    const parsed = JSON.parse(stored);
    return parsed && typeof parsed === 'object'
      ? (parsed as Record<string, number>)
      : {};
  } catch {
    return {};
  }
}

const copybook = {
  en: {
    practice: 'Practice',
    library: 'Collection',
    settings: 'Preferences',
    language: '中文',
    titles: [
      'One letter at a time.',
      'Put a thought together.',
      'Let the words settle.',
    ],
    instructions: [
      'Tap the letters to recreate the word below.',
      'Tap the pieces to bring the sentence together.',
      'Read this line. Hide a word when you’re ready.',
    ],
    names: ['Word by word', 'A simple sentence', 'Read & remember'],
    descriptions: [
      'Find a little rhythm in familiar letters.',
      'Give a few scattered words a place.',
      'Stay with a sentence, then welcome a word back.',
    ],
    next: 'Continue',
    skip: 'Try another',
    undo: 'Undo',
    reset: 'Start over',
    reveal: 'See the line',
    hide: 'I’m ready',
    quiet: 'No rush. Just this moment.',
    finish: 'Leave it here',
    answer: 'Let the words find their place here',
    libraryTitle: 'A different kind of pause.',
    libraryBody: 'Choose the kind of practice you want to work through.',
    libraryStats: 'Current language: 102 questions',
    questionsUnit: 'questions',
    settingsTitle: 'Make yourself comfortable.',
    settingsBody: 'A few little things, just the way you like them.',
    langTitle: 'Language',
    langBody: 'The interface and the words you practice with.',
    themeTitle: 'Appearance',
    themeBody: 'A little lighter. A little darker.',
    light: 'Light',
    dark: 'Dark',
    completeTitle: 'A little space, made.',
    completeBody:
      'Take this quiet moment with you. Your next thing can wait one breath.',
    back: 'Back to practice',
    again: 'Another moment',
    done: 'You can close this tab whenever you’re ready.',
    eyebrow: 'A LITTLE SPACE FOR YOUR MIND',
  },
  'zh-CN': {
    practice: '练习',
    library: '练习集',
    settings: '偏好',
    language: 'English',
    titles: [
      '一个字，一点从容。',
      '让一句话，慢慢成形。',
      '读一句，停留片刻。',
    ],
    instructions: [
      '依照下方文字，轻点字块，按顺序拼合。',
      '轻点词语，把散落的片段组成一句话。',
      '读一遍这句话，准备好后藏起一个词。',
    ],
    names: ['字间片刻', '整理一句话', '读过，再想起'],
    descriptions: [
      '在熟悉的文字里，找回自己的节奏。',
      '给散落的词语，一个合适的位置。',
      '陪一句话停留，再找回其中的一个词。',
    ],
    next: '继续',
    skip: '换一个',
    undo: '撤回',
    reset: '重新排列',
    reveal: '再看一眼',
    hide: '准备好了',
    quiet: '不必赶时间。只在这一刻。',
    finish: '停在这里',
    answer: '让文字在这里成形',
    libraryTitle: '换一种方式，停一停。',
    libraryBody: '选择一种练习方式，进入对应题目列表。',
    libraryStats: '当前语言：102 题',
    questionsUnit: '题',
    settingsTitle: '调成舒服的样子。',
    settingsBody: '一点小偏好，让这里更像你的空间。',
    langTitle: '语言',
    langBody: '同时切换界面与练习中的文字。',
    themeTitle: '外观',
    themeBody: '明亮一点，或安静一点。',
    light: '明亮',
    dark: '深色',
    completeTitle: '留白，刚刚好。',
    completeBody:
      '带着这一点安静，回到你想做的事。开始之前，还可以轻轻呼吸一次。',
    back: '返回练习',
    again: '再待一会儿',
    done: '准备好时，直接关掉这个页面就好。',
    eyebrow: '给注意力，留一点空白',
  },
};
export function AirApp() {
  const { ready, lang, theme, toggleLang, toggleTheme } = usePreferences();
  const [view, setView] = useState<View>('practice');
  const [mode, setMode] = useState<Mode>('sentence');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>();
  const [completionCounts, setCompletionCounts] =
    useState<Record<string, number>>(readCompletionCounts);
  const [roundKey, setRoundKey] = useState(0);
  const { sound, haptics, toggleSound, toggleHaptics } =
    useFeedbackPreferences();
  const c = copybook[lang];
  const finish = useCallback(() => window.location.assign('#complete'), []);
  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash.slice(1);
      setView(
        hash === 'library' || hash === 'settings' || hash === 'complete'
          ? hash
          : 'practice',
      );
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);
  useEffect(() => {
    document.title = `Still — ${c[view === 'complete' ? 'practice' : view]}`;
  }, [c, view]);
  useEffect(() => {
    try {
      window.localStorage.setItem(
        completionStorageKey,
        JSON.stringify(completionCounts),
      );
    } catch {
      // Local progress is helpful, but practice should keep working without it.
    }
  }, [completionCounts]);
  function reset() {
    stopFeedback();
  }
  function choose(value: Mode) {
    setMode(value);
    setSelectedQuestionId(bank(lang, value)[0]?.id);
    setRoundKey((k) => k + 1);
    window.location.assign('#practice');
  }
  function recordCompletion(id: string) {
    setCompletionCounts((counts) => ({
      ...counts,
      [id]: (counts[id] ?? 0) + 1,
    }));
  }
  if (!ready)
    return (
      <div className="still-loading">
        still<span className="brand-dot">.</span>
      </div>
    );
  return (
    <div className="air-app">
      <a className="skip-link" href="#main">
        {lang === 'en' ? 'Skip to content' : '跳到内容'}
      </a>
      <header className="air-header">
        <a className="air-brand" href="#practice">
          still<span className="brand-dot">.</span>
        </a>
        <nav
          className="air-nav"
          aria-label={lang === 'en' ? 'Navigation' : '导航'}
        >
          {(['practice', 'library', 'settings'] as const).map((page) => (
            <a
              key={page}
              href={`#${page}`}
              aria-current={view === page ? 'page' : undefined}
            >
              {c[page]}
            </a>
          ))}
        </nav>
        <div className="air-controls">
          <Button
            variant="ghost"
            className="air-icon"
            aria-label={
              lang === 'en'
                ? sound
                  ? 'Mute sound'
                  : 'Enable sound'
                : sound
                  ? '关闭音效'
                  : '开启音效'
            }
            aria-pressed={!sound}
            onClick={toggleSound}
          >
            {sound ? <Volume2 /> : <VolumeX />}
          </Button>
          <Button
            variant="ghost"
            className="air-language"
            onClick={() => {
              toggleLang();
              reset();
            }}
          >
            {c.language}
          </Button>
          <Button
            variant="ghost"
            className="air-icon"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? c.dark : c.light}
          >
            {theme === 'light' ? <Moon /> : <Sun />}
          </Button>
        </div>
      </header>
      <main id="main" className={`air-main view-${view}`}>
        {view === 'practice' && (
          <LivePractice
            key={`${lang}-${mode}-${roundKey}-${selectedQuestionId ?? 'first'}`}
            lang={lang}
            mode={mode}
            selectedQuestionId={selectedQuestionId}
            completionCounts={completionCounts}
            active={view === 'practice'}
            sound={sound}
            haptics={haptics}
            onFinish={finish}
            onQuestionSelect={setSelectedQuestionId}
            onQuestionComplete={recordCompletion}
          />
        )}
        {view === 'library' && (
          <section className="collection-space">
            <p className="overline">{c.library}</p>
            <h1>{c.libraryTitle}</h1>
            <p className="air-description">{c.libraryBody}</p>
            <p className="collection-stats">{c.libraryStats}</p>
            <div className="collection-list">
              {modes.map((entry, index) => (
                <button
                  key={entry}
                  className="collection-row"
                  onClick={() => choose(entry)}
                >
                  <span
                    className={`collection-preview preview-${entry}`}
                    aria-hidden="true"
                  >
                    {index === 0 ? (
                      <>
                        <i>{lang === 'en' ? 'P' : '慢'}</i>
                        <i>{lang === 'en' ? 'A' : '慢'}</i>
                        <i>{lang === 'en' ? 'U' : '来'}</i>
                      </>
                    ) : index === 1 ? (
                      <>
                        <i>{lang === 'en' ? 'one' : '一点'}</i>
                        <i>{lang === 'en' ? 'moment' : '空白'}</i>
                      </>
                    ) : (
                      <span>
                        {lang === 'en' ? 'little' : '清晨'} <em>____</em>
                      </span>
                    )}
                  </span>
                  <span className="collection-copy">
                    <span className="overline">
                      {questionCount(lang, entry)} {c.questionsUnit}
                    </span>
                    <strong>{c.names[index]}</strong>
                    <span>{c.descriptions[index]}</span>
                  </span>
                  <ArrowRight className="row-arrow" />
                </button>
              ))}
            </div>
          </section>
        )}
        {view === 'settings' && (
          <section className="settings-space">
            <p className="overline">{c.settings}</p>
            <h1>{c.settingsTitle}</h1>
            <p className="air-description">{c.settingsBody}</p>
            <div className="settings-list">
              <div className="setting-row">
                <div>
                  <h2 id="sound-label">
                    {lang === 'en' ? 'Typing sound' : '打字音效'}
                  </h2>
                  <p>
                    {lang === 'en'
                      ? 'A soft click for each correct piece.'
                      : '每一次正确输入，一声轻轻的回应。'}
                  </p>
                </div>
                <Switch
                  aria-labelledby="sound-label"
                  checked={sound}
                  onCheckedChange={toggleSound}
                />
              </div>
              <div className="setting-row">
                <div>
                  <h2 id="haptics-label">
                    {lang === 'en' ? 'Touch feedback' : '触感反馈'}
                  </h2>
                  <p>
                    {lang === 'en'
                      ? 'A brief vibration on supported devices.'
                      : '在支持的设备上，轻震提醒。'}
                  </p>
                </div>
                <Switch
                  aria-labelledby="haptics-label"
                  checked={haptics}
                  onCheckedChange={toggleHaptics}
                />
              </div>
              <div className="setting-row">
                <div>
                  <h2>{c.langTitle}</h2>
                  <p>{c.langBody}</p>
                </div>
                <Button
                  variant="outline"
                  className="preference-button"
                  onClick={() => {
                    toggleLang();
                    reset();
                  }}
                >
                  {lang === 'en' ? 'English → 中文' : '中文 → English'}
                </Button>
              </div>
              <div className="setting-row">
                <div>
                  <h2>{c.themeTitle}</h2>
                  <p>{c.themeBody}</p>
                </div>
                <Button
                  variant="outline"
                  className="preference-button"
                  onClick={toggleTheme}
                >
                  {theme === 'light' ? <Sun /> : <Moon />}
                  {theme === 'light' ? c.light : c.dark}
                  <span>↔</span>
                </Button>
              </div>
            </div>
            <a href="#practice" className="back-link">
              <ArrowLeft />
              {c.back}
            </a>
          </section>
        )}
        {view === 'complete' && (
          <section className="complete-space">
            <div className="completion-mark">
              <Check strokeWidth={1.25} />
            </div>
            <p className="overline">{c.eyebrow}</p>
            <h1>{c.completeTitle}</h1>
            <p className="air-description">{c.completeBody}</p>
            <Button className="air-primary" onClick={() => choose(mode)}>
              {c.again}
              <ArrowRight />
            </Button>
            <p className="completion-note">{c.done}</p>
          </section>
        )}
      </main>
      <footer className="air-footer">
        <span className="footer-mark" aria-hidden="true">
          Ⅱ
        </span>
        <span>{c.quiet}</span>
        <span className="footer-end">still.</span>
      </footer>
    </div>
  );
}
