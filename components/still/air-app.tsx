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
import { bank } from './questions';
import { useFeedbackPreferences } from './use-feedback-preferences';
import { stopFeedback } from './feedback';
import { Switch } from '@/components/ui/switch';

import { CollectionDrawer } from './collection-drawer';
type View = 'practice' | 'settings' | 'complete';
type Mode = 'word' | 'sentence' | 'recall';

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
    settings: 'Preferences',
    language: '中文',
    langTitle: 'Language',
    langBody: 'Interface and practice text.',
    themeTitle: 'Appearance',
    themeBody: '',
    light: 'Light',
    dark: 'Dark',
    back: 'Back to practice',
    again: 'Practice again',
  },
  'zh-CN': {
    practice: '练习',
    settings: '偏好',
    language: 'English',
    langTitle: '语言',
    langBody: '界面与练习文字',
    themeTitle: '外观',
    themeBody: '',
    light: '明亮',
    dark: '深色',
    back: '返回练习',
    again: '再练一次',
  },
};
export function AirApp() {
  const { ready, lang, theme, toggleLang, toggleTheme } = usePreferences();
  const [view, setView] = useState<View>('practice');
  const [mode, setMode] = useState<Mode>('sentence');
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [browseMode, setBrowseMode] = useState<Mode>('sentence');
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
      setCollectionOpen(hash === 'library');
      setView(hash === 'settings' || hash === 'complete' ? hash : 'practice');
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
    const current = selectedQuestionId ?? bank(lang, mode)[0].id;
    const nextLang = lang === 'en' ? 'zh-CN' : 'en';
    setSelectedQuestionId(current.replace(lang + '-', nextLang + '-'));
  }
  function openCollection(open: boolean) {
    stopFeedback();
    if (open) setBrowseMode(mode);
    setCollectionOpen(open);
    if (!open && window.location.hash === '#library')
      window.history.replaceState(null, '', '#practice');
  }
  function selectFromCollection(nextMode: Mode, id: string) {
    const current = selectedQuestionId ?? bank(lang, mode)[0].id;
    if (nextMode !== mode || id !== current || view === 'complete') {
      setMode(nextMode);
      setSelectedQuestionId(id);
      setRoundKey((k) => k + 1);
    }
    openCollection(false);
    window.location.assign('#practice');
  }
  function choose(value: Mode) {
    setMode(value);
    setSelectedQuestionId(bank(lang, value)[0]?.id);
    setRoundKey((k) => k + 1);
    window.location.assign('#practice');
  }
  const recordCompletion = useCallback((id: string) => {
    setCompletionCounts((counts) => ({
      ...counts,
      [id]: (counts[id] ?? 0) + 1,
    }));
  }, []);
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
        <a
          className="air-brand"
          href="#practice"
          onClick={() => {
            if (view === 'complete') choose(mode);
          }}
        >
          still<span className="brand-dot">.</span>
        </a>
        <nav
          className="air-nav"
          aria-label={lang === 'en' ? 'Navigation' : '导航'}
        >
          <CollectionDrawer
            lang={lang}
            open={collectionOpen}
            onOpenChange={openCollection}
            mode={browseMode}
            onModeChange={setBrowseMode}
            currentId={selectedQuestionId ?? bank(lang, mode)[0].id}
            counts={completionCounts}
            onSelect={selectFromCollection}
          />
          {view !== 'practice' && (
            <a
              href="#practice"
              onClick={() => {
                if (view === 'complete') choose(mode);
              }}
            >
              {c.practice}
            </a>
          )}
          <a
            href="#settings"
            aria-current={view === 'settings' ? 'page' : undefined}
          >
            {c.settings}
          </a>
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
        <div hidden={view !== 'practice'}>
          <LivePractice
            key={`${lang}-${mode}-${roundKey}-${selectedQuestionId ?? 'first'}`}
            lang={lang}
            mode={mode}
            selectedQuestionId={selectedQuestionId}
            active={view === 'practice' && !collectionOpen}
            sound={sound}
            haptics={haptics}
            onFinish={finish}
            onQuestionSelect={setSelectedQuestionId}
            onQuestionComplete={recordCompletion}
          />
        </div>
        {view === 'settings' && (
          <section className="settings-space">
            <h1>{c.settings}</h1>
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
            <h1>{lang === 'en' ? 'Complete' : '已完成'}</h1>
            <Button className="air-primary" onClick={() => choose(mode)}>
              {c.again}
              <ArrowRight />
            </Button>
          </section>
        )}
      </main>
    </div>
  );
}
