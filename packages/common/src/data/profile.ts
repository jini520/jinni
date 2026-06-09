export interface ContactLink {
  label: string;
  handle: string;
  href: string;
}

export const PROFILE = {
  nameKo: '제진명',
  nameEn: 'Je Jinmyeong',
  role: 'Frontend Developer',
  tagline: '사용자 경험을 코드로 설계하는 프론트엔드 개발자',
  site: 'jejinni.site',
  location: 'Seoul, KR',
  available: true,
  experience: '5+ years',
} as const;

export const LINKS: ContactLink[] = [
  { label: 'GitHub',   handle: '@jejinni',               href: 'https://github.com/jini520' },
  { label: 'Email',    handle: 'dev.jinni520@gmail.com', href: 'mailto:dev.jinni520@gmail.com' },
  { label: 'LinkedIn', handle: '/in/jejinni',             href: 'https://linkedin.com/in/jejinni' },
  { label: 'Velog',    handle: '@jingmong',              href: 'https://velog.io/@jingmong' },
];
