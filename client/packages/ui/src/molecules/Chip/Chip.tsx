import styles from './chip.module.scss';

export interface ChipProps {
  label: string;
  icon?: React.ReactNode;
  accent?: string;
  className?: string;
}

export function Chip({ label, icon, accent, className }: ChipProps) {
  return (
    <span
      className={[styles.chip, className].filter(Boolean).join(' ')}
      style={accent ? ({ '--chip-accent': accent } as React.CSSProperties) : undefined}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {label}
    </span>
  );
}
