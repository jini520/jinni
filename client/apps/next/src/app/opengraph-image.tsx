import { ImageResponse } from "next/og";
import { PROFILE } from "@jinni/common/data";
import { loadPretendard } from "@/lib/og";

// 파일 컨벤션 — 사이트 공통 OG 카드. layout의 openGraph/twitter 이미지로 자동 주입된다.
export const alt = `${PROFILE.nameKo} — ${PROFILE.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT = "#ff3d9a";
const BG = "#0b0a14";
const FG = "#f0ecf8";
const FG_DIM = "rgba(240,236,248,0.62)";

export default async function Image() {
  const font = await loadPretendard();

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: 80,
          background: BG,
          color: FG,
          fontFamily: "Pretendard",
        }}
      >
        {/* 상단 액센트 라인 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: ACCENT,
          }}
        />

        <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, color: ACCENT }}>
          PORTFOLIO
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 130, fontWeight: 600, lineHeight: 1 }}>
            {PROFILE.nameKo}
          </div>
          <div style={{ display: "flex", fontSize: 44, color: FG, marginTop: 24 }}>
            {PROFILE.role}
          </div>
          <div style={{ display: "flex", fontSize: 30, color: FG_DIM, marginTop: 16 }}>
            {PROFILE.tagline}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 26, color: FG_DIM, justifyContent: "flex-end" }}>
          {PROFILE.site}
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Pretendard", data: font, style: "normal", weight: 600 }] },
  );
}
