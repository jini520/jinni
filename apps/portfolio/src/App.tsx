import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import type { PortfolioData, ProjectDetail } from '@jejinni/types';
import { fetchPortfolioData, fetchProjectDetail } from './data';
import { AuroraVariant, ProjectModal, ScrollProgress } from '@jejinni/ui';

const PROGRESS_ACCENT = 'linear-gradient(90deg, oklch(78% 0.16 320), oklch(82% 0.14 200), oklch(82% 0.13 38))';

// ── 모달 라우트 ────────────────────────────────────────────────────────────
interface ModalRouteProps { dark: boolean }

function ProjectModalRoute({ dark }: ModalRouteProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useLocation() as { state: { accent?: string; idx?: string } | null };

  const [project, setProject] = useState<ProjectDetail | null>(null);

  useEffect(() => {
    if (!id) return;
    setProject(null);
    fetchProjectDetail(id).then((p) => { if (p) setProject(p); });
  }, [id]);

  if (!project) return null;

  return (
    <ProjectModal
      project={project}
      accent={state?.accent ?? '#ff3d9a'}
      dark={dark}
      idx={state?.idx ?? '01'}
      onClose={() => navigate(-1)}
    />
  );
}

// ── 메인 앱 ───────────────────────────────────────────────────────────────
function AppContent() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [dark, setDark] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 새로고침 전 스크롤 위치 저장
    const saveScroll = () => sessionStorage.setItem('scrollY', String(window.scrollY));
    window.addEventListener('beforeunload', saveScroll);

    const [dataPromise, timerPromise] = [
      fetchPortfolioData(),
      new Promise<void>((resolve) => setTimeout(resolve, 1000)),
    ];
    Promise.all([dataPromise, timerPromise]).then(([d]) => {
      setData(d);
      // 데이터 로드 완료 후 저장된 스크롤 위치 복원
      const saved = sessionStorage.getItem('scrollY');
      if (saved) {
        requestAnimationFrame(() => window.scrollTo(0, parseInt(saved)));
        sessionStorage.removeItem('scrollY');
      }
    });
    try {
      if (localStorage.getItem('aurora-theme') === 'light') setDark(false);
    } catch {}

    return () => window.removeEventListener('beforeunload', saveScroll);
  }, []);

  useEffect(() => {
    try { localStorage.setItem('aurora-theme', dark ? 'dark' : 'light'); } catch {}
  }, [dark]);

  return (
    <>
      <ScrollProgress accent={PROGRESS_ACCENT} />
      {!data && <div className="portfolio-loading" />}
      {data && (
        <AuroraVariant
          data={data}
          dark={dark}
          onToggleTheme={() => setDark((d) => !d)}
          onProjectClick={(id, accent, idx) =>
            navigate(`/projects/${id}`, { state: { accent, idx } })
          }
        />
      )}
      <Routes>
        <Route path="/projects/:id" element={<ProjectModalRoute dark={dark} />} />
        <Route path="*" element={null} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
