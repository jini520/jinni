import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { skillsApi, categoriesApi } from "../api/skills";
import { projectsApi } from "../api/projects";
import { careersApi } from "../api/careers";
import { certificationsApi } from "../api/certifications";
import { educationsApi } from "../api/educations";
import { resumesApi } from "../api/resumes";
import { portfoliosApi } from "../api/portfolios";
import styles from "./home.module.scss";

const Svg = ({ children }: { children: ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const ICONS: Record<string, ReactNode> = {
  skills: (
    <Svg>
      <path d="M8 6l-5 6 5 6" />
      <path d="M16 6l5 6-5 6" />
    </Svg>
  ),
  projects: (
    <Svg>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </Svg>
  ),
  careers: (
    <Svg>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <path d="M2 12h20" />
    </Svg>
  ),
  certifications: (
    <Svg>
      <circle cx="12" cy="8" r="6" />
      <path d="M8.5 13.5L7 22l5-3 5 3-1.5-8.5" />
    </Svg>
  ),
  educations: (
    <Svg>
      <path d="M22 10L12 5 2 10l10 5 10-5z" />
      <path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" />
    </Svg>
  ),
  resumes: (
    <Svg>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8M8 17h8M8 9h2" />
    </Svg>
  ),
  portfolios: (
    <Svg>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
    </Svg>
  ),
};

const Arrow = () => (
  <Svg>
    <path d="M7 17L17 7M8 7h9v9" />
  </Svg>
);

interface CardData {
  key: string;
  to: string;
  label: string;
  accent: string;
  count: number | null;
  sub: string;
}

const Home = () => {
  const [cards, setCards] = useState<CardData[]>([
    { key: "skills", to: "/skills", label: "Skills", accent: "var(--color-blue)", count: null, sub: "기술 스택 관리" },
    { key: "projects", to: "/projects", label: "Projects", accent: "var(--color-purple)", count: null, sub: "프로젝트 관리" },
    { key: "careers", to: "/careers", label: "Careers", accent: "var(--color-green)", count: null, sub: "경력 정보 관리" },
    { key: "certifications", to: "/certifications", label: "Certifications", accent: "var(--color-orange)", count: null, sub: "자격증 · 수상 관리" },
    { key: "educations", to: "/educations", label: "Educations", accent: "var(--color-teal)", count: null, sub: "교육 이력 관리" },
    { key: "resumes", to: "/resumes", label: "Resumes", accent: "var(--color-pink)", count: null, sub: "이력서 파일 관리" },
    { key: "portfolios", to: "/portfolios", label: "Portfolios", accent: "var(--color-indigo)", count: null, sub: "포트폴리오 파일 관리" },
  ]);

  useEffect(() => {
    let alive = true;

    const patch = (key: string, count: number, sub?: string) => {
      if (!alive) return;
      setCards((prev) =>
        prev.map((c) =>
          c.key === key ? { ...c, count, ...(sub ? { sub } : {}) } : c
        )
      );
    };

    // 각 카드 독립 fetch — 일부 실패해도 나머지는 표시
    skillsApi.getAllSkills().then(async (res) => {
      const skillCount = res.data.data.skills?.length ?? 0;
      let catCount = 0;
      try {
        const cats = await categoriesApi.getCategories();
        catCount = cats.data.data?.length ?? 0;
      } catch { /* ignore */ }
      patch("skills", skillCount, `${catCount}개 카테고리`);
    }).catch(() => {});

    projectsApi.getProjectList(0)
      .then((res) => patch("projects", res.data.data.totalElements))
      .catch(() => {});

    careersApi.getAllCareers().then((res) => {
      const b = res.data.data.businesses?.length ?? 0;
      const p = res.data.data.projects?.length ?? 0;
      patch("careers", b + p, `업무 ${b} · 프로젝트 ${p}`);
    }).catch(() => {});

    certificationsApi.getAllCertifications().then((res) => {
      const c = res.data.data.certifications?.length ?? 0;
      const a = res.data.data.awards?.length ?? 0;
      patch("certifications", c + a, `자격증 ${c} · 수상 ${a}`);
    }).catch(() => {});

    educationsApi.getAllEducations()
      .then((res) => patch("educations", res.data.data?.length ?? 0))
      .catch(() => {});

    resumesApi.getResumeList(0)
      .then((res) => patch("resumes", res.data.data.totalElements))
      .catch(() => {});

    portfoliosApi.getPortfolioList(0)
      .then((res) => patch("portfolios", res.data.data.totalElements))
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <p className={styles.subtitle}>한눈에 보는 콘텐츠 현황</p>
      </header>

      <div className={styles.grid}>
        {cards.map((card) => (
          <Link
            key={card.key}
            to={card.to}
            className={styles.card}
            style={{ ["--accent" as string]: card.accent }}
          >
            <div className={styles.top}>
              <span className={styles.iconBox}>{ICONS[card.key]}</span>
              <span className={styles.count}>
                {card.count === null ? "—" : card.count}
              </span>
            </div>
            <span className={styles.label}>{card.label}</span>
            <div className={styles.sub}>
              <span>{card.sub}</span>
              <span className={styles.arrow}>
                <Arrow />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <footer className={styles.footer}>
        <p>jinni Admin Panel</p>
      </footer>
    </div>
  );
};

export default Home;
