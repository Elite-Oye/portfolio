import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { profile, socials, waLink } from '../data';
import Icon from './Icon';

export function WhatsAppFab() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 500);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <>
      <a className={'fab' + (show ? ' show' : '')} href={waLink()} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
        <Icon name="whatsapp" size={26} />
      </a>
      <button className={'totop' + (show ? ' show' : '')} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
        <Icon name="arrow" size={18} />
      </button>
    </>
  );
}

export default function Footer() {
  return (
    <footer className="foot">
      <div className="foot-big" aria-hidden="true">{profile.short}<span>.</span></div>
      <div className="foot-row">
        <div className="mono">© {new Date().getFullYear()} {profile.name}</div>
        <nav className="mono foot-links">
          <Link to="/#about">About</Link><Link to="/#skills">Skills</Link><Link to="/projects">Projects</Link><Link to="/#contact">Contact</Link>
        </nav>
        <div className="foot-soc">
          {socials.map((s) => <a key={s.label} href={s.url} target="_blank" rel="noreferrer" aria-label={s.label}><Icon name={s.icon} size={18} /></a>)}
          <a href={waLink()} target="_blank" rel="noreferrer" aria-label="WhatsApp"><Icon name="whatsapp" size={18} /></a>
          <a href={`mailto:${profile.email}`} aria-label="Email"><Icon name="mail" size={18} /></a>
        </div>
      </div>
    </footer>
  );
}
