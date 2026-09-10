import { groups, type Locale, type Mode } from './questions';

export type GroupProgress = Record<string, string[]>;
export const progressStorageKey = 'still:group-progress:v1';
export const migrationStorageKey = 'still:group-progress-migrated:v1';
type StorageAccess = Pick<Storage, 'getItem' | 'setItem'>;
export const progressKey = (locale: Locale, groupId: string) =>
  `${locale}:${groupId}`;

export function readGroupProgress(
  storage: StorageAccess,
  counts: Record<string, number>,
): GroupProgress {
  const result: GroupProgress = {};
  try {
    const raw = storage.getItem(progressStorageKey);
    const saved = raw ? JSON.parse(raw) : {};
    const migrated = storage.getItem(migrationStorageKey) === '1';
    for (const locale of ['en', 'zh-CN'] as const) {
      for (const mode of ['word', 'sentence', 'recall'] as const) {
        for (const group of groups(mode)) {
          const key = progressKey(locale, group.id);
          const valid = group.questionIds[locale];
          const existing =
            saved && Array.isArray(saved[key]) ? saved[key] : null;
          result[key] = existing
            ? [
                ...new Set<string>(
                  existing.filter(
                    (id: unknown) =>
                      typeof id === 'string' && valid.includes(id),
                  ),
                ),
              ]
            : migrated
              ? []
              : valid.filter((id) => counts[id] > 0);
        }
      }
    }
  } catch {
    /* Blocked storage: keep a usable session. */
  }
  return result;
}

export function saveGroupProgress(
  storage: StorageAccess,
  progress: GroupProgress,
) {
  try {
    storage.setItem(progressStorageKey, JSON.stringify(progress));
    // Only mark migration after progress has been stored successfully.
    storage.setItem(migrationStorageKey, '1');
  } catch {
    /* Session progress remains usable. */
  }
}

export function completeInGroup(
  progress: GroupProgress,
  locale: Locale,
  mode: Mode,
  groupId: string,
  id: string,
): GroupProgress {
  if (
    !groups(mode)
      .find((g) => g.id === groupId)
      ?.questionIds[locale].includes(id)
  )
    return progress;
  const key = progressKey(locale, groupId);
  const previous = progress[key] ?? [];
  return previous.includes(id)
    ? progress
    : { ...progress, [key]: [...previous, id] };
}

export function restartGroup(
  progress: GroupProgress,
  locale: Locale,
  groupId: string,
): GroupProgress {
  return { ...progress, [progressKey(locale, groupId)]: [] };
}
