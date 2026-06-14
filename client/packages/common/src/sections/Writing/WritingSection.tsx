import type { VelogPost } from '@jinni/types';
import styles from './writing.module.scss';

// 서버가 내려주는 "2025. 11." → "2025-11"(machine-readable). 형식이 안 맞으면 undefined.
function toIsoMonth(pubDate: string): string | undefined {
  const m = pubDate.match(/(\d{4})\.\s*(\d{1,2})\./);
  return m ? `${m[1]}-${m[2].padStart(2, '0')}` : undefined;
}

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
        {posts.map((p, i) => {
          const iso = toIsoMonth(p.pubDate);
          return (
          <a
            key={i}
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.postRow}
            data-reveal
            data-delay={Math.min(i + 1, 4) as 1 | 2 | 3 | 4}
          >
            {iso
              ? <time className={styles.date} dateTime={iso}>{p.pubDate}</time>
              : <span className={styles.date}>{p.pubDate}</span>}
            <span className={styles.ptitle}>{p.title}</span>
            <span className={styles.ptag}>Velog</span>
            <span className={styles.pread}>읽기 →</span>
          </a>
          );
        })}
      </div>
    </section>
  );
}
