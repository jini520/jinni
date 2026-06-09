import styles from './badge.module.scss';

export type BadgeVariant = 'default' | 'current' | 'outline';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ label, variant = 'default', className }: BadgeProps) {
  return (
    <span className={[styles.badge, styles[variant], className].filter(Boolean).join(' ')}>
      {label}
    </span>
  );
}
