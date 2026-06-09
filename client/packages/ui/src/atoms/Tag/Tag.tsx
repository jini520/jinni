import styles from './tag.module.scss';

export interface TagProps {
  label: string;
  color?: string;
  className?: string;
}

export function Tag({ label, color, className }: TagProps) {
  return (
    <span
      className={[styles.tag, className].filter(Boolean).join(' ')}
      style={color ? ({ '--tag-color': color } as React.CSSProperties) : undefined}
    >
      {label}
    </span>
  );
}
