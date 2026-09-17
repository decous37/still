import { afterEach, describe, expect, it, vi } from 'vitest';
import { MAX_VOICES, PrismAudio } from './audio';
import { defaults } from './preferences';

class Param {
  value = 0;
  setValueAtTime() {}
  setTargetAtTime() {}
  cancelScheduledValues() {}
  linearRampToValueAtTime() {}
  exponentialRampToValueAtTime() {}
}
class Node {
  gain = new Param();
  frequency = new Param();
  threshold = new Param();
  ratio = new Param();
  type = 'sine';
  onended?: () => void;
  connect(n: Node) {
    return n;
  }
  disconnect() {}
  start() {}
  stop = vi.fn(() => {});
}
class FakeAudio {
  state = 'running';
  currentTime = 0;
  destination = new Node();
  sources: Node[] = [];
  createGain() {
    return new Node();
  }
  createDynamicsCompressor() {
    return new Node();
  }
  createOscillator() {
    const n = new Node();
    this.sources.push(n);
    return n;
  }
  async resume() {}
  async close() {
    this.state = 'closed';
  }
}
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
describe('Prism audio lifecycle', () => {
  it('caps voices, cancels scheduler on pause, and supports dispose/remount', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('AudioContext', FakeAudio);
    const audio = new PrismAudio();
    expect(await audio.start()).toBe(true);
    for (let i = 0; i < 200; i++) audio.cue('key');
    expect(audio.voiceCount).toBeLessThanOrEqual(MAX_VOICES);
    audio.configure({ ...defaults, muted: true });
    audio.pause();
    expect(audio.voiceCount).toBe(0);
    expect(audio.running).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
    expect(await audio.start()).toBe(true);
    audio.dispose();
    expect(vi.getTimerCount()).toBe(0);
    expect(await audio.start()).toBe(true);
    audio.dispose();
  });
  it('ignores a pending audio resume after the session was paused', async () => {
    vi.useFakeTimers();
    let resolve!: () => void;
    class PendingAudio extends FakeAudio {
      resume() {
        return new Promise<void>((r) => {
          resolve = r;
        });
      }
    }
    vi.stubGlobal('AudioContext', PendingAudio);
    const audio = new PrismAudio(),
      pending = audio.start();
    audio.pause();
    resolve();
    expect(await pending).toBe(false);
    expect(audio.running).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
    audio.dispose();
  });
  it('degrades without Web Audio', async () => {
    vi.stubGlobal('AudioContext', undefined);
    const audio = new PrismAudio();
    expect(await audio.start()).toBe(false);
    expect(() => {
      audio.cue('error');
      audio.pause();
      audio.dispose();
    }).not.toThrow();
  });
});
