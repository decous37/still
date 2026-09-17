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
import { useKeyFlowPreference } from './use-key-flow';

import { LivePractice } from './live-practice';
import { groups, groupQuestions } from './questions';
import {
  readGroupProgress,
  completionStorageKey,
  readCompletionCounts as readStoredCounts,
  saveGroupProgress,
  completeInGroup,
  restartGroup,
  progressKey,
  type GroupProgress,
} from './group-progress';
import { useFeedbackPreferences } from './use-feedback-preferences';
import { stopFeedback } from './feedback';
import { Switch } from '@/components/ui/switch';

import { CollectionDrawer } from './collection-drawer';
type View = 'practice' | 'settings' | 'complete';
type Mode = 'word' | 'sentence' | 'recall';

function readCompletionCounts(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    return readStoredCounts(window.localStorage);
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
    again: 'Repeat this group',
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
    again: '再练本组',
  },
};
export function AirApp() {
  const { keyFlow, changeKeyFlow } = useKeyFlowPreference();
  const { ready, lang, theme, toggleLang, toggleTheme } = usePreferences();
  const [view, setView] = useState<View>('practice');
  const [mode, setMode] = useState<Mode>('word');
  const [groupId, setGroupId] = useState('word-home');
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [browseMode, setBrowseMode] = useState<Mode>('word');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>();
  const [completionCounts, setCompletionCounts] =
    useState<Record<string, number>>(readCompletionCounts);
  const [roundKey, setRoundKey] = useState(0);
  const [groupProgress, setGroupProgress] = useState<GroupProgress>(() => {
    try {
      return readGroupProgress(window.localStorage);
    } catch {
      return {};
    }
  });
  const currentGroups = groups(mode);
  const groupIndex = currentGroups.findIndex((g) => g.id === groupId);
  const currentQuestions = groupQuestions(lang, mode, groupId);
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
    // A reload always opens the first word group, not a stale settings/end hash.
    window.history.replaceState(null, '', '#practice');
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
  useEffect(() => {
    if (!ready) return;
    try {
      saveGroupProgress(window.localStorage, groupProgress);
    } catch {}
  }, [groupProgress, ready]);
  function reset() {
    stopFeedback();
    const nextLang = lang === 'en' ? 'zh-CN' : 'en';
    const slot = Math.max(
      0,
      currentQuestions.findIndex((q) => q.id === selectedQuestionId),
    );
    setSelectedQuestionId(groupQuestions(nextLang, mode, groupId)[slot].id);
    setView('practice');
    window.location.assign('#practice');
  }
  function openCollection(open: boolean) {
    stopFeedback();
    if (open) setBrowseMode(mode);
    setCollectionOpen(open);
    if (!open && window.location.hash === '#library')
      window.history.replaceState(null, '', '#practice');
  }
  function selectFromCollection(nextMode: Mode, nextGroup: string, id: string) {
    const current = selectedQuestionId ?? currentQuestions[0].id;
    if (nextMode !== mode || id !== current || view === 'complete') {
      setMode(nextMode);
      setGroupId(nextGroup);
      setSelectedQuestionId(id);
      setRoundKey((k) => k + 1);
    }
    openCollection(false);
    window.location.assign('#practice');
  }
  function choose(nextGroup: string, restart = false) {
    if (restart) setGroupProgress((p) => restartGroup(p, lang, nextGroup));
    stopFeedback();
    setGroupId(nextGroup);
    setSelectedQuestionId(groupQuestions(lang, mode, nextGroup)[0].id);
    setRoundKey((k) => k + 1);
    window.location.assign('#practice');
  }
  const recordCompletion = useCallback(
    (id: string) => {
      setGroupProgress((p) => completeInGroup(p, lang, mode, groupId, id));
      setCompletionCounts((counts) => ({
        ...counts,
        [id]: (counts[id] ?? 0) + 1,
      }));
    },
    [lang, mode, groupId],
  );
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
            if (view === 'complete') choose(groupId);
          }}
        >
          still<span className="brand-dot">.</span>
        </a>
        <div className="air-navigation-row">
          <nav
            className="air-nav"
            aria-label={lang === 'en' ? 'Navigation' : '导航'}
          >
            <a
              href="#practice"
              aria-current={view === 'practice' ? 'page' : undefined}
              onClick={() => {
                if (view === 'complete') choose(groupId);
              }}
            >
              {c.practice}
            </a>
            <a
              href="#settings"
              aria-current={view === 'settings' ? 'page' : undefined}
            >
              {c.settings}
            </a>
          </nav>
          <div className="collection-position">
            <CollectionDrawer
              lang={lang}
              open={collectionOpen}
              onOpenChange={openCollection}
              mode={browseMode}
              onModeChange={setBrowseMode}
              currentGroupId={groupId}
              currentId={selectedQuestionId ?? currentQuestions[0].id}
              counts={completionCounts}
              onSelect={selectFromCollection}
            />
          </div>
        </div>
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
            key={`${lang}-${mode}-${groupId}-${roundKey}-${selectedQuestionId ?? 'first'}`}
            lang={lang}
            mode={mode}
            groupId={groupId}
            selectedQuestionId={selectedQuestionId}
            active={view === 'practice' && !collectionOpen}
            sound={sound}
            haptics={haptics}
            keyFlow={keyFlow}
            completedCount={
              (groupProgress[progressKey(lang, groupId)] ?? []).length
            }
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
                  <h2 id="key-flow-label">
                    {lang === 'en' ? 'Key Flow' : '轻键'}
                  </h2>
                  <p id="key-flow-description">
                    {lang === 'en'
                      ? 'Choose words with asdfghjkl, then qwertyuiop. Use English input.'
                      : '按 asdfghjkl 选词，超出后接 qwertyuiop。请使用英文输入状态。'}
                  </p>
                </div>
                <Switch
                  aria-labelledby="key-flow-label"
                  aria-describedby="key-flow-description"
                  checked={keyFlow}
                  onCheckedChange={changeKeyFlow}
                />
              </div>
              <div className="setting-row">
                <div>
                  <h2 id="sound-label">
                    {lang === 'en' ? 'Sound feedback' : '输入音效'}
                  </h2>
                  <p>
                    {lang === 'en'
                      ? 'Soft key clicks and single error or completion tones.'
                      : '轻薄键击与轻柔的单音反馈'}
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
            <h1>
              {lang === 'en' ? 'Group practice finished' : '本组练习结束'}
            </h1>
            <div className="group-end-actions">
              <Button
                className="air-primary"
                onClick={() =>
                  groupIndex < currentGroups.length - 1
                    ? choose(currentGroups[groupIndex + 1].id)
                    : openCollection(true)
                }
              >
                {groupIndex < currentGroups.length - 1
                  ? lang === 'en'
                    ? 'Next group'
                    : '下一组'
                  : lang === 'en'
                    ? 'Choose a group'
                    : '选择题组'}
                <ArrowRight />
              </Button>
              <Button
                variant="outline"
                className="preference-button"
                onClick={() => choose(groupId, true)}
              >
                {c.again}
              </Button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
