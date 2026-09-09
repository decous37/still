let context: AudioContext | undefined;
let generation = 0;
export function stopFeedback() {
  generation++;
  try {
    if (context?.state === 'running') void context.suspend().catch(() => {});
  } catch {}
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
        filter.type = 'lowpass';
        filter.frequency.value = 1800;
        gain.gain.value = 0.065;
        source.connect(filter).connect(gain).connect(audio.destination);
        source.start();
        source.onended = () => {
          source.disconnect();
          filter.disconnect();
          gain.disconnect();
        };
      })
      .catch(() => {});
  } catch {}
}
export function errorHaptic() {
  try {
    navigator.vibrate?.(20);
  } catch {}
}
