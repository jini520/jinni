'use client';

import { cloneElement, isValidElement, useEffect, useState } from 'react';
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
  activeHref?: string;
}

export function Nav({ links, brand, cta, theme = 'dark', onToggleTheme, renderLink, className, activeHref }: NavProps) {
  const linkEl = (href: string, active: boolean, children: React.ReactNode) => {
    const el = renderLink ? renderLink(href, children) : <a href={href}>{children}</a>;
    // aria-current는 링크 요소(<a>)에 — 스크롤 스파이가 가리키는 현재 섹션을 AT에 알린다.
    // <a>가 renderLink/기본값 어느 쪽이든 cloneElement로 주입.
    return active && isValidElement(el)
      ? cloneElement(el as React.ReactElement<{ 'aria-current'?: string }>, { 'aria-current': 'true' })
      : el;
  };

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
              {linkEl(
                l.href,
                l.href === activeHref,
                <span className={styles.link} data-active={l.href === activeHref}>{l.label}</span>,
              )}
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
