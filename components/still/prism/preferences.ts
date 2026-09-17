export type PrismPreferences = {
  music: number;
  effects: number;
  muted: boolean;
  lowMotion: boolean;
};
export const defaults: PrismPreferences = {
  music: 0.35,
  effects: 0.5,
  muted: false,
  lowMotion: false,
};
export const preferencesKey = 'still:prism:preferences:v1';
export function readPreferences(
  storage: Pick<Storage, 'getItem'>,
): PrismPreferences {
  try {
    const p = JSON.parse(storage.getItem(preferencesKey) ?? '{}');
    const volume = (v: unknown, fallback: number) =>
      typeof v === 'number' && Number.isFinite(v)
        ? Math.max(0, Math.min(1, v))
        : fallback;
    return {
      music: volume(p.music, defaults.music),
      effects: volume(p.effects, defaults.effects),
      muted: typeof p.muted === 'boolean' ? p.muted : false,
      lowMotion: typeof p.lowMotion === 'boolean' ? p.lowMotion : false,
    };
  } catch {
    return { ...defaults };
  }
}
export function savePreferences(
  storage: Pick<Storage, 'setItem'>,
  p: PrismPreferences,
) {
  try {
    storage.setItem(preferencesKey, JSON.stringify(p));
  } catch {
    /* Session only. */
  }
}
