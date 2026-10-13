import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { statusLabel, waLink } from '../data';
import Icon from './Icon';

const spotlight = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
};

export function StatusBadge({ status }) {
  return (
    <span className={'status mono status-' + status}>
      {status === 'private' ? <Icon name="lock" size={12} /> : <i />}
      {statusLabel[status]}
    </span>
  );
}

export function ProjectCard({ p, index, onOpen }) {
  return (
    <article className="card" onPointerMove={spotlight}>
      <button className="card-hit" onClick={() => onOpen(p)} aria-label={`Open ${p.title} details`} />
      <div className="card-top">
        <span className="num">{String(index + 1).padStart(2, '0')}</span>
        <StatusBadge status={p.status} />
      </div>
      <div className="kind mono">{p.kind}</div>
      <h3>{p.title}</h3>
      <p>{p.summary}</p>
      <div className="stack">{p.stack.slice(0, 4).map((s) => <span key={s} className="mono">{s}</span>)}</div>
      <div className="card-foot mono">
        <span>Details <Icon name="arrow" size={14} /></span>
        {p.url && <a href={p.url} target="_blank" rel="noreferrer" className="card-live">Visit <Icon name="up" size={14} /></a>}
      </div>
    </article>
  );
}

export function ProjectModal({ p, onClose }) {
  useEffect(() => {
    if (!p) return;
    const esc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', esc); document.body.style.overflow = ''; };
  }, [p, onClose]);

  if (!p) return null;
  return createPortal(
    <div className="modal" role="dialog" aria-modal="true" aria-label={p.title} onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn modal-x" onClick={onClose} aria-label="Close"><Icon name="close" size={20} /></button>
        <div className="modal-head">
          <div className="kind mono">{p.kind} · {p.year}</div>
          <h3>{p.title}</h3>
          <StatusBadge status={p.status} />
        </div>
        <p className="modal-sum">{p.summary}</p>
        <div className="modal-grid">
          <div>
            <div className="mono kicker-sm">// what I built</div>
            <ul className="ticks">{p.details.map((d) => <li key={d}>{d}</li>)}</ul>
          </div>
          <div>
            <div className="mono kicker-sm">// role</div>
            <p className="modal-role">{p.role}</p>
            <div className="mono kicker-sm">// stack</div>
            <div className="stack">{p.stack.map((s) => <span key={s} className="mono">{s}</span>)}</div>
          </div>
        </div>
        <div className="modal-cta">
          {p.url ? (
            <a className="btn fill sm" href={p.url} target="_blank" rel="noreferrer">Visit live site <Icon name="up" size={14} /></a>
          ) : (
            <span className="mono modal-note">
              <Icon name="lock" size={14} />
              {p.status === 'private' ? 'Not publicly deployed. Code and walkthrough available on request.' : 'Link available on request.'}
            </span>
          )}
          <a className="btn ghost sm" href={waLink(`Hi Oye, I saw ${p.title} on your portfolio and I'd like to know more.`)} target="_blank" rel="noreferrer">Ask about this</a>
        </div>
      </div>
    </div>,
    document.body
  );
}
