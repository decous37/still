export const KEY_FLOW_KEYS = 'asdfghjklqwertyuiop';
export const KEY_FLOW_STORAGE = 'still:key-flow';
export const DESKTOP_POINTER = '(hover: hover) and (pointer: fine)';

export function readKeyFlow(
  storage: Pick<Storage, 'getItem'>,
  desktop: boolean,
) {
  try {
    const saved = storage.getItem(KEY_FLOW_STORAGE);
    if (saved === 'true' || saved === 'false') return saved === 'true';
  } catch {
    /* Use the device default when storage is blocked. */
  }
  return desktop;
}

export function saveKeyFlow(storage: Pick<Storage, 'setItem'>, value: boolean) {
  try {
    storage.setItem(KEY_FLOW_STORAGE, String(value));
  } catch {
    /* Session only. */
  }
}

type KeyInput = Pick<
  KeyboardEvent,
  | 'key'
  | 'repeat'
  | 'isComposing'
  | 'keyCode'
  | 'ctrlKey'
  | 'metaKey'
  | 'altKey'
  | 'defaultPrevented'
>;
export function keyFlowIndex(event: KeyInput, editable: boolean) {
  if (
    editable ||
    event.repeat ||
    event.isComposing ||
    event.keyCode === 229 ||
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    event.defaultPrevented ||
    event.key.length !== 1
  )
    return -1;
  return KEY_FLOW_KEYS.indexOf(event.key.toLowerCase());
}

export function isEditableTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      !!target.closest(
        'input, textarea, select, [role="textbox"], [role="combobox"], [role="searchbox"]',
      ))
  );
}
