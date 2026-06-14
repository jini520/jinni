import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// App Router 파일 컨벤션 — 이 파일이 곧 /robots.txt 엔드포인트가 된다.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
