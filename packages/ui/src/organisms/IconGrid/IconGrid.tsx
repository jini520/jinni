import { Chip } from '../../molecules/Chip';
import styles from './icon-grid.module.scss';

export interface IconGridItem {
  name: string;
  icon?: React.ReactNode;
  accent?: string;
}

export interface IconGridRow {
  label: string;
  subLabel?: string;
  items: IconGridItem[];
}

export interface IconGridProps {
  rows: IconGridRow[];
  className?: string;
}

export function IconGrid({ rows, className }: IconGridProps) {
  return (
    <div className={[styles.grid, className].filter(Boolean).join(' ')}>
      {rows.map((row) => (
        <div key={row.label} className={styles.row}>
          <div className={styles.rowLabel}>
            <span className={styles.ko}>{row.label}</span>
            {row.subLabel && <span className={styles.en}>{row.subLabel}</span>}
          </div>
          <div className={styles.chips}>
            {row.items.map((item) => (
              <Chip key={item.name} label={item.name} icon={item.icon} accent={item.accent} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
