'use client';

import { useEffect } from 'react';

import { useTheme } from './ThemeProvider';
import styles from './theme.module.scss';

export function Theme({ children }: { children: React.ReactNode }) {
  const { dark } = useTheme();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className={styles.theme} data-theme={dark ? 'dark' : 'light'} data-density="regular">
      <div className={styles.grid} />
      <div className={styles.noise} />

      {children}
    </div>
  );
}
