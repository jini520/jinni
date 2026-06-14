'use client';

import { CARD_ACCENTS } from '../../data/content';
import type { Project } from '@jinni/types';
import styles from './projects.module.scss';

interface ProjectsSectionProps {
  projects: Project[];
  onProjectClick: (id: string, accent: string, idx: string) => void;
}

export function ProjectsSection({ projects, onProjectClick }: ProjectsSectionProps) {
  return (
    <section id="work" className={styles.section}>
      <div className={styles.shead}>
        <div data-reveal>
          <div className={styles.sheadTag}>/ 03 · Project</div>
          <h2 className={styles.sheadTitle}><em>프로젝트</em></h2>
        </div>
      </div>

      <div className={styles.projects}>
        {projects.map((p, i) => {
          const accent = CARD_ACCENTS[i % CARD_ACCENTS.length];
          const idx = String(i + 1).padStart(2, '0');
          const MAX = 5;
          const showAll = p.skills.length <= MAX + 1;
          // TODO: server API에 role 필드 추가되면 p.role로 교체
          const role = 'FRONTEND';
          const year = (p.startedAt ?? p.endedAt)?.slice(0, 4);
          return (
            <article
              key={p.id}
              className={`${styles.projectCard} ${styles.projectCardClickable}`}
              data-reveal
              data-delay={Math.min(i + 1, 4) as 1 | 2 | 3 | 4}
              style={{ ['--c' as string]: accent }}
              onClick={() => onProjectClick(p.id, accent, idx)}
            >
              <div>
                <div className={styles.num}>{idx}</div>
                <h3 className={styles.cardTitle}>{p.title}</h3>
                <p className={styles.desc}>{p.description}</p>
              </div>
              <div className={styles.foot}>
                <div className={styles.stack}>
                  {showAll
                    ? p.skills.map((s) => <span key={s}>{s}</span>)
                    : (
                      <>
                        {p.skills.slice(0, MAX).map((s) => <span key={s}>{s}</span>)}
                        <span className={styles.more} title={p.skills.slice(MAX).join(', ')}>
                          +{p.skills.length - MAX}
                        </span>
                      </>
                    )
                  }
                </div>
                <span className={styles.projCardMeta}>
                  {year ? `${role}·${year}` : role}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
