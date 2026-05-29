import './aurora.scss';

import { LINKS, PROFILE } from '../../data/profile';
import { getSkillIcon } from './SkillIcons';

import type { PortfolioData } from '@jejinni/types';
import { useMouse } from '../../hooks/useMouse';
import { useReveal } from '../../hooks/useReveal';

const CARD_ACCENTS = ['#ff3d9a', '#9b5cff', '#3dd0ff', '#ffb84d'];

const TECH_GROUPS_KO: Record<string, string> = {
  언어: '언어',
  프론트엔드: '프론트엔드',
  라이브러리: '라이브러리',
  빌드: '빌드',
  도구: '도구',
};

const QA_BLOCKS = [
  {
    q: (<>어떤 <span className="hl">개발자</span>인가요?</>),
    a: (<>사용자 경험을 코드로 설계하는 <span className="hl">프론트엔드 개발자</span>입니다. React와 TypeScript를 주력으로 웹 · 모바일 영역 모두에서 일해왔고, 디자이너의 의도를 한 픽셀까지 살리는 것에 집착합니다.</>),
    tags: ['React · TypeScript', 'Web · Mobile', '5+ years'],
  },
  {
    q: (<><span className="hl">무엇</span>을 즐기나요?</>),
    a: (<><span className="hl">디자인 시스템</span>을 처음부터 구축하고, 컴포넌트 API를 다듬는 일을 가장 좋아합니다. 마이크로 인터랙션이 제품의 신뢰감을 만든다고 믿고, 그 디테일을 챙기는 일에서 보람을 느낍니다.</>),
    tags: ['Design Systems', 'Micro-interaction', 'Performance'],
  },
  {
    q: (<><span className="hl">어떻게</span> 일하나요?</>),
    a: (<>디자이너와 <span className="hl">가깝게 일하는 것</span>을 선호합니다. Figma 핸드오프 단계에서 인터랙션을 함께 리뷰하고, 컴포넌트 단계부터 의도를 맞추는 협업이 결과적으로 더 빠르고 정확한 제품을 만든다고 믿습니다.</>),
    tags: ['Designer-friendly', 'Component-first', 'Remote OK'],
  },
];

interface Props {
  data: PortfolioData;
  dark: boolean;
  onToggleTheme: () => void;
  /** 카드 클릭 시 호출 — 라우팅 처리는 호출부에서 담당 */
  onProjectClick?: (id: string, accent: string, idx: string) => void;
}

