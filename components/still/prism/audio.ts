import { defaults, type PrismPreferences } from './preferences';

export const MAX_VOICES = 24;
export class PrismAudio {
  private context?: AudioContext;
  private master?: GainNode;
  private music?: GainNode;
  private effects?: GainNode;
  private limiter?: DynamicsCompressorNode;
  private timer?: ReturnType<typeof setInterval>;
  private voices = new Set<OscillatorNode>();
  private next = 0;
  private step = 0;
  private epoch = 0;
  private generation = 0;
  private disposed = false;
  private settings = { ...defaults };
  get voiceCount() {
    return this.voices.size;
  }
  get running() {
    return this.timer !== undefined;
  }
  get beat() {
    return this.context && this.running
      ? (this.context.currentTime - this.epoch) * 2
      : 0;
  }
  async start(): Promise<boolean> {
    const generation = ++this.generation;
    this.disposed = false;
    try {
      if (!this.context || this.context.state === 'closed') {
        this.context = new AudioContext();
        this.master = this.context.createGain();
        this.music = this.context.createGain();
        this.effects = this.context.createGain();
        this.limiter = this.context.createDynamicsCompressor();
        this.limiter.threshold.value = -12;
        this.limiter.ratio.value = 12;
        this.music.connect(this.master);
        this.effects.connect(this.master);
        this.master.connect(this.limiter).connect(this.context.destination);
        this.master.gain.value = 0;
      }
      await this.context.resume();
      if (
        generation !== this.generation ||
        this.disposed ||
        this.context.state !== 'running'
      )
        return false;
      if (this.timer) clearInterval(this.timer);
      this.configure(this.settings);
      this.next = this.context.currentTime + 0.04;
      this.epoch = this.next - this.step * 0.125;
      this.schedule();
      this.timer = setInterval(() => this.schedule(), 25);
      return true;
    } catch {
      return false;
    }
  }
  configure(settings: PrismPreferences) {
    this.settings = settings;
    if (!this.context || !this.master || !this.music || !this.effects) return;
    const now = this.context.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setTargetAtTime(settings.muted ? 0 : 0.32, now, 0.025);
    this.music.gain.setTargetAtTime(settings.music, now, 0.02);
    this.effects.gain.setTargetAtTime(settings.effects, now, 0.02);
  }
  private note(
    frequency: number,
    at: number,
    duration: number,
    level: number,
    destination: GainNode,
    wave: OscillatorType = 'sine',
    endFrequency?: number,
  ) {
    const a = this.context;
    if (!a || this.voices.size >= MAX_VOICES) return;
    const source = a.createOscillator(),
      envelope = a.createGain();
    source.type = wave;
    source.frequency.setValueAtTime(frequency, at);
    if (endFrequency)
      source.frequency.exponentialRampToValueAtTime(
        endFrequency,
        at + duration,
      );
    envelope.gain.setValueAtTime(0, at);
    envelope.gain.linearRampToValueAtTime(level, at + 0.004);
    envelope.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    source.connect(envelope).connect(destination);
    this.voices.add(source);
    source.onended = () => {
      this.voices.delete(source);
      source.disconnect();
      envelope.disconnect();
    };
    source.start(at);
    source.stop(at + duration + 0.005);
  }
  private schedule() {
    if (!this.context || !this.music) return;
    // A delayed scheduler skips missed beats rather than emitting a catch-up burst.
    if (this.next < this.context.currentTime) {
      const skip = Math.ceil((this.context.currentTime - this.next) / 0.125);
      this.step += skip;
      this.next += skip * 0.125;
    }
    while (this.next < this.context.currentTime + 0.1) {
      const s = this.step % 256,
        section = Math.floor(s / 64),
        t = this.next;
      if (s % 4 === 0) this.note(135, t, 0.16, 0.8, this.music, 'sine', 45);
      if (s % 8 === 4)
        this.note(190, t, 0.07, 0.2, this.music, 'triangle', 100);
      if (s % (section === 3 ? 2 : 4) === 2)
        this.note(6500, t, 0.022, 0.07, this.music, 'square');
      if (s % 8 === 0)
        this.note(
          [110, 130.81, 146.83, 98][Math.floor(s / 16) % 4],
          t,
          0.3,
          0.24,
          this.music,
          'triangle',
        );
      if (section > 0 && s % 4 === 2)
        this.note(
          [440, 523.25, 587.33, 659.25][Math.floor(s / 4) % 4],
          t,
          0.12,
          0.09,
          this.music,
          'triangle',
        );
      this.step++;
      this.next += 0.125;
    }
  }
  cue(kind: 'key' | 'error' | 'complete') {
    if (!this.context || !this.effects || !this.running) return;
    const t = this.context.currentTime;
    if (kind === 'key')
      this.note(750, t, 0.055, 0.4, this.effects, 'triangle', 400);
    else if (kind === 'error')
      this.note(210, t, 0.065, 0.22, this.effects, 'square');
    else this.note(1200, t, 0.14, 0.35, this.effects, 'triangle', 1700);
  }
  pause() {
    this.generation++;
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
    const now = this.context?.currentTime ?? 0;
    this.master?.gain.cancelScheduledValues(now);
    this.master?.gain.setTargetAtTime(0, now, 0.005);
    for (const voice of this.voices) {
      try {
        voice.stop(now + 0.025);
      } catch {}
    }
    this.voices.clear();
  }
  dispose() {
    this.disposed = true;
    this.pause();
    void this.context?.close().catch(() => {});
    this.context = undefined;
  }
}
