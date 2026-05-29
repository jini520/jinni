'use client';

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

  return (
    <div className={[styles.wrap, className].filter(Boolean).join(' ')}>
      <nav className={styles.nav}>
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
