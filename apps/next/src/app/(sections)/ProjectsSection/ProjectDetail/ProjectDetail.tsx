import React from "react";
import Shape from "@/app/_components/Shape/Shape";
import { getColor } from "@/hooks/useColor";
import classNames from "classnames";
import SkillIcon from "@/app/_components/SkillIcon/SkillIcon";
import MarkdownContent from "@/app/_components/MarkdownContent/MarkdownContent";
import { getProject } from "@/api/projects.api";
import type { ProjectStatus } from "@/api/projects.types";
import type { IconNames } from "@/constants/iconRegistry";
import "./project-detail.scss";

const STATUS_LABELS: Record<ProjectStatus, string> = {
  IN_PROGRESS: "진행 중",
  LIVE: "운영 중",
  COMPLETED: "완료",
};

function formatPeriod(startedAt: string | null, endedAt: string | null): string {
  if (!startedAt) return "";
  const start = startedAt.substring(0, 7).replace("-", ".");
  if (!endedAt) return `${start}. -`;
  return `${start}. - ${endedAt.substring(0, 7).replace("-", ".")}.`;
}

function calcMonths(startedAt: string | null, endedAt: string | null): number {
  if (!startedAt) return 0;
  const s = new Date(startedAt);
  const e = endedAt ? new Date(endedAt) : new Date();
  return (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
}

interface Props {
  id: string;
}

const ProjectDetail = async ({ id }: Props) => {
  const data = await getProject(id);

  if (!data) return <div>Project not found</div>;

  const color = getColor(data.id);
  const period = formatPeriod(data.startedAt, data.endedAt);
  const months = calcMonths(data.startedAt, data.endedAt);
  const idx = String((data.order ?? 0) + 1).padStart(2, "0");

  const metaCells = [
    { k: "PERIOD",       v: period ? (months > 0 ? `${period} (${months}개월)` : period) : null },
    { k: "PARTICIPANTS", v: data.participants },
    { k: "CLIENT",       v: data.company },
  ].filter((c): c is { k: string; v: string } => Boolean(c.v));

  return (
    <div className={classNames("pd", `pd--${color}`)}>
      {/* HEAD */}
      <div className="pd-head">
        <div className="pd-head-l">
          <div className="pd-num">PROJECT — {idx}</div>
          <div className="pd-title-row">
            <Shape className={classNames("pd-shape", `shape--${color}`)} id={data.id} size="lg" />
            <h1 className="pd-title">{data.title}</h1>
          </div>
          <p className="pd-sub">{data.description}</p>
          {data.status && (
            <span className="pd-pill">
              <span className="pd-pill-dot" />
              {STATUS_LABELS[data.status]}
            </span>
          )}
        </div>
      </div>

      {/* META GRID */}
      {metaCells.length > 0 && (
        <div className="pd-meta" style={{ gridTemplateColumns: `repeat(${metaCells.length}, 1fr)` }}>
          {metaCells.map(({ k, v }) => (
            <div key={k} className="pd-meta-cell">
              <div className="pd-meta-k">{k}</div>
              <div className="pd-meta-v">{v}</div>
            </div>
          ))}
        </div>
      )}

      {/* BODY BLOCKS */}
      <div className="pd-blocks">
        {/* 개요 */}
        {data.overview && (
          <div className="pd-block">
            <div className="pd-block-label">개요</div>
            <div className="pd-block-body"><p>{data.overview}</p></div>
          </div>
        )}

        {/* 주요 기능 */}
        {data.features && data.features.length > 0 && (
          <div className="pd-block">
            <div className="pd-block-label">주요 기능</div>
            <div className="pd-features">
              {data.features.map((f, i) => (
                <div key={i} className="pd-feature">
                  <span className="pd-feature-n">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <div className="pd-feature-title">{f.name}</div>
                    <div className="pd-feature-note">{f.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 구현 포인트 */}
        {data.highlights && data.highlights.length > 0 && (
          <div className="pd-block">
            <div className="pd-block-label">구현 포인트</div>
            <div className="pd-block-body">
              <ul>{data.highlights.map((h, i) => <li key={i}>{h}</li>)}</ul>
            </div>
          </div>
        )}

        {/* 담당 역할 */}
        {data.responsibilities && data.responsibilities.length > 0 && (
          <div className="pd-block">
            <div className="pd-block-label">담당 역할</div>
            <div className="pd-block-body">
              <ul>{data.responsibilities.map((r, i) => <li key={i}>{r}</li>)}</ul>
            </div>
          </div>
        )}

        {/* Stack */}
        <div className="pd-block">
          <div className="pd-block-label">Stack</div>
          <div className="pd-skills">
            {data.skills.map((skill) => (
              <SkillIcon key={skill} skill={skill as IconNames} size="sm" />
            ))}
          </div>
        </div>
      </div>

      {/* LINKS */}
      {data.links && data.links.length > 0 && (
        <div className="pd-links">
          {data.links.map((l, i) => (
            <a
              key={l.label}
              className={classNames("pd-link", { "pd-link--primary": i === 0 })}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {l.label} →
            </a>
          ))}
        </div>
      )}

      {/* 세부 내용 */}
      {data.contents && (
        <div className="pd-contents">
          <div className="pd-contents-divider">
            <span>세부 내용</span>
          </div>
          <MarkdownContent markdown={data.contents} />
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
