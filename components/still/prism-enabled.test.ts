import { afterEach, expect, it, vi } from 'vitest';
afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });
it('Prism is opt-in and only enabled by the literal true flag', async () => {
  for (const value of [undefined, 'false', '1', 'true']) {
    vi.stubEnv('VITE_PRISM_ENABLED', value); vi.resetModules();
    expect((await import('./prism-enabled')).PRISM_ENABLED).toBe(value === 'true');
  }
});
