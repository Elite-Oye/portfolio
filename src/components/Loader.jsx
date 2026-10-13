import { useEffect, useState } from 'react';
import { prefersReduced } from '../lib/hooks';

// Short boot screen, shown once per browser session.
export default function Loader() {
  const [show, setShow] = useState(() => {
    try { return !sessionStorage.getItem('oye-booted') && !prefersReduced(); } catch { return true; }
  });
  const [pct, setPct] = useState(0);
  const [out, setOut] = useState(false);

  useEffect(() => {
    if (!show) return;
    document.body.style.overflow = 'hidden';
    let raf, t;
    const t0 = performance.now();
    const d = 1100;
    const tick = (now) => {
      const p = Math.min((now - t0) / d, 1);
      setPct(Math.round(100 * (1 - Math.pow(1 - p, 2))));
      if (p < 1) { raf = requestAnimationFrame(tick); return; }
      setOut(true);
      try { sessionStorage.setItem('oye-booted', '1'); } catch { /* ignore */ }
      t = setTimeout(() => { setShow(false); document.body.style.overflow = ''; }, 750);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); document.body.style.overflow = ''; };
  }, [show]);

  if (!show) return null;
  return (
    <div className={'loader' + (out ? ' out' : '')} role="status" aria-label="Loading">
      <div className="loader-in">
        <div className="loader-logo">OYE<span>.</span></div>
        <div className="loader-row mono">
          <span>BOOTING ELYTE</span>
          <span>{String(pct).padStart(3, '0')}%</span>
        </div>
        <div className="loader-bar"><i style={{ width: pct + '%' }} /></div>
        <div className="loader-log mono">
          {pct > 15 && <div>&gt; loading stack ......... ok</div>}
          {pct > 45 && <div>&gt; scanning ports ........ secure</div>}
          {pct > 75 && <div>&gt; compiling vibes ....... done</div>}
        </div>
      </div>
    </div>
  );
}
