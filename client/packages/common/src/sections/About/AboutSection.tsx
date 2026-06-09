import { QA_BLOCKS } from '../../data/content';
import styles from './about.module.scss';

export function AboutSection() {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.shead}>
        <div data-reveal>
          <div className={styles.sheadTag}>/ 01 · About</div>
          <div className={styles.sheadTitle}>코드로 그리는 <em>인터페이스</em></div>
        </div>
        <p className={styles.sheadSub} data-reveal data-delay="1">
          디자인 시스템과 성능, 사용자 경험 사이의 균형 — 그 사이에서 길을 만듭니다.
        </p>
      </div>

      <div className={styles.aboutQa}>
        {QA_BLOCKS.map((b, i) => (
          <div key={i} className={styles.qaBlock} data-reveal data-delay={Math.min(i + 1, 4) as 1 | 2 | 3 | 4}>
            <span className={styles.qaNum}>{String(i + 1).padStart(2, '0')}</span>
            <h3 className={styles.qaQuestion}>{b.q}</h3>
            <div className={styles.qaAnswerWrap}>
              <p className={styles.qaAnswer}>{b.a}</p>
              <div className={styles.qaTags}>
                {b.tags.map((t) => <span key={t} className={styles.qaTag}>{t}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
