import type { Careers } from '@jinni/types';
import styles from './career.module.scss';

export function CareerSection({ careers }: { careers: Careers }) {
  const careerList = careers.businesses.map((b, i) => ({
    year: `${b.startDate} — ${b.endDate}`,
    company: b.company,
    role: b.position,
    note: b.details?.[0] ?? b.department,
    isCurrent: i === 0,
  }));

  return (
    <section id="career" className={styles.section}>
      <div className={styles.shead}>
        <div data-reveal>
          <div className={styles.sheadTag}>/ 04 · Timeline</div>
          <div className={styles.sheadTitle}>커리어</div>
        </div>
      </div>

      <div className={styles.career}>
        {careerList.map((c, i) => (
          <div key={i} className={styles.careerItem} data-reveal data-delay={Math.min(i + 1, 4) as 1 | 2 | 3 | 4}>
            <div className={styles.careerYear}>{c.year}</div>
            <div className={styles.careerBody}>
              <div className={styles.company}>{c.company}</div>
              <div className={styles.careerRole}>{c.role}</div>
              <div className={styles.note}>{c.note}</div>
            </div>
            <div className={`${styles.careerBadge} ${c.isCurrent ? styles.current : ''}`}>
              {c.isCurrent ? 'Now' : 'Past'}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
