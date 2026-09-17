import { useEffect, useRef } from 'react';
import type { PrismAudio } from './audio';
type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  hue: number;
};
export function PrismScene({
  running,
  lowMotion,
  pulse,
  audio,
}: {
  running: boolean;
  lowMotion: boolean;
  pulse: number;
  audio: PrismAudio;
}) {
  const canvas = useRef<HTMLCanvasElement>(null),
    signal = useRef(pulse);
  signal.current = pulse;
  useEffect(() => {
    const el = canvas.current,
      ctx = el?.getContext('2d');
    if (!el || !ctx || !running || lowMotion) return;
    let frame = 0,
      previous = 0,
      age = 0,
      burst = 0,
      observed = signal.current;
    let width = 0,
      height = 0,
      particles: Particle[] = [];
    const resize = () => {
      width = el.clientWidth;
      height = el.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      el.width = width * ratio;
      el.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    resize();
    const draw = (now: number) => {
      const dt = Math.min((now - (previous || now)) / 1000, 0.05);
      previous = now;
      age += dt;
      ctx.clearRect(0, 0, width, height);
      const beat = audio.running ? audio.beat : age * 2;
      el.parentElement?.style.setProperty(
        '--prism-beat',
        String(0.2 + Math.sin(beat * Math.PI) ** 2 * 0.65),
      );
      const limit = width <= 600 ? 40 : 120;
      if (particles.length > limit) particles.length = limit;
      if (age > burst || observed !== signal.current) {
        observed = signal.current;
        burst = age + 0.65;
        const side = Math.random() < 0.5 ? 0.12 : 0.88,
          hue = Math.random() * 360;
        for (let i = 0; i < 14 && particles.length < limit; i++) {
          const angle = Math.random() * Math.PI * 2;
          particles.push({
            x: width * side,
            y: height * (0.2 + Math.random() * 0.65),
            vx: Math.cos(angle) * 70,
            vy: Math.sin(angle) * 70,
            life: 1,
            hue,
          });
        }
      }
      for (let i = 0; i < 3; i++) {
        const x = width * (i === 1 ? 0.92 : 0.05),
          y = height * (0.2 + i * 0.3);
        ctx.strokeStyle = `hsla(${(age * 12 + i * 100) % 360},95%,65%,${0.09 + Math.sin(beat * Math.PI) ** 2 * 0.08})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x, y, 45 + (beat % 4) * 45, 0, Math.PI * 2);
        ctx.stroke();
      }
      particles = particles.filter((p) => p.life > 0);
      for (const p of particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt * 0.7;
        ctx.fillStyle = `hsla(${p.hue},100%,72%,${Math.max(0, p.life) * 0.7})`;
        ctx.fillRect(p.x, p.y, 2.5, 2.5);
      }
      el.dataset.particles = String(particles.length);
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      ctx.clearRect(0, 0, width, height);
      el.dataset.particles = '0';
      el.parentElement?.style.removeProperty('--prism-beat');
    };
  }, [running, lowMotion, audio]);
  return <canvas className="prism-scene" ref={canvas} aria-hidden="true" />;
}
