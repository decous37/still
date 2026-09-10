import { afterEach, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

function audioMock(resume = () => Promise.resolve()) {
  const sources: {
    start: ReturnType<typeof vi.fn>;
    stop: ReturnType<typeof vi.fn>;
  }[] = [];
  const parameter = () => ({
    value: 0,
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
  });
  const node = () => ({
    connect: vi.fn(function (this: unknown) {
      return this;
    }),
    disconnect: vi.fn(),
  });
  const source = () => {
    const result = {
      ...node(),
      start: vi.fn(),
      stop: vi.fn(),
      frequency: parameter(),
      onended: null,
    };
    sources.push(result);
    return result;
  };
  vi.stubGlobal(
    'AudioContext',
    class {
      sampleRate = 48000;
      currentTime = 0;
      destination = {};
      resume = resume;
      createBuffer() {
        return { getChannelData: () => new Float32Array(2160) };
      }
      createBufferSource = source;
      createOscillator = source;
      createBiquadFilter() {
        return { ...node(), frequency: parameter() };
      }
      createGain() {
        return { ...node(), gain: parameter() };
      }
    },
  );
  return sources;
}

it('plays one source per key/error and stops active feedback', async () => {
  const sources = audioMock();
  const { keySound, errorSound, stopFeedback } = await import('./feedback');
  keySound();
  errorSound();
  await Promise.resolve();
  expect(sources).toHaveLength(2);
  sources.forEach((s) => expect(s.start).toHaveBeenCalledTimes(1));
  stopFeedback();
  sources.forEach((s) => expect(s.stop).toHaveBeenCalled());
});

it('cancels pending sounds before audio permission resolves', async () => {
  let release!: () => void;
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  const sources = audioMock(() => pending);
  const { keySound, errorSound, stopFeedback } = await import('./feedback');
  keySound();
  errorSound();
  stopFeedback();
  release();
  await Promise.resolve();
  expect(sources).toHaveLength(0);
});

it('does not throw when audio is unavailable', async () => {
  vi.stubGlobal('AudioContext', undefined);
  const { keySound, errorSound, stopFeedback } = await import('./feedback');
  expect(() => {
    keySound();
    errorSound();
    stopFeedback();
  }).not.toThrow();
});
