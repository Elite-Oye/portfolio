import { useEffect, useRef } from 'react';
import { prefersReduced } from '../lib/hooks';

// Floating glow particles + grid + grain + cursor spotlight.
// Capped particle count, DPR capped at 1.5, paused when the tab is hidden.
export default function Background({ theme }) {
  const canvas = useRef(null);
  const spot = useRef(null);

  useEffect(() => {
    const c = canvas.current;
    const ctx = c.getContext('2d');
    const css = getComputedStyle(document.documentElement);
    const c1 = css.getPropertyValue('--acc-rgb').trim() || '196,255,61';
    const c2 = css.getPropertyValue('--acc2-rgb').trim() || '59,227,255';
    const light = theme === 'paper';
    let w, h, dpr, ps = [], raf, running = true;

    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = c.width = window.innerWidth * dpr;
      h = c.height = window.innerHeight * dpr;
      c.style.width = window.innerWidth + 'px';
      c.style.height = window.innerHeight + 'px';
      const n = window.innerWidth < 700 ? 26 : 55;
      ps = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: (Math.random() * 1.8 + 0.9) * dpr,
        vy: -(Math.random() * 0.25 + 0.05) * dpr,
        vx: (Math.random() - 0.5) * 0.15 * dpr,
        a: Math.random() * Math.PI * 2,
        col: Math.random() < 0.8 ? c1 : c2,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.y += p.vy; p.x += p.vx; p.a += 0.02;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        const o = (0.35 + Math.sin(p.a) * 0.25) * (light ? 0.7 : 1);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3, 0, 7);
        ctx.fillStyle = `rgba(${p.col},${o * 0.12})`; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7);
        ctx.fillStyle = `rgba(${p.col},${o + 0.2})`; ctx.fill();
      }
    };

    const loop = () => { if (!running) return; draw(); raf = requestAnimationFrame(loop); };
    const onVis = () => {
      running = !document.hidden;
      cancelAnimationFrame(raf);
      if (running && !prefersReduced()) loop();
    };
    let rt;
    const onResize = () => { clearTimeout(rt); rt = setTimeout(() => { size(); if (prefersReduced()) draw(); }, 150); };

    size();
    if (prefersReduced()) draw(); else loop();
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      running = false; cancelAnimationFrame(raf); clearTimeout(rt);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [theme]);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    let raf;
    const move = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (spot.current) spot.current.style.transform = `translate3d(${e.clientX - 260}px, ${e.clientY - 260}px, 0)`;
      });
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className="bg" aria-hidden="true">
      <canvas ref={canvas} className="bg-fx" />
      <div className="bg-grid" />
      <div className="bg-orb" />
      <div ref={spot} className="bg-spot" />
      <div className="bg-grain" />
    </div>
  );
}
