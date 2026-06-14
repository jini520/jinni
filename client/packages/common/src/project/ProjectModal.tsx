'use client';

import { useEffect, useId, useRef } from 'react';
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
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    const prevActive = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // 초기 포커스 — 다이얼로그로 이동(SR이 라벨을 읽고, Tab 트랩의 기준점이 된다)
    dialog?.focus();

    const getFocusable = () =>
      dialog
        ? Array.from(
            dialog.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
            ),
          ).filter((el) => el.offsetParent !== null)
        : [];

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab' || !dialog) return;
      // 포커스가 모달 경계(첫·끝) 또는 모달 밖에 닿으면 반대편으로 순환(트랩)
      const items = getFocusable();
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey) {
        if (active === first || active === dialog || !dialog.contains(active)) {
          e.preventDefault();
          (last ?? dialog).focus();
        }
      } else if (active === last || !dialog.contains(active)) {
        e.preventDefault();
        (first ?? dialog).focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      prevActive?.focus?.();  // 닫을 때 모달을 열었던 요소로 포커스 복원
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
          ref={dialogRef}
          className={styles.modal}
          style={{ ['--c' as string]: accent }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
        >
          {/* 닫기 버튼 — sticky */}
          <div className={styles.closeRow}>
            <button className={styles.close} onClick={onClose} aria-label="닫기">✕</button>
          </div>

          {/* HEAD */}
          <div className={styles.head}>
            <div className={styles.num}>PROJECT — {idx}</div>
            <h2 id={titleId} className={styles.title}>{p.title}</h2>
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
              {p.links.map((l) => (
                <a
                  key={l.label}
                  className={styles.link}
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
