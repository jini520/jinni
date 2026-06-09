import styles from './card.module.scss';

export interface CardProps {
  accent?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Card({ accent, onClick, children, className }: CardProps) {
  return (
    <div
      className={[styles.card, onClick && styles.clickable, className].filter(Boolean).join(' ')}
      style={accent ? ({ '--card-accent': accent } as React.CSSProperties) : undefined}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <div className={styles.topLine} />
      {children}
    </div>
  );
}
