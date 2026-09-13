import { afterEach, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

function audioMock(resume = () => Promise.resolve()) {
  const sources: {
    start: ReturnType<typeof vi.fn>;
    stop: ReturnType<typeof vi.fn>;
    buffer?: { getChannelData: () => Float32Array };
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
      createBuffer(_channels: number, length: number) {
        const data = new Float32Array(length);
        return { getChannelData: () => data };
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

it('plays quiet keys and single immediate tones; cancels all sources', async () => {
  const sources = audioMock();
  const { keySound, errorSound, successSound, stopFeedback } =
    await import('./feedback');
  keySound();
  errorSound();
  successSound();
  await Promise.resolve();
  expect(sources).toHaveLength(3);
  sources.forEach((s) => expect(s.start).toHaveBeenCalledTimes(1));
  expect(sources[2].start).toHaveBeenCalledWith(0);
  sources.forEach((s, index) => {
    const samples = [...s.buffer!.getChannelData()].filter(
      (value) => value !== 0,
    );
    const rms = Math.sqrt(
      samples.reduce((sum, value) => sum + value * value, 0) / samples.length,
    );
    if (index > 0) expect(rms).toBeCloseTo(0.018, 3);
    else expect(rms).toBeLessThan(0.02);
    expect(Math.max(...samples.map(Math.abs))).toBeLessThanOrEqual(0.066);
  });
  const error = sources[1].buffer!.getChannelData();
  expect(error).toHaveLength(4320);
  expect(sources[2].buffer!.getChannelData()).toHaveLength(8640);
  stopFeedback();
  sources.forEach((s) => expect(s.stop).toHaveBeenCalled());
});

it('cancels pending sounds before audio permission resolves', async () => {
  let release!: () => void;
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  const sources = audioMock(() => pending);
  const { keySound, errorSound, successSound, stopFeedback } =
    await import('./feedback');
  keySound();
  errorSound();
  successSound();
  stopFeedback();
  release();
  await Promise.resolve();
  expect(sources).toHaveLength(0);
});

it('does not throw when audio is unavailable', async () => {
  vi.stubGlobal('AudioContext', undefined);
  const { keySound, errorSound, successSound, stopFeedback } =
    await import('./feedback');
  expect(() => {
    keySound();
    errorSound();
    successSound();
    stopFeedback();
  }).not.toThrow();
});
