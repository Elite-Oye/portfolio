import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { profile, themes, waLink, socials } from '../data';
import { useTheme } from '../lib/hooks';
import Icon from './Icon';

const links = [
  { to: '/#about', label: 'About' },
  { to: '/#skills', label: 'Skills' },
  { to: '/#services', label: 'Services' },
  { to: '/projects', label: 'Projects' },
  { to: '/#contact', label: 'Contact' },
];

export function ThemePicker({ inline = false }) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const box = useRef(null);
  const cur = themes.find((t) => t.id === theme) || themes[0];

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false); };
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', esc); };
  }, [open]);

  if (inline) {
    return (
      <div className="theme-inline">
        {themes.map((t) => (
          <button key={t.id} className={'sw' + (t.id === theme ? ' on' : '')} onClick={() => setTheme(t.id)} aria-label={`${t.name} theme`}>
            <i style={{ background: t.sw, boxShadow: `inset 0 0 0 3px ${t.bg}` }} />
            <span className="mono">{t.name}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="theme" ref={box}>
      <button className="icon-btn" onClick={() => setOpen((o) => !o)} aria-label="Change theme" aria-expanded={open}>
        <Icon name="palette" size={20} />
        <i className="theme-dot" style={{ background: cur.sw }} />
      </button>
      <div className={'theme-pop' + (open ? ' open' : '')} role="menu">
        <div className="mono theme-title">// THEME</div>
        {themes.map((t) => (
          <button key={t.id} role="menuitemradio" aria-checked={t.id === theme}
            className={'theme-opt' + (t.id === theme ? ' on' : '')}
            onClick={() => { setTheme(t.id); setOpen(false); }}>
            <i style={{ background: t.sw, boxShadow: `inset 0 0 0 3px ${t.bg}` }} />
            <span>{t.name}</span>
            {t.id === theme && <Icon name="check" size={14} />}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 30);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => { setMenu(false); }, [loc.pathname, loc.hash]);
  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menu]);

  return (
    <>
      <header className={'nav' + (scrolled ? ' scrolled' : '')}>
        <Link to="/" className="logo" aria-label="Home">{profile.brand}<i /></Link>
        <nav className="nav-links mono" aria-label="Main">
          {links.map((l) => <Link key={l.to} to={l.to}>{l.label}</Link>)}
        </nav>
        <div className="nav-right">
          <ThemePicker />
          <a className="btn fill sm hide-m" href={waLink()} target="_blank" rel="noreferrer">Hire Oye</a>
          <button className="icon-btn show-m" onClick={() => setMenu(true)} aria-label="Open menu"><Icon name="menu" size={22} /></button>
        </div>
      </header>

      <div className={'mmenu' + (menu ? ' open' : '')} aria-hidden={!menu}>
        <div className="mmenu-top">
          <span className="logo">{profile.brand}<i /></span>
          <button className="icon-btn" onClick={() => setMenu(false)} aria-label="Close menu"><Icon name="close" size={22} /></button>
        </div>
        <nav className="mmenu-links">
          {[{ to: '/', label: 'Home' }, ...links].map((l, i) => (
            <Link key={l.to} to={l.to} style={{ transitionDelay: menu ? `${80 + i * 50}ms` : '0ms' }}>
              <span>{l.label}</span><small className="mono">{String(i + 1).padStart(2, '0')}</small>
            </Link>
          ))}
        </nav>
        <div className="mmenu-foot">
          <div className="mono kicker-sm">// THEME</div>
          <ThemePicker inline />
          <div className="mmenu-soc">
            {socials.map((s) => <a key={s.label} href={s.url} target="_blank" rel="noreferrer" aria-label={s.label}><Icon name={s.icon} size={20} /></a>)}
            <a href={`mailto:${profile.email}`} aria-label="Email"><Icon name="mail" size={20} /></a>
          </div>
        </div>
      </div>
    </>
  );
}
