// 사이트 정규 URL — 메타데이터(canonical/OG)·robots·sitemap이 공유하는 절대 URL 기준.
// next가 본체이므로 운영 도메인을 기본값으로 둔다. 필요 시 env로 오버라이드.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jejinni.site';
