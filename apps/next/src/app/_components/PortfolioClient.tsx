'use client';

import { useRouter } from 'next/navigation';
import type { PortfolioData } from '@jinni/types';
import { Theme, ThemeProvider } from '@jinni/ui';
import { PortfolioPage } from '@jinni/common';

interface Props {
  data: PortfolioData;
}

export function PortfolioClient({ data }: Props) {
  const router = useRouter();

  return (
    <ThemeProvider>
      <Theme>
        <PortfolioPage
          data={data}
          onProjectClick={(id) => router.push(`/projects/${id}`, { scroll: false })}
          renderLink={(href, children) => <a href={href}>{children}</a>}
        />
      </Theme>
    </ThemeProvider>
  );
}
