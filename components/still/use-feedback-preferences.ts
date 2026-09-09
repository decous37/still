'use client';
import { useState } from 'react';
import { stopFeedback } from './feedback';
function read(key: string) {
  try {
    return localStorage.getItem(key) !== 'false';
  } catch {
    return true;
  }
}
export function useFeedbackPreferences() {
  const [sound, setSound] = useState(() => read('still:sound')),
    [haptics, setHaptics] = useState(() => read('still:haptics'));
  function toggleSound() {
    stopFeedback();
    setSound((value) => {
      try {
        localStorage.setItem('still:sound', String(!value));
      } catch {}
      return !value;
    });
  }
  function toggleHaptics() {
    stopFeedback();
    setHaptics((value) => {
      try {
        localStorage.setItem('still:haptics', String(!value));
      } catch {}
      return !value;
    });
  }
  return { sound, haptics, toggleSound, toggleHaptics };
}
