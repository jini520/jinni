import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import type { PortfolioData, ProjectDetail } from '@jinni/types';
import { fetchPortfolioData, fetchProjectDetail } from './data';
import { Theme, ThemeProvider, useTheme } from '@jinni/ui';
import { PortfolioPage, ProjectModal } from '@jinni/common';

// ── 모달 라우트 ────────────────────────────────────────────────────────────
function ProjectModalRoute() {
  const { dark } = useTheme();
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
  const navigate = useNavigate();

  useEffect(() => {
    // 새로고침 전 스크롤 위치 저장
    // iOS Safari는 beforeunload 미발화 → pagehide 사용
    const saveScroll = () => sessionStorage.setItem('scrollY', String(window.scrollY));
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const saveEvent = isSafari ? 'pagehide' : 'beforeunload';
    window.addEventListener(saveEvent, saveScroll);

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

    return () => window.removeEventListener(saveEvent, saveScroll);
  }, []);

  return (
    <ThemeProvider>
      <Theme>
        {!data && <div className="portfolio-loading" />}
        {data && (
          <PortfolioPage
            data={data}
            onProjectClick={(id, accent, idx) =>
              navigate(`/projects/${id}`, { state: { accent, idx } })
            }
            renderLink={(href, children) => <a href={href}>{children}</a>}
          />
        )}
      </Theme>
      <Routes>
        <Route path="/projects/:id" element={<ProjectModalRoute />} />
        <Route path="*" element={null} />
      </Routes>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
