'use client';

import type { PortfolioData } from '@jejinni/types';
import { AuroraVariant, ScrollProgress } from '@jejinni/ui';

interface Props {
  data: PortfolioData;
}

const PROGRESS_ACCENT = 'linear-gradient(90deg, oklch(78% 0.16 320), oklch(82% 0.14 200), oklch(82% 0.13 38))';

export function PortfolioClient({ data }: Props) {
  return (
    <>
      <ScrollProgress accent={PROGRESS_ACCENT} />
      <AuroraVariant data={data} />
    </>
  );
}
