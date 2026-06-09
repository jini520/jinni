import { PROFILE } from '../../data/profile';
import styles from './hero.module.scss';

export function HeroSection() {
  return (
    <section className={styles.hero}>
      <div>
        <div className={styles.eyebrow} data-reveal>
          <span className={styles.pulse} />
          Available · 2026
        </div>
        <h1 className={styles.h1}>
          <span className={styles.ln1} data-reveal data-delay="1">안녕하세요,</span>
          <span className={styles.ln2} data-reveal data-delay="2">프론트엔드 개발자</span>
          <span className={styles.ln3} data-reveal data-delay="3">
            <span className={styles.name}>{PROFILE.nameKo}</span>입니다.
          </span>
          <span className={styles.h1En} data-reveal data-delay="4">
            {PROFILE.nameEn},
          </span>
        </h1>
      </div>
    </section>
  );
}
