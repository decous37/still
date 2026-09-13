let context: AudioContext | undefined;
let generation = 0;
const playing = new Set<AudioScheduledSourceNode>();
type Sound = 'key' | 'error' | 'success';
const TAU = Math.PI * 2;

export function stopFeedback() {
  generation++;
  for (const source of playing) {
    try {
      source.stop();
    } catch {}
  }
  playing.clear();
  try {
    navigator.vibrate?.(0);
  } catch {}
}

function tone(t: number, kind: 'error' | 'success', duration: number) {
  if (t < 0 || t >= duration) return 0;
  const envelope = Math.min(1, t / 0.002, (duration - t) / 0.012);
  if (kind === 'success') {
    // Inharmonic resonances create one light metal contact, without pitch bending.
    return envelope * (
      Math.exp(-t / 0.10) * Math.sin(TAU * 1800 * t) +
      0.28 * Math.exp(-t / 0.055) * Math.sin(TAU * 2870 * t) +
      0.12 * Math.exp(-t / 0.025) * Math.sin(TAU * 4210 * t)
    );
  }
  // A single steady electronic beep; no second pulse or wooden/watery decay.
  const phase = TAU * 1100 * t;
  return envelope * (Math.sin(phase) + 0.18 * Math.sin(3 * phase));
}

function playSound(kind: Sound) {
  const current = generation;
  try {
    context ??= new AudioContext();
    const audio = context;
    void audio
      .resume()
      .then(() => {
        if (current !== generation) return;
        const duration =
          kind === 'key' ? 0.045 : kind === 'success' ? 0.18 : 0.09;
        const buffer = audio.createBuffer(
          1,
          Math.ceil(audio.sampleRate * duration),
          audio.sampleRate,
        );
        const data = buffer.getChannelData(0);
        let energy = 0,
          active = 0,
          peak = 0;
        for (let i = 0; i < data.length; i++) {
          const t = i / audio.sampleRate;
          let value: number;
          if (kind === 'key') {
            value = (Math.random() * 2 - 1) * Math.exp(-t / 0.008);
          } else if (kind === 'error') {
            value = tone(t, 'error', duration);
          } else {
            value = tone(t, 'success', duration);
          }
          data[i] = value;
          if (value !== 0) {
            energy += value * value;
            active++;
          }
          peak = Math.max(peak, Math.abs(value));
        }
        // Restore the original short noise click at slightly reduced gain.
        // Keep the single textured cues quiet and matched to each other.
        const scale = kind === 'key' ? 0.065 : Math.min(
          0.018 / Math.sqrt(energy / Math.max(1, active)),
          0.065 / (peak || 1),
        );
        for (let i = 0; i < data.length; i++) data[i] *= scale;
        const source = audio.createBufferSource();
        source.buffer = buffer;
        const filter = kind === 'key' ? audio.createBiquadFilter() : undefined;
        if (filter) {
          filter.type = 'highpass';
          filter.frequency.value = 1700;
          source.connect(filter).connect(audio.destination);
        } else source.connect(audio.destination);
        playing.add(source);
        source.onended = () => {
          playing.delete(source);
          source.disconnect();
          filter?.disconnect();
        };
        source.start(audio.currentTime);
      })
      .catch(() => {});
  } catch {}
}

export function keySound() {
  playSound('key');
}
export function errorSound() {
  playSound('error');
}
// Replaces the final key click, so completion is heard only once.
export function successSound() {
  playSound('success');
}
export function errorHaptic() {
  try {
    navigator.vibrate?.(20);
  } catch {}
}
