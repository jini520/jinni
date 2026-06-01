import type { Skills } from '@jinni/types';
import { getSkillIcon } from '../../data/SkillIcons';
import { TECH_GROUPS_KO } from '../../data/content';
import styles from './stack.module.scss';

export function StackSection({ skills }: { skills: Skills }) {
  const sortedCategories = [...skills.categories].sort((a, b) => a.order - b.order);

  return (
    <section id="stack" className={styles.section}>
      <div className={styles.shead}>
        <div data-reveal>
          <div className={styles.sheadTag}>/ 02 · Stack</div>
          <div className={styles.sheadTitle}>기술 스택</div>
        </div>
        <p className={styles.sheadSub} data-reveal data-delay="1">
          실무에서 일상적으로 사용하는 도구들.
        </p>
      </div>

      <div className={styles.tech}>
        {sortedCategories.map((cat, gi) => {
          const catSkills = skills.skills
            .filter((s) => s.categoryId === cat.id)
            .sort((a, b) => a.order - b.order);

          return (
            <div
              key={cat.id}
              className={styles.techRow}
              data-reveal
              data-delay={Math.min(gi + 1, 4) as 1 | 2 | 3 | 4}
            >
              <div className={styles.techRowLabel}>
                <span className={styles.ko}>{TECH_GROUPS_KO[cat.name] ?? cat.name}</span>
                <span className={styles.en}>— {cat.name}</span>
              </div>
              <div className={styles.techChips}>
                {catSkills.map((skill, si) => {
                  const hue = (si * 37 + gi * 73) % 360;
                  return (
                    <span
                      key={skill.id}
                      className={styles.techChip}
                      style={{ ['--chip-accent' as string]: `oklch(72% 0.16 ${hue})` }}
                    >
                      <span className={styles.sq}>
                        {(() => {
                          const Icon = getSkillIcon(skill.name);
                          return Icon
                            ? <Icon width={16} height={16} />
                            : skill.name.slice(0, 2).toUpperCase();
                        })()}
                      </span>
                      {skill.name}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
