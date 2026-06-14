'use client';

import { useState } from 'react';
import type { Careers } from '@jinni/types';
import { formatYearMonth } from '@jinni/ui';
import styles from './career.module.scss';

export function CareerSection({ careers }: { careers: Careers }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const careerList = careers.businesses.map((b) => ({
    startDate: b.startDate,
    endDate: b.endDate,
    company: b.company,
    role: b.position,
    details: b.details ?? [],
    note: b.department,
    isCurrent: !b.endDate,
  }));

  return (
    <section id="career" className={styles.section}>
      <div className={styles.shead}>
        <div data-reveal>
          <div className={styles.sheadTag}>/ 04 · Career</div>
          <h2 className={styles.sheadTitle}>커리어</h2>
        </div>
      </div>

      <div className={styles.career}>
        {careerList.map((c, i) => (
          <div key={i} className={styles.careerItem} data-reveal data-delay={Math.min(i + 1, 4) as 1 | 2 | 3 | 4}>
            <div className={styles.careerYear}>
              <time dateTime={c.startDate.slice(0, 7)}>{formatYearMonth(c.startDate)}</time>
              {' — '}
              {c.endDate
                ? <time dateTime={c.endDate.slice(0, 7)}>{formatYearMonth(c.endDate)}</time>
                : 'Now'}
            </div>
            <div className={styles.careerBody}>
              <div className={styles.companyRow}>
                <div className={styles.company}>{c.company}</div>
                <div className={`${styles.careerBadge} ${c.isCurrent ? styles.current : ''}`}>
                  {c.isCurrent ? 'Now' : 'Past'}
                </div>
              </div>
              <div className={styles.careerRole}>{c.role}</div>
              {c.details.length > 0 ? (
                <>
                  <button
                    type="button"
                    className={`${styles.noteToggle} ${openIdx === i ? styles.noteToggleOpen : ''}`}
                    aria-expanded={openIdx === i}
                    onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  >
                    주요 업무 보기
                    <span className={styles.chevron} aria-hidden>▾</span>
                  </button>
                  <div className={`${styles.noteList} ${openIdx === i ? styles.noteListOpen : ''}`}>
                    <ul>
                      {c.details.map((d, di) => <li key={di}>{d}</li>)}
                    </ul>
                  </div>
                </>
              ) : (
                <div className={styles.note}>{c.note}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
