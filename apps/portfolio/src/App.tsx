import { useState, useEffect } from 'react';
import type { PortfolioData } from '@jejinni/types';
import { fetchPortfolioData } from './data';
import { AuroraVariant, ScrollProgress } from '@jejinni/ui';

const PROGRESS_ACCENT = 'linear-gradient(90deg, oklch(78% 0.16 320), oklch(82% 0.14 200), oklch(82% 0.13 38))';

export default function App() {
  const [data, setData] = useState<PortfolioData | null>(null);

  useEffect(() => {
    fetchPortfolioData().then(setData);
  }, []);

  return (
    <>
      <ScrollProgress accent={PROGRESS_ACCENT} />
      {data ? (
        <AuroraVariant data={data} />
      ) : (
        <div className="portfolio-loading">Loading…</div>
      )}
    </>
  );
}
