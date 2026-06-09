'use client';

import { Nav, useTheme } from '@jinni/ui';
import { PROFILE } from '../../data/profile';
import styles from './nav.module.scss';

const navLinks = [
  { label: 'About',   href: '#about' },
  { label: 'Stack',   href: '#stack' },
  { label: 'Work',    href: '#work' },
  { label: 'Career',  href: '#career' },
  { label: 'Writing', href: '#writing' },
  { label: 'Contact', href: '#contact' },
];

interface PortfolioNavProps {
  renderLink?: (href: string, children: React.ReactNode) => React.ReactNode;
}

export function PortfolioNav({ renderLink }: PortfolioNavProps) {
  const { dark, toggle } = useTheme();

  const navBrand = (
    <>
      <span className={styles.dot} />
      <span>{PROFILE.nameKo}</span>
      <span className={styles.brandEn}>{PROFILE.site}</span>
    </>
  );

  const navCta = (
    <button className={styles.navCta}>↓ Resume</button>
  );

  return (
    <Nav
      links={navLinks}
      brand={navBrand}
      cta={navCta}
      theme={dark ? 'dark' : 'light'}
      onToggleTheme={toggle}
      renderLink={renderLink}
      className={styles.nav}
    />
  );
}
