import { LINKS } from '../../data/profile';
import styles from './contact.module.scss';

export function ContactSection() {
  return (
    <section id="contact" className={styles.section}>
      <div className={styles.contact} data-reveal>
        <div className={styles.contactInner}>
          <div>
            <h2>같이 <span className={styles.em}>만들어볼까요</span>?</h2>
            <p>
              새로운 프로젝트, 협업, 또는 그냥 인사 — 무엇이든 환영합니다.
              보통 24시간 안에 답변드립니다.
            </p>
          </div>
          <div className={styles.contactLinks}>
            {LINKS.map((l) => (
              <a key={l.label} href={l.href} className={styles.contactLink} target="_blank" rel="noopener noreferrer">
                <span className={styles.lbl}>{l.label}</span>
                <span className={styles.hdl}>{l.handle}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
