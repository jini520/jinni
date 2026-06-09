'use client';

import { useEffect, useState } from 'react';
import styles from './nav.module.scss';

export interface NavLink {
  label: string;
  href: string;
}

export interface NavProps {
  links: NavLink[];
  brand?: React.ReactNode;
  cta?: React.ReactNode;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  renderLink?: (href: string, children: React.ReactNode) => React.ReactNode;
  className?: string;
}

export function Nav({ links, brand, cta, theme = 'dark', onToggleTheme, renderLink, className }: NavProps) {
  const linkEl = (href: string, children: React.ReactNode) =>
    renderLink ? renderLink(href, children) : <a href={href}>{children}</a>;

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div className={[styles.wrap, className].filter(Boolean).join(' ')} data-scrolled={scrolled}>
      <nav className={styles.nav} data-scrolled={scrolled}>
        {brand && <div className={styles.brand}>{brand}</div>}

        <ul className={styles.links}>
          {links.map((l) => (
            <li key={l.href}>
              {linkEl(l.href, <span className={styles.link}>{l.label}</span>)}
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          {cta}
          {onToggleTheme && (
            <button className={styles.themeToggle} onClick={onToggleTheme} aria-label="테마 전환">
              {theme === 'dark' ? '☀︎' : '◑'}
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}
