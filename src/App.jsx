import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeCtx } from './lib/hooks';
import { themes } from './data';
import Background from './components/Background';
import Loader from './components/Loader';
import Nav from './components/Nav';
import Footer, { WhatsAppFab } from './components/Footer';
import Home from './pages/Home';
import ProjectsPage from './pages/ProjectsPage';
import NotFound from './pages/NotFound';

const readTheme = () => {
  try {
    const t = localStorage.getItem('oye-theme');
    return themes.some((x) => x.id === t) ? t : 'acid';
  } catch { return 'acid'; }
};

export default function App() {
  const [theme, setTheme] = useState(readTheme);
  const loc = useLocation();

  // Layout effect so the theme is on <html> before Background reads its colors.
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('oye-theme', theme); } catch { /* ignore */ }
    const meta = document.querySelector('meta[name="theme-color"]');
    const t = themes.find((x) => x.id === theme);
    if (meta && t) meta.setAttribute('content', t.bg);
  }, [theme]);

  useEffect(() => {
    if (!loc.hash) window.scrollTo(0, 0);
  }, [loc.pathname, loc.hash]);

  const ctx = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeCtx.Provider value={ctx}>
      <Loader />
      <Background theme={theme} />
      <Nav />
      <main className="page" key={loc.pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppFab />
    </ThemeCtx.Provider>
  );
}
