'use client';

import { useEffect } from 'react';

import { useMouse } from '../hooks/useMouse';
import { useTheme } from './ThemeProvider';
import styles from './theme.module.scss';

export function Theme({ children }: { children: React.ReactNode }) {
  const { dark } = useTheme();
  const m = useMouse();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className={styles.theme} data-theme={dark ? 'dark' : 'light'} data-density="regular">
      {/* Background */}
      <div className={styles.bg}>
        <div className={`${styles.blob} ${styles.b1}`} />
        <div className={`${styles.blob} ${styles.b2}`} />
      </div>
      <div className={styles.grid} />
      <div className={styles.noise} />
      <div
        className={styles.cursor}
        style={{ left: `${m.x * 100}%`, top: `${m.y * 100}%` }}
      />

      {children}
    </div>
  );
}
