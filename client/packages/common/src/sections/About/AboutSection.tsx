import { QA_BLOCKS } from '../../data/content';
import styles from './about.module.scss';

export function AboutSection() {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.shead}>
        <div data-reveal>
          <div className={styles.sheadTag}>/ 01 · About</div>
          <div className={styles.sheadTitle}>Who am <em>I</em></div>
        </div>
      </div>

      <div className={styles.aboutQa}>
        {QA_BLOCKS.map((b, i) => (
          <div key={i} className={styles.qaBlock} data-reveal data-delay={Math.min(i + 1, 4) as 1 | 2 | 3 | 4}>
            <span className={styles.qaNum}>{String(i + 1).padStart(2, '0')}</span>
            <h3 className={styles.qaQuestion}>{b.q}</h3>
            <div className={styles.qaAnswerWrap}>
              {b.a.map((answer, j) => (
                <p key={j} className={styles.qaAnswer}>{answer}</p>
              ))}
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
