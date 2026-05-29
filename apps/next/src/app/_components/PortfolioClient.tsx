'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { PortfolioData } from '@jinni/types';
import { Theme } from '@jinni/ui';

interface Props {
  data: PortfolioData;
}

export function PortfolioClient({ data }: Props) {
  const [dark, setDark] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      if (localStorage.getItem('portfolio-theme') === 'light') setDark(false);
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light'); } catch {}
  }, [dark]);

  return (
    <Theme
      data={data}
      dark={dark}
      onToggleTheme={() => setDark((d) => !d)}
      onProjectClick={(id, accent, idx) =>
        router.push(`/projects/${id}`, { scroll: false })
      }
      renderLink={(href, children) => <a href={href}>{children}</a>}
    />
  );
}
