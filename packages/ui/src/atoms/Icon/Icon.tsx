import styles from './icon.module.scss';

export interface IconProps {
  src: string;
  alt?: string;
  size?: number;
  className?: string;
}

export function Icon({ src, alt = '', size = 24, className }: IconProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={[styles.icon, className].filter(Boolean).join(' ')}
    />
  );
}
