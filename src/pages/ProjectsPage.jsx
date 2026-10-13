import { useCallback, useMemo, useState } from 'react';
import { categories, projects, statusLabel } from '../data';
import { ProjectCard, ProjectModal } from '../components/Projects';
import Reveal from '../components/Reveal';

const statuses = ['any', 'live', 'private'];
export default function ProjectsPage() {
  const [cat, setCat] = useState('all');
  const [st, setSt] = useState('any');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);

  const count = (id) => (id === 'all' ? projects.length : projects.filter((p) => p.cats.includes(id)).length);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return projects.filter((p) =>
      (cat === 'all' || p.cats.includes(cat)) &&
      (st === 'any' || p.status === st) &&
      (!s || [p.title, p.kind, p.summary, ...p.stack].join(' ').toLowerCase().includes(s))
    );
  }, [cat, st, q]);

  return (
    <section className="s archive">
      <Reveal className="archive-head">
        <div className="kicker mono"><span>//</span>All projects</div>
        <h1>The <em>Archive</em></h1>
        <p>Everything I’ve built: live products, client sites, private tools and experiments. Private ones are under NDA or internal, so I can walk you through them on a call.</p>
      </Reveal>

      <div className="filters">
        <div className="tabs" role="tablist" aria-label="Category">
          {categories.map((c) => (
            <button key={c.id} className={'tab mono' + (cat === c.id ? ' on' : '')} onClick={() => setCat(c.id)} aria-selected={cat === c.id} role="tab">
              {c.label}<sup>{count(c.id)}</sup>
            </button>
          ))}
        </div>
        <div className="filter-row">
          <div className="seg mono" role="radiogroup" aria-label="Status">
            {statuses.map((s) => (
              <button key={s} role="radio" aria-checked={st === s} className={st === s ? 'on' : ''} onClick={() => setSt(s)}>
                {s === 'any' ? 'Any status' : statusLabel[s]}
              </button>
            ))}
          </div>
          <input className="search mono" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search stack or name..." aria-label="Search projects" />
        </div>
      </div>

      <div className="mono result-n">{list.length} result{list.length === 1 ? '' : 's'}</div>
      {list.length ? (
        <div className="proj proj-3">
          {list.map((p, i) => (
            <div className="pop" key={p.id} style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
              <ProjectCard p={p} index={projects.indexOf(p)} onOpen={setOpen} />
            </div>
          ))}
        </div>
      ) : (
        <div className="empty mono">No projects match that filter. <button onClick={() => { setCat('all'); setSt('any'); setQ(''); }}>Reset</button></div>
      )}
      <ProjectModal p={open} onClose={close} />
    </section>
  );
}
