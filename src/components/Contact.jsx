import { useState } from 'react';
import { profile, socials, waLink } from '../data';
import Reveal, { SectionHead } from './Reveal';
import Icon from './Icon';

const types = ['Website', 'Web App', 'Mobile App', 'Web3 / DApp', 'AI Automation', 'Security Review', 'Video Edit', 'Virtual Assistance', 'Something else'];

export default function Contact() {
  const [f, setF] = useState({ name: '', type: types[0], msg: '' });
  const [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const brief = () =>
    `Hi Oye, I'm ${f.name.trim()}.\nProject: ${f.type}\n\n${f.msg.trim()}`;

  const send = (via) => (e) => {
    e.preventDefault();
    if (!f.name.trim() || !f.msg.trim()) { setErr('Add your name and a short message first.'); return; }
    setErr('');
    if (via === 'wa') window.open(waLink(brief()), '_blank', 'noopener');
    else window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(`${f.type} project from ${f.name.trim()}`)}&body=${encodeURIComponent(brief())}`;
  };

  return (
    <section className="s" id="contact">
      <SectionHead index="08" kicker="Contact" title="Got an idea?" accent="Let’s build." />
      <div className="contact">
        <Reveal className="contact-l">
          <p className="contact-lead">Tell me what you are building. I reply fast, usually the same day.</p>
          <a className="cline" href={waLink()} target="_blank" rel="noreferrer"><Icon name="whatsapp" size={20} /><div><span className="mono">WhatsApp</span><b>{profile.phone}</b></div></a>
          <a className="cline" href={`tel:${profile.phoneRaw}`}><Icon name="phone" size={20} /><div><span className="mono">Phone</span><b>{profile.phone}</b></div></a>
          <a className="cline" href={`mailto:${profile.email}`}><Icon name="mail" size={20} /><div><span className="mono">Email</span><b>{profile.email}</b></div></a>
          <div className="cline static"><Icon name="pin" size={20} /><div><span className="mono">Location</span><b>{profile.location} · Remote worldwide</b></div></div>
          <div className="soc">
            {socials.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noreferrer" aria-label={s.label}>
                <Icon name={s.icon} size={18} /><span className="mono">{s.handle}</span>
              </a>
            ))}
          </div>
          <a className="btn ghost" href={profile.cv} download>Download my CV <Icon name="download" size={16} /></a>
        </Reveal>

        <Reveal as="form" delay={100} className="form" onSubmit={send('wa')} noValidate>
          <div className="mono kicker-sm">// project brief</div>
          <label><span className="mono">Your name</span>
            <input value={f.name} onChange={set('name')} placeholder="Jane Doe" autoComplete="name" />
          </label>
          <label><span className="mono">What do you need?</span>
            <select value={f.type} onChange={set('type')}>{types.map((t) => <option key={t}>{t}</option>)}</select>
          </label>
          <label><span className="mono">Tell me about it</span>
            <textarea rows="5" value={f.msg} onChange={set('msg')} placeholder="Goals, timeline, budget, links..." />
          </label>
          {err && <div className="form-err mono">{err}</div>}
          <div className="form-btns">
            <button className="btn fill" type="submit"><Icon name="whatsapp" size={16} /> Send on WhatsApp</button>
            <button className="btn ghost" type="button" onClick={send('mail')}><Icon name="mail" size={16} /> Email instead</button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
