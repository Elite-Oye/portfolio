import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="s nf">
      <div className="mono kicker-sm">// error</div>
      <h1>404<span>.</span></h1>
      <p className="mono">$ cd {typeof window !== 'undefined' ? window.location.pathname : ''}<br />bash: no such page</p>
      <Link className="btn fill" to="/">Back home</Link>
    </section>
  );
}
