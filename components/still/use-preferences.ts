'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

import type { Lang, Theme } from './types';

const LANG_KEY = 'still:lang';
const THEME_KEY = 'still:theme';

function writeStored(key: string, value: string) {
  // 存储不可用时静默退回内存状态，练习照常运行
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

/**
 * 首绘前的引导脚本已经把主题与语言写到 <html> 上，
 * 这里从同一处读取初始值，保证界面与已绘制的内容一致。
 */
function readLang(): Lang {
  if (typeof document === 'undefined') return 'en';
  return document.documentElement.lang === 'zh-CN' ? 'zh-CN' : 'en';
}

function readTheme(): Theme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

const subscribeNoop = () => () => {};
const getMounted = () => true;
const getNotMounted = () => false;

export function usePreferences() {
  // 首帧统一渲染骨架，挂载后再显示真实内容，避免语言或主题闪烁
  const ready = useSyncExternalStore(subscribeNoop, getMounted, getNotMounted);
  const [lang, setLang] = useState<Lang>(readLang);
  const [theme, setTheme] = useState<Theme>(readTheme);

  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
    writeStored(THEME_KEY, theme);
  }, [theme, ready]);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = lang;
    writeStored(LANG_KEY, lang);
  }, [lang, ready]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  const toggleLang = useCallback(() => {
    setLang((current) => (current === 'zh-CN' ? 'en' : 'zh-CN'));
  }, []);

  return { ready, lang, theme, toggleLang, toggleTheme };
}
