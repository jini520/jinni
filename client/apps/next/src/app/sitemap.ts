import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { fetchProjects } from "@/lib/portfolio";

// App Router 파일 컨벤션 — 이 파일이 곧 /sitemap.xml 엔드포인트가 된다.
// 홈 + 모든 프로젝트 상세 URL을 크롤러에게 색인 지도로 제공한다.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await fetchProjects();

  const projectEntries: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE_URL}/projects/${p.id}`,
    lastModified: p.endedAt ?? p.startedAt ?? undefined,
  }));

  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    ...projectEntries,
  ];
}
