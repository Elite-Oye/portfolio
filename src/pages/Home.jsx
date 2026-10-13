import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import { About, Experience, Skills, SoftSkills, Certs, Services } from '../components/Sections';
import { ProjectCard, ProjectModal } from '../components/Projects';
import Contact from '../components/Contact';
import Reveal, { SectionHead } from '../components/Reveal';
import Icon from '../components/Icon';
import { projects } from '../data';

export default function Home() {
  const loc = useLocation();
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);
  const featured = projects.filter((p) => p.featured);

  useEffect(() => {
    if (!loc.hash) return;
    const t = setTimeout(() => {
      const el = document.getElementById(loc.hash.slice(1));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 80);
    return () => clearTimeout(t);
  }, [loc]);

  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Skills />
      <SoftSkills />
      <Certs />
      <Services />

      <section className="s" id="work">
        <SectionHead index="07" kicker="Selected work" title="Featured" accent="Builds" text="Live products, client work and private builds. Tap a card for the full breakdown." />
        <div className="proj">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={(i % 2) * 80}><ProjectCard p={p} index={i} onOpen={setOpen} /></Reveal>
          ))}
        </div>
        <Reveal className="all-cta">
          <Link className="btn fill" to="/projects">View all {projects.length} projects <Icon name="arrow" size={16} /></Link>
        </Reveal>
      </section>

      <Contact />
      <ProjectModal p={open} onClose={close} />
    </>
  );
}
