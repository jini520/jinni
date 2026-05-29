import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import type { ProjectDetail } from '@jejinni/types';
import { MarkdownRenderer } from '../../components/MarkdownRenderer';
import { STATUS_LABELS, formatPeriod, calcMonths } from '../../utils/project';

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
      className="proj-overlay"
      data-theme={dark ? 'dark' : 'light'}
      onClick={onClose}
    >
      <div className="proj-overlay-inner">
        <div
          className="proj-modal"
          style={{ ['--c' as string]: accent }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 닫기 버튼 — sticky */}
          <div className="proj-modal-close-row">
            <button className="proj-modal-close" onClick={onClose} aria-label="닫기">✕</button>
          </div>

          {/* HEAD */}
          <div className="proj-modal-head">
            <div className="num">PROJECT — {idx}</div>
            <div className="title">{p.title}</div>
            <div className="sub">{p.description}</div>
            <div className="tags">
              {p.status && (
                <span className="pill">
                  <span className="dot" />
                  {STATUS_LABELS[p.status]}
                </span>
              )}
            </div>
          </div>

          {/* BODY */}
          <div className="proj-modal-body">
            {/* 메타 */}
            {metaCells.length > 0 && (
              <div className="proj-meta" style={{ gridTemplateColumns: `repeat(${metaCells.length}, 1fr)` }}>
                {metaCells.map(({ k, v }) => (
                  <div key={k} className="proj-meta-cell">
                    <div className="k">{k}</div>
                    <div className="v">{v}</div>
                  </div>
                ))}
              </div>
            )}

            {/* 개요 */}
            {p.overview && (
              <div className="proj-block">
                <div className="proj-block-label">개요</div>
                <div className="proj-block-body"><p>{p.overview}</p></div>
              </div>
            )}

            {/* 주요 기능 */}
            {p.features && p.features.length > 0 && (
              <div className="proj-block">
                <div className="proj-block-label">주요 기능</div>
                <div className="proj-features">
                  {p.features.map((f, i) => (
                    <div key={i} className="proj-feature">
                      <span className="n">{String(i + 1).padStart(2, '0')}</span>
                      <div className="body">
                        <div className="ttl">{f.name}</div>
                        <div className="note">{f.note}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 구현 포인트 */}
            {p.highlights && p.highlights.length > 0 && (
              <div className="proj-block">
                <div className="proj-block-label">구현 포인트</div>
                <div className="proj-block-body">
                  <ul>{p.highlights.map((h, i) => <li key={i}>{h}</li>)}</ul>
                </div>
              </div>
            )}

            {/* 담당 역할 */}
            {p.responsibilities && p.responsibilities.length > 0 && (
              <div className="proj-block">
                <div className="proj-block-label">담당 역할</div>
                <div className="proj-block-body">
                  <ul>{p.responsibilities.map((r, i) => <li key={i}>{r}</li>)}</ul>
                </div>
              </div>
            )}

            {/* Stack */}
            <div className="proj-block">
              <div className="proj-block-label">Stack</div>
              <div className="proj-stack-chips">
                {p.skills.map((s) => <span key={s} className="proj-stack-chip">{s}</span>)}
              </div>
            </div>

            {/* 세부 내용 */}
            {p.contents && (
              <div className="proj-block proj-block--contents">
                <div className="proj-block-label">세부 내용</div>
                <MarkdownRenderer markdown={p.contents} className="proj-markdown" />
              </div>
            )}
          </div>

          {/* FOOT */}
          {p.links && p.links.length > 0 && (
            <div className="proj-modal-foot">
              {p.links.map((l, i) => (
                <a
                  key={l.label}
                  className={`proj-link${i === 0 ? ' primary' : ''}`}
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
