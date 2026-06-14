import type { VelogPost } from '@jinni/types';
import styles from './writing.module.scss';

export function WritingSection({ posts }: { posts: VelogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section id="writing" className={styles.section}>
      <div className={styles.shead}>
        <div data-reveal>
          <div className={styles.sheadTag}>/ 05 · Writing</div>
          <h2 className={styles.sheadTitle}>최근 <em>글</em></h2>
        </div>
      </div>

      <div className={styles.posts}>
        {posts.map((p, i) => (
          <a
            key={i}
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.postRow}
            data-reveal
            data-delay={Math.min(i + 1, 4) as 1 | 2 | 3 | 4}
          >
            <span className={styles.date}>{p.pubDate}</span>
            <span className={styles.ptitle}>{p.title}</span>
            <span className={styles.ptag}>Velog</span>
            <span className={styles.pread}>읽기 →</span>
          </a>
        ))}
      </div>
    </section>
  );
}
