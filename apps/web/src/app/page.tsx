import { fetchPortfolioData } from '@/lib/portfolio';
import { PortfolioClient } from './_components/PortfolioClient';

export default async function Home() {
  const data = await fetchPortfolioData();
  return <PortfolioClient data={data} />;
}
