import { ImageResponse } from "next/og";
import { CARD_ACCENTS, PROFILE } from "@jinni/common/data";
import { fetchProjectDetail } from "@/lib/portfolio";
import { loadPretendard } from "@/lib/og";

// 파일 컨벤션 — 프로젝트별 OG 카드. /projects/[id]의 og:image로 자동 주입된다.
export const alt = "프로젝트 상세";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#0b0a14";
const FG = "#f0ecf8";
const FG_DIM = "rgba(240,236,248,0.62)";
const LINE = "rgba(255,255,255,0.14)";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [project, font] = await Promise.all([fetchProjectDetail(id), loadPretendard()]);

  const accent = project ? CARD_ACCENTS[project.order % CARD_ACCENTS.length] : "#ff3d9a";
  const idx = project ? String(project.order + 1).padStart(2, "0") : "00";
  const title = project?.title ?? "프로젝트";
  const desc = (project?.description ?? "").slice(0, 80);
  const skills = project?.skills.slice(0, 6) ?? [];

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
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: accent,
          }}
        />

        <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, color: accent }}>
          PROJECT — {idx}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 600, lineHeight: 1.05 }}>
            {title}
          </div>
          {desc && (
            <div style={{ display: "flex", fontSize: 30, color: FG_DIM, marginTop: 24 }}>
              {desc}
            </div>
          )}
          {skills.length > 0 && (
            <div style={{ display: "flex", gap: 12, marginTop: 36, flexWrap: "wrap" }}>
              {skills.map((s) => (
                <div
                  key={s}
                  style={{
                    display: "flex",
                    fontSize: 22,
                    color: FG_DIM,
                    border: `1px solid ${LINE}`,
                    borderRadius: 999,
                    padding: "8px 18px",
                  }}
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", fontSize: 26, color: FG_DIM, justifyContent: "flex-end" }}>
          {PROFILE.nameKo} · {PROFILE.site}
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Pretendard", data: font, style: "normal", weight: 600 }] },
  );
}