export function AuroraVariant({ data, dark, onToggleTheme, onProjectClick }: Props) {
  useReveal();
  const m = useMouse();

  const { skills, careers, projects, posts } = data;

  const sortedCategories = [...skills.categories].sort((a, b) => a.order - b.order);

  const careerList = careers.businesses.map((b, i) => ({
    year: `${b.startDate} — ${b.endDate}`,
    company: b.company,
    role: b.position,
    note: b.details?.[0] ?? b.department,
    isCurrent: i === 0,
  }));

  return (
    <div className="aurora" data-theme={dark ? 'dark' : 'light'} data-density="regular">
      {/* Background */}
      <div className="aurora-bg">
        <div className="aurora-blob b1" />
        <div className="aurora-blob b2" />
      </div>
      <div className="aurora-grid" />
      <div className="aurora-noise" />
      <div
        className="aurora-cursor"
        style={{ left: `${m.x * 100}%`, top: `${m.y * 100}%` }}
      />

      {/* NAV */}
      <div className="aurora-nav-wrap">
        <nav className="aurora-nav">
          <div className="aurora-nav-brand">
            <span className="dot" />
            <span>{PROFILE.nameKo}</span>
            <span className="en">{PROFILE.site}</span>
          </div>
          <div className="aurora-nav-links">
            <a href="#about">About</a>
            <a href="#stack">Stack</a>
            <a href="#work">Work</a>
            <a href="#career">Career</a>
            <a href="#writing">Writing</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="aurora-nav-actions">
            <button
              className="aurora-nav-theme"
              onClick={onToggleTheme}
              aria-label={dark ? '라이트 모드로 전환' : '다크 모드로 전환'}
            >
              {dark ? '☾' : '☀'}
            </button>
            <button className="aurora-nav-cta">↓ Resume</button>
          </div>
        </nav>
      </div>

      <main className="aurora-main">
        {/* HERO */}
        <section className="aurora-hero">
          <div>
            <div className="aurora-eyebrow" data-reveal>
              <span className="pulse" />
              Available · 2026
            </div>
            <h1 className="aurora-h1">
              <span className="ln1" data-reveal data-delay="1">안녕하세요,</span>
              <span className="ln2" data-reveal data-delay="2">프론트엔드 개발자</span>
              <span className="ln3" data-reveal data-delay="3">
                <span className="name">{PROFILE.nameKo}</span>입니다.
              </span>
              <span className="en" data-reveal data-delay="4">
                {PROFILE.nameEn},
              </span>
            </h1>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="aurora-section">
          <div className="aurora-shead">
            <div data-reveal>
              <div className="aurora-shead-tag">/ 01 · About</div>
              <div className="aurora-shead-title">코드로 그리는 <em>인터페이스</em></div>
            </div>
            <p className="aurora-shead-sub" data-reveal data-delay="1">
              디자인 시스템과 성능, 사용자 경험 사이의 균형 — 그 사이에서 길을 만듭니다.
            </p>
          </div>

          <div className="about-qa">
            {QA_BLOCKS.map((b, i) => (
              <div key={i} className="qa-block" data-reveal data-delay={Math.min(i + 1, 4) as 1 | 2 | 3 | 4}>
                <span className="qa-num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="qa-question">{b.q}</h3>
                <div className="qa-answer-wrap">
                  <p className="qa-answer">{b.a}</p>
                  <div className="qa-tags">
                    {b.tags.map((t) => <span key={t} className="qa-tag">{t}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TECH */}
        <section id="stack" className="aurora-section">
          <div className="aurora-shead">
            <div data-reveal>
              <div className="aurora-shead-tag">/ 02 · Stack</div>
              <div className="aurora-shead-title">기술 스택</div>
            </div>
            <p className="aurora-shead-sub" data-reveal data-delay="1">
              실무에서 일상적으로 사용하는 도구들.
            </p>
          </div>

          <div className="aurora-tech">
            {sortedCategories.map((cat, gi) => {
              const catSkills = skills.skills
                .filter((s) => s.categoryId === cat.id)
                .sort((a, b) => a.order - b.order);

              return (
                <div
                  key={cat.id}
                  className="tech-row"
                  data-reveal
                  data-delay={Math.min(gi + 1, 4) as 1 | 2 | 3 | 4}
                >
                  <div className="tech-row-label">
                    <span className="ko">{TECH_GROUPS_KO[cat.name] ?? cat.name}</span>
                    <span className="en">— {cat.name}</span>
                  </div>
                  <div className="tech-chips">
                    {catSkills.map((skill, si) => {
                      const hue = (si * 37 + gi * 73) % 360;
                      return (
                        <span
                          key={skill.id}
                          className="tech-chip"
                          style={{ ['--chip-accent' as string]: `oklch(72% 0.16 ${hue})` }}
                        >
                          <span className="sq">
                            {(() => {
                              const Icon = getSkillIcon(skill.name);
                              return Icon
                                ? <Icon width={16} height={16} />
                                : skill.name.slice(0, 2).toUpperCase();
                            })()}
                          </span>
                          {skill.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* PROJECTS */}
        <section id="work" className="aurora-section">
          <div className="aurora-shead">
            <div data-reveal>
              <div className="aurora-shead-tag">/ 03 · Selected Work</div>
              <div className="aurora-shead-title"><em>프로젝트</em></div>
            </div>
            <p className="aurora-shead-sub" data-reveal data-delay="1">
              임팩트 중심으로 선별한 작업물.
            </p>
          </div>

          <div className="aurora-projects">
            {projects.map((p, i) => {
              const accent = CARD_ACCENTS[i % CARD_ACCENTS.length];
              const idx = String(i + 1).padStart(2, '0');
              const MAX = 3;
              const showAll = p.skills.length <= MAX + 1;
              return (
                <article
                  key={p.id}
                  className={`project-card${onProjectClick ? ' project-card--clickable' : ''}`}
                  data-reveal
                  data-delay={Math.min(i + 1, 4) as 1 | 2 | 3 | 4}
                  style={{ ['--c' as string]: accent }}
                  onClick={() => onProjectClick?.(p.id, accent, idx)}
                >
                  <div>
                    <div className="num">{idx}</div>
                    <h3 className="title">{p.title}</h3>
                    <p className="desc">{p.description}</p>
                  </div>
                  <div className="foot">
                    <div className="stack">
                      {showAll
                        ? p.skills.map((s) => <span key={s}>{s}</span>)
                        : (
                          <>
                            {p.skills.slice(0, MAX).map((s) => <span key={s}>{s}</span>)}
                            <span className="more" title={p.skills.slice(MAX).join(', ')}>
                              +{p.skills.length - MAX}
                            </span>
                          </>
                        )
                      }
                    </div>
                    {onProjectClick && <span className="proj-card-arrow">→</span>}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* CAREER */}
        <section id="career" className="aurora-section">
          <div className="aurora-shead">
            <div data-reveal>
              <div className="aurora-shead-tag">/ 04 · Timeline</div>
              <div className="aurora-shead-title">커리어</div>
            </div>
          </div>

          <div className="aurora-career">
            {careerList.map((c, i) => (
              <div key={i} className="career-item" data-reveal data-delay={Math.min(i + 1, 4) as 1 | 2 | 3 | 4}>
                <div className="career-year">{c.year}</div>
                <div className="career-body">
                  <div className="company">{c.company}</div>
                  <div className="role">{c.role}</div>
                  <div className="note">{c.note}</div>
                </div>
                <div className={`career-badge ${c.isCurrent ? 'current' : ''}`}>
                  {c.isCurrent ? 'Now' : 'Past'}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WRITING */}
        {posts.length > 0 && (
          <section id="writing" className="aurora-section">
            <div className="aurora-shead">
              <div data-reveal>
                <div className="aurora-shead-tag">/ 05 · Writing</div>
                <div className="aurora-shead-title">최근 <em>글</em></div>
              </div>
            </div>

            <div className="aurora-posts">
              {posts.map((p, i) => (
                <a
                  key={i}
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="post-row"
                  data-reveal
                  data-delay={Math.min(i + 1, 4) as 1 | 2 | 3 | 4}
                >
                  <span className="date">{p.pubDate}</span>
                  <span className="ptitle">{p.title}</span>
                  <span className="ptag">Velog</span>
                  <span className="pread">읽기 →</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* CONTACT */}
        <section id="contact" className="aurora-section">
          <div className="aurora-contact" data-reveal>
            <div className="aurora-contact-inner">
              <div>
                <h2>같이 <span className="em">만들어볼까요</span>?</h2>
                <p>
                  새로운 프로젝트, 협업, 또는 그냥 인사 — 무엇이든 환영합니다.
                  보통 24시간 안에 답변드립니다.
                </p>
              </div>
              <div className="contact-links">
                {LINKS.map((l) => (
                  <a key={l.label} href={l.href} className="contact-link" target="_blank" rel="noopener noreferrer">
                    <span className="lbl">{l.label}</span>
                    <span className="hdl">{l.handle}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer className="aurora-foot">
          <span>© 2026 {PROFILE.nameKo} · {PROFILE.site}</span>
          <span>Designed & coded with care.</span>
        </footer>
      </main>

    </div>
  );
}
