let context: AudioContext | undefined;
let generation = 0;
const playing = new Set<AudioScheduledSourceNode>();
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
export function keySound() {
  const current = generation;
  try {
    context ??= new AudioContext();
    const audio = context;
    void audio
      .resume()
      .then(() => {
        if (current !== generation) return;
        const buffer = audio.createBuffer(
          1,
          Math.ceil(audio.sampleRate * 0.045),
          audio.sampleRate,
        );
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++)
          data[i] =
            (Math.random() * 2 - 1) * Math.exp(-i / (audio.sampleRate * 0.008));
        const source = audio.createBufferSource(),
          filter = audio.createBiquadFilter(),
          gain = audio.createGain();
        source.buffer = buffer;
        filter.type = 'highpass';
        filter.frequency.value = 1700;
        gain.gain.value = 0.075;
        source.connect(filter).connect(gain).connect(audio.destination);
        playing.add(source);
        source.start();
        source.onended = () => {
          playing.delete(source);
          source.disconnect();
          filter.disconnect();
          gain.disconnect();
        };
      })
      .catch(() => {});
  } catch {}
}
export function errorSound() {
  const current = generation;
  try {
    context ??= new AudioContext();
    const audio = context;
    void audio
      .resume()
      .then(() => {
        if (current !== generation) return;
        const now = audio.currentTime;
        const tone = audio.createOscillator();
        const gain = audio.createGain();
        tone.type = 'sine';
        tone.frequency.setValueAtTime(440, now);
        tone.frequency.exponentialRampToValueAtTime(350, now + 0.08);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.045, now + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.085);
        tone.connect(gain).connect(audio.destination);
        playing.add(tone);
        tone.onended = () => {
          playing.delete(tone);
          tone.disconnect();
          gain.disconnect();
        };
        tone.start(now);
        tone.stop(now + 0.09);
      })
      .catch(() => {});
  } catch {}
}
export function errorHaptic() {
  try {
    navigator.vibrate?.(20);
  } catch {}
}
