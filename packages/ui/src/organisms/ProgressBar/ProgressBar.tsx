'use client';

import { useScrollProgress } from '../../hooks/useScrollProgress';
import styles from './progress-bar.module.scss';

export interface ProgressBarProps {
  accent?: string;
  className?: string;
}

export function ProgressBar({ accent, className }: ProgressBarProps) {
  const progress = useScrollProgress();

  return (
    <div
      className={[styles.bar, className].filter(Boolean).join(' ')}
      style={{
        background: accent ?? 'var(--color-accent)',
        transform: `scaleX(${progress})`,
      }}
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
}
