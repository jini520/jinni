'use client';

import { useState } from 'react';
import styles from './accordion.module.scss';

export interface AccordionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function Accordion({ title, children, defaultOpen = false, className }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={[styles.accordion, open && styles.open, className].filter(Boolean).join(' ')}>
      <button className={styles.trigger} onClick={() => setOpen((v) => !v)}>
        <span>{title}</span>
        <span className={styles.arrow} aria-hidden>›</span>
      </button>
      {open && <div className={styles.body}>{children}</div>}
    </div>
  );
}
