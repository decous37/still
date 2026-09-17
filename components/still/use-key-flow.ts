'use client';
import { useEffect, useState } from 'react';
import {
  DESKTOP_POINTER,
  readKeyFlow,
  saveKeyFlow,
  keyFlowIndex,
  isEditableTarget,
} from './key-flow';

export function useKeyFlowPreference() {
  const [keyFlow, setKeyFlow] = useState(() => {
    if (typeof window === 'undefined') return false;
    const desktop = window.matchMedia?.(DESKTOP_POINTER).matches ?? false;
    try {
      return readKeyFlow(window.localStorage, desktop);
    } catch {
      return desktop;
    }
  });
  function changeKeyFlow(value: boolean) {
    setKeyFlow(value);
    try {
      saveKeyFlow(window.localStorage, value);
    } catch {
      /* Session only. */
    }
  }
  return { keyFlow, changeKeyFlow };
}

export function useKeyFlowInput(
  enabled: boolean,
  onKey: (index: number) => void,
) {
  useEffect(() => {
    if (!enabled) return;
    let composing = false;
    const start = () => {
      composing = true;
    };
    const end = () => {
      composing = false;
    };
    const press = (event: KeyboardEvent) => {
      if (document.hidden || composing) return;
      const index = keyFlowIndex(
        event,
        event.composedPath().some(isEditableTarget),
      );
      if (index < 0) return;
      event.preventDefault();
      onKey(index);
    };
    document.addEventListener('keydown', press);
    document.addEventListener('compositionstart', start);
    document.addEventListener('compositionend', end);
    window.addEventListener('blur', end);
    return () => {
      document.removeEventListener('keydown', press);
      document.removeEventListener('compositionstart', start);
      document.removeEventListener('compositionend', end);
      window.removeEventListener('blur', end);
    };
  }, [enabled, onKey]);
}
