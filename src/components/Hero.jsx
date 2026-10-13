import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { heroWords, profile, stats, marquee } from '../data';
import { useCountUp, useInView, prefersReduced } from '../lib/hooks';
import Icon from './Icon';

function RotatingWord() {
  const [text, setText] = useState(heroWords[0]);
  useEffect(() => {
    if (prefersReduced()) return;
    let i = 0, j = heroWords[0].length, del = true, t;
    const step = () => {
      if (del) {
        j--;
        if (j <= 0) { del = false; i = (i + 1) % heroWords.length; }
      } else {
        j++;
        if (j >= heroWords[i].length) { setText(heroWords[i]); del = true; t = setTimeout(step, 1900); return; }
      }
      setText(heroWords[i].slice(0, Math.max(j, 0)));
      t = setTimeout(step, del ? 40 : 75);
    };
    t = setTimeout(step, 2600);
    return () => clearTimeout(t);
  }, []);
  return <span className="rot">{text || ' '}</span>;
}

const LINES = [
  ['p', '$ '], ['', 'whoami\n'],
  ['c', 'oyewole "oye" erinfolami\n'],
  ['p', '$ '], ['', 'cat stack.txt\n'],
  ['m', 'react · react-native · node · mongodb\nts · ton · n8n · kali\n'],
  ['p', '$ '], ['', './ship --idea=yours\n'],
  ['ok', '[✓] secure  [✓] fast  [✓] deployed\n'],
  ['p', '$ '],
];

function Terminal() {
  const body = useRef(null);
  useEffect(() => {
    const el = body.current;
    el.innerHTML = '';
    if (prefersReduced()) {
      LINES.forEach(([cls, s]) => { const sp = document.createElement('span'); sp.className = cls; sp.textContent = s; el.appendChild(sp); });
      return;
    }
    let li = 0, ci = 0, span, t;
    const go = () => {
      if (li >= LINES.length) { el.insertAdjacentHTML('beforeend', '<span class="caret"></span>'); return; }
      const [cls, str] = LINES[li];
      if (ci === 0) { span = document.createElement('span'); if (cls) span.className = cls; el.appendChild(span); }
      const instant = cls && cls !== 'p';
      span.textContent = instant ? str : str.slice(0, ci + 1);
      if (instant || ci + 1 >= str.length) { li++; ci = 0; t = setTimeout(go, instant ? 260 : 110); }
      else { ci++; t = setTimeout(go, 36 + Math.random() * 50); }
    };
    t = setTimeout(go, 1400);
    return () => { clearTimeout(t); el.innerHTML = ''; };
  }, []);

  return (
    <div className="term">
      <div className="term-bar"><i /><i /><i /><span>oye@elyte: ~</span></div>
      <div className="term-body" ref={body} />
    </div>
  );
}

function Stat({ s, run }) {
  const v = useCountUp(s.n || 0, run);
  return (
    <div className="stat">
      <b>{s.text ? s.text : `${v}${s.suffix}`}</b>
      <span className="mono">{s.label}</span>
    </div>
  );
}

export default function Hero() {
  const [ref, inView] = useInView({ threshold: 0.1 });
  return (
    <>
      <section className="hero" ref={ref}>
        <div className={'hero-l' + (inView ? ' in' : '')}>
          {profile.available && <div className="pill mono"><i />Available for freelance</div>}
          <div className="tag mono">// Developer · Security · Editor</div>
          <h1 className="hero-name" data-text={profile.short}>{profile.short}<span>.</span></h1>
          <p className="hero-line">I build <RotatingWord /><br />that actually ship.</p>
          <p className="lede">Frontend and mobile developer in Lagos. Web, mobile, Web3 and AI automation, built with a security first mindset and an editor’s eye for motion.</p>
          <div className="ctas">
            <Link className="btn fill" to="/projects">View my work <Icon name="arrow" size={16} /></Link>
            <a className="btn ghost" href={profile.cv} download>Download CV <Icon name="download" size={16} /></a>
          </div>
          <div className="stats">
            {stats.map((s) => <Stat key={s.label} s={s} run={inView} />)}
          </div>
        </div>

        <div className={'orbit' + (inView ? ' in' : '')}>
          <div className="orbit-glow" />
          <div className="ring" /><div className="ring r2" /><div className="ring r3" />
          <Terminal />
          <div className="chip a mono">REACT NATIVE</div>
          <div className="chip b mono">CVPT CERTIFIED</div>
          <div className="chip c mono">n8n AUTOMATION</div>
        </div>

        <a href="#about" className="scroll-cue mono" aria-label="Scroll down">SCROLL<i /></a>
      </section>

      <div className="marq" aria-hidden="true">
        <div className="marq-track">
          {[...marquee, ...marquee].map((w, i) => <span key={i}><b>{w}</b><em>✦</em></span>)}
        </div>
      </div>
    </>
  );
}
