'use client';

import Link from 'next/link';
import type { PortfolioData } from '@jinni/types';
import { Theme, ThemeProvider } from '@jinni/ui';
import { PortfolioPage } from '@jinni/common';

interface Props {
  data: PortfolioData;
}

export function PortfolioClient({ data }: Props) {
  return (
    <ThemeProvider>
      <Theme>
        <PortfolioPage
          data={data}
          renderProjectLink={({ to, accent, idx, children, ...rest }) => (
            <Link href={to} scroll={false} {...rest}>{children}</Link>
          )}
          renderLink={(href, children) => <a href={href}>{children}</a>}
          apiUrl={process.env.NEXT_PUBLIC_API_URL ?? 'https://jejinni.site'}
        />
      </Theme>
    </ThemeProvider>
  );
}
