import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { PROFILE } from "@jinni/common/data";
import { SITE_URL } from "@/lib/site";
import "../styles/main.scss";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.ttf",
  variable: "--font-pretendard",
  weight: "100 900",
  display: "swap",
});

const description = `${PROFILE.tagline} ${PROFILE.nameKo}의 포트폴리오`;

export const metadata: Metadata = {
  // 절대 URL 기준 — canonical·OG 이미지 경로를 절대 URL로 변환한다.
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${PROFILE.nameKo} | 포트폴리오`,
    // 하위 페이지(generateMetadata)는 title만 주면 "<title> | 제진명"으로 합성된다.
    template: `%s | ${PROFILE.nameKo}`,
  },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: `${PROFILE.nameKo} 포트폴리오`,
    title: `${PROFILE.nameKo} | 포트폴리오`,
    description,
    url: "/",
    locale: "ko_KR",
    // og:image는 app/opengraph-image.tsx 파일 컨벤션이 자동으로 주입한다.
  },
  twitter: {
    card: "summary_large_image",
    title: `${PROFILE.nameKo} | 포트폴리오`,
    description,
  },
};

// schema.org Person — 이 사이트가 "제진명이라는 사람"임을 기계가 읽는 형식으로 선언.
// sameAs는 흩어진 계정을 동일 인물로 묶는다.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PROFILE.nameKo,
  alternateName: PROFILE.nameEn,
  jobTitle: PROFILE.role,
  description: PROFILE.tagline,
  url: SITE_URL,
  sameAs: [
    "https://github.com/jini520",
    // TODO: LinkedIn URL 확인 후 추가 — "https://linkedin.com/in/<정확한-id>"
    "https://velog.io/@jingmong",
  ],
};

// viewport-fit=cover: iOS 노치/다이나믹 아일랜드 safe-area inset 활성화
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={pretendard.variable}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
