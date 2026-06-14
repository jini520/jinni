import { Fragment } from 'react';
import { LINKS, PROFILE } from '../../data/profile';
import styles from './footer.module.scss';

export function Footer() {
  return (
    <footer className={styles.foot}>
      <h2 className={styles.contactTag}>Contact</h2>
      <div className={styles.contactLinks}>
        {LINKS.map((l) => (
          <a key={l.label} href={l.href} className={styles.contactLink} target="_blank" rel="noopener noreferrer">
            <span className={styles.lbl}>{l.label}</span>
            <span className={styles.hdl}>
              {/* 공간이 부족할 때 이메일이 @ 앞에서 줄바꿈되도록 break 지점 제공 */}
              {l.handle.split(/(?=@)/).map((part, i) =>
                i === 0 ? part : <Fragment key={i}><wbr />{part}</Fragment>
              )}
            </span>
          </a>
        ))}
      </div>
      <div className={styles.meta}>
        <span>© 2026 {PROFILE.nameKo} · {PROFILE.site}</span>
        <span>Designed &amp; coded with care.</span>
      </div>
    </footer>
  );
}
