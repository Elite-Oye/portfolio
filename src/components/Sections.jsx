import { useState } from 'react';
import { about, experience, skillGroups, softSkills, certs, services, profile, waLink } from '../data';
import { useCountUp, useInView } from '../lib/hooks';
import Reveal, { SectionHead } from './Reveal';
import Icon from './Icon';

/* ───────────── ABOUT ───────────── */
export function About() {
  return (
    <section className="s" id="about">
      <SectionHead index="01" kicker="About" title="Who’s" accent="behind it" />
      <div className="about">
        <Reveal className="about-card">
          <div className="badge">
            <div className="badge-ring" />
            {profile.photo ? (
              <img className="badge-in badge-photo" src={profile.photo} alt={profile.name} loading="lazy" />
            ) : (
              <div className="badge-in">
                <span className="badge-init">OE</span>
                <span className="mono badge-sub">{profile.location}</span>
              </div>
            )}
          </div>
          <div className="facts">
            {about.facts.map(([k, v]) => (
              <div key={k}><span className="mono">{k}</span><b>{v}</b></div>
            ))}
          </div>
        </Reveal>
        <div className="about-txt">
          <Reveal as="p" className="about-lead">{about.lead}</Reveal>
          {about.body.map((p, i) => <Reveal as="p" key={i} delay={80 * (i + 1)}>{p}</Reveal>)}
          <Reveal delay={240} className="off">
            <span className="mono">// off the clock</span>
            <div>{about.offClock.map((o) => <em key={o}>{o}</em>)}</div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ───────────── EXPERIENCE ───────────── */
export function Experience() {
  return (
    <section className="s" id="experience">
      <SectionHead index="02" kicker="Experience" title="The" accent="Journey" text="Where I’ve been shipping, and what I’ve been responsible for." />
      <ol className="tl">
        {experience.map((e, i) => (
          <Reveal as="li" key={e.role} delay={i * 60} className="tl-item">
            <div className="tl-when mono">{e.when}</div>
            <div className="tl-dot" />
            <div className="tl-body">
              <h3>{e.role}</h3>
              <div className="tl-org mono">{e.org}</div>
              <ul>{e.points.map((p) => <li key={p}>{p}</li>)}</ul>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

/* ───────────── SKILLS ───────────── */
function Bar({ name, value, run, delay }) {
  const v = useCountUp(value, run, 1300);
  return (
    <div className={'sk' + (run ? ' in' : '')} style={{ transitionDelay: `${delay}ms` }}>
      <div className="sk-top"><b>{name}</b><span className="mono">{v}%</span></div>
      <div className="meter"><i style={{ width: run ? `${value}%` : 0, transitionDelay: `${delay}ms` }} /></div>
    </div>
  );
}

function Panel({ group }) {
  const [ref, inView] = useInView({ threshold: 0.1 });
  return (
    <div className="skills" ref={ref}>
      {group.items.map(([n, v], i) => <Bar key={n} name={n} value={v} run={inView} delay={i * 70} />)}
    </div>
  );
}

export function Skills() {
  const [tab, setTab] = useState(skillGroups[0].id);
  const group = skillGroups.find((g) => g.id === tab);
  const avg = Math.round(group.items.reduce((a, [, v]) => a + v, 0) / group.items.length);
  return (
    <section className="s" id="skills">
      <SectionHead index="03" kicker="Skills" title="The" accent="Loadout" text="Everything I reach for when building, breaking, automating, cutting and organising." />
      <Reveal className="tabs" role="tablist">
        {skillGroups.map((g) => (
          <button key={g.id} role="tab" aria-selected={g.id === tab} className={'tab mono' + (g.id === tab ? ' on' : '')} onClick={() => setTab(g.id)}>
            {g.label}
          </button>
        ))}
      </Reveal>
      <div className="skill-wrap">
        <div className="skill-meta">
          <div className="mono kicker-sm">// {group.label}</div>
          <div className="skill-avg">{avg}<span>%</span></div>
          <div className="mono skill-cnt">{group.items.length} skills · avg level</div>
        </div>
        <Panel key={tab} group={group} />
      </div>
    </section>
  );
}

/* ───────────── SOFT SKILLS ───────────── */
export function SoftSkills() {
  return (
    <section className="s" id="traits">
      <SectionHead index="04" kicker="Beyond the code" title="How I" accent="Operate" text="Tools change every year. These don’t." />
      <div className="traits">
        {softSkills.map((s, i) => (
          <Reveal key={s.title} delay={(i % 4) * 70} className="trait">
            <span className="trait-mark" aria-hidden="true">{s.mark}</span>
            <div className="mono trait-n">{String(i + 1).padStart(2, '0')}</div>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ───────────── CERTS ───────────── */
export function Certs() {
  return (
    <section className="s s-tight" id="certs">
      <SectionHead index="05" kicker="Credentials" title="Certs &" accent="Education" />
      <div className="certs">
        {certs.map((c, i) => (
          <Reveal key={c.code} delay={i * 80} className="cert">
            <div className="cert-code">{c.code}</div>
            <div className="cert-body">
              <h3>{c.title}</h3>
              <div className="mono cert-org">{c.org}</div>
            </div>
            <div className="cert-side mono"><span className={'st st-' + c.status.toLowerCase()}>{c.status}</span><b>{c.year}</b></div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ───────────── SERVICES ───────────── */
export function Services() {
  return (
    <section className="s" id="services">
      <SectionHead index="06" kicker="Services" title="What I" accent="Do" text="Pick one, or bundle a few. Tap any card to brief me on WhatsApp." />
      <div className="services">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={(i % 4) * 70} as="a" className="svc" href={waLink(`Hi Oye, I need help with ${s.title}.`)} target="_blank" rel="noreferrer">
            <div className="svc-top">
              <span className="mono svc-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="svc-go"><Icon name="up" size={18} /></span>
            </div>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
            <div className="stack">{s.tags.map((t) => <span key={t} className="mono">{t}</span>)}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
