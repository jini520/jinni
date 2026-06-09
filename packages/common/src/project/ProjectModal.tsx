'use client';

import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import type { ProjectDetail } from '@jinni/types';
import { MarkdownRenderer, STATUS_LABELS, formatPeriod, calcMonths } from '@jinni/ui';
import styles from './project-detail.module.scss';

interface Props {
  project: ProjectDetail;
  accent: string;
  dark: boolean;
  idx: string;          // "01", "02" …
  onClose: () => void;
}

export function ProjectModal({ project: p, accent, dark, idx, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const months = calcMonths(p.startedAt, p.endedAt);
  const period = formatPeriod(p.startedAt, p.endedAt);

  const metaCells = [
    { k: 'PERIOD',       v: months > 0 ? `${period} (${months}개월)` : period },
    { k: 'PARTICIPANTS', v: p.participants ?? '-' },
    { k: 'CLIENT',       v: p.company ?? '-' },
  ].filter((c) => c.v && c.v !== '-');

  return ReactDOM.createPortal(
    <div
      className={styles.overlay}
      data-theme={dark ? 'dark' : 'light'}
      onClick={onClose}
    >
      <div className={styles.inner}>
        <div
          className={styles.modal}
          style={{ ['--c' as string]: accent }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 닫기 버튼 — sticky */}
          <div className={styles.closeRow}>
            <button className={styles.close} onClick={onClose} aria-label="닫기">✕</button>
          </div>

          {/* HEAD */}
          <div className={styles.head}>
            <div className={styles.num}>PROJECT — {idx}</div>
            <div className={styles.title}>{p.title}</div>
            <div className={styles.sub}>{p.description}</div>
            <div className={styles.tags}>
              {p.status && (
                <span className={styles.pill}>
                  <span className={styles.dot} />
                  {STATUS_LABELS[p.status]}
                </span>
              )}
            </div>
          </div>

          {/* BODY */}
          <div className={styles.body}>
            {/* 메타 */}
            {metaCells.length > 0 && (
              <div className={styles.meta} style={{ gridTemplateColumns: `repeat(${metaCells.length}, 1fr)` }}>
                {metaCells.map(({ k, v }) => (
                  <div key={k} className={styles.metaCell}>
                    <div className={styles.k}>{k}</div>
                    <div className={styles.v}>{v}</div>
                  </div>
                ))}
              </div>
            )}

            {/* 개요 */}
            {p.overview && (
              <div className={styles.block}>
                <div className={styles.blockLabel}>개요</div>
                <div className={styles.blockBody}><p>{p.overview}</p></div>
              </div>
            )}

            {/* 주요 기능 */}
            {p.features && p.features.length > 0 && (
              <div className={styles.block}>
                <div className={styles.blockLabel}>주요 기능</div>
                <div className={styles.features}>
                  {p.features.map((f, i) => (
                    <div key={i} className={styles.feature}>
                      <span className={styles.n}>{String(i + 1).padStart(2, '0')}</span>
                      <div className={styles.featureBody}>
                        <div className={styles.ttl}>{f.name}</div>
                        <div className={styles.note}>{f.note}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 구현 포인트 */}
            {p.highlights && p.highlights.length > 0 && (
              <div className={styles.block}>
                <div className={styles.blockLabel}>구현 포인트</div>
                <div className={styles.blockBody}>
                  <ul>{p.highlights.map((h, i) => <li key={i}>{h}</li>)}</ul>
                </div>
              </div>
            )}

            {/* 담당 역할 */}
            {p.responsibilities && p.responsibilities.length > 0 && (
              <div className={styles.block}>
                <div className={styles.blockLabel}>담당 역할</div>
                <div className={styles.blockBody}>
                  <ul>{p.responsibilities.map((r, i) => <li key={i}>{r}</li>)}</ul>
                </div>
              </div>
            )}

            {/* Stack */}
            <div className={styles.block}>
              <div className={styles.blockLabel}>Stack</div>
              <div className={styles.stackChips}>
                {p.skills.map((s) => <span key={s} className={styles.stackChip}>{s}</span>)}
              </div>
            </div>

            {/* 세부 내용 */}
            {p.contents && (
              <div className={`${styles.block} ${styles.blockContents}`}>
                <div className={styles.blockLabel}>세부 내용</div>
                <MarkdownRenderer markdown={p.contents} className={styles.markdown} />
              </div>
            )}
          </div>

          {/* FOOT */}
          {p.links && p.links.length > 0 && (
            <div className={styles.foot}>
              {p.links.map((l, i) => (
                <a
                  key={l.label}
                  className={`${styles.link}${i === 0 ? ` ${styles.linkPrimary}` : ''}`}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {l.label} →
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
