import styles from './pill.module.scss';

export interface PillProps {
  label: string;
  dot?: boolean;
  className?: string;
}

export function Pill({ label, dot = false, className }: PillProps) {
  return (
    <span className={[styles.pill, className].filter(Boolean).join(' ')}>
      {dot && <span className={styles.dot} />}
      {label}
    </span>
  );
}
