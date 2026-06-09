import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "../styles/main.scss";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.ttf",
  variable: "--font-pretendard",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "제진명 | 포트폴리오",
  description: "제진명의 포트폴리오 사이트",
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
        {children}
      </body>
    </html>
  );
}
