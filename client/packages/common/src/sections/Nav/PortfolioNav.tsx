'use client';

import { Nav, useTheme, useScrollSpy } from '@jinni/ui';
import { PROFILE } from '../../data/profile';
import styles from './nav.module.scss';

const navLinks = [
  { label: 'About',   href: '#about' },
  { label: 'Stack',   href: '#stack' },
  { label: 'Project', href: '#work' },
  { label: 'Career',  href: '#career' },
  { label: 'Writing', href: '#writing' },
];

const sectionIds = navLinks.map((l) => l.href.slice(1));

async function downloadResume(apiUrl: string) {
  try {
    const res = await fetch(`${apiUrl}/api/resumes/latest`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    // Content-Disposition: attachment; filename*=UTF-8''... 에서 파일명 추출
    const disposition = res.headers.get('Content-Disposition') ?? '';
    const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
    const plainMatch = disposition.match(/filename="?([^";]+)"?/i);
    const filename = utf8Match
      ? decodeURIComponent(utf8Match[1])
      : plainMatch?.[1] ?? 'resume.pdf';

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error('이력서 다운로드 실패:', e);
    alert('이력서를 다운로드할 수 없습니다. 잠시 후 다시 시도해 주세요.');
  }
}

interface PortfolioNavProps {
  apiUrl?: string;
  renderLink?: (href: string, children: React.ReactNode) => React.ReactNode;
}

export function PortfolioNav({ apiUrl = '', renderLink }: PortfolioNavProps) {
  const { dark, toggle } = useTheme();
  const activeId = useScrollSpy(sectionIds);

  const navBrand = (
    <>
      <span className={styles.dot} />
      <span>{PROFILE.nameKo}</span>
      <span className={styles.brandEn}>{PROFILE.site}</span>
    </>
  );

  const navCta = (
    <button className={styles.navCta} onClick={() => downloadResume(apiUrl)}>↓ Resume</button>
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
      activeHref={activeId ? `#${activeId}` : undefined}
    />
  );
}
