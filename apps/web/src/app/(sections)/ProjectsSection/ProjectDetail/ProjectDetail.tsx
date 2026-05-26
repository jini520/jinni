import React from "react";
import Shape from "@/app/_components/Shape/Shape";
import { getColor } from "@/hooks/useColor";
import classNames from "classnames";
import SkillIcon from "@/app/_components/SkillIcon/SkillIcon";
import MarkdownContent from "@/app/_components/MarkdownContent/MarkdownContent";
import { getProject } from "@/api/projects.api";
import "./project-detail.scss";

interface Props {
  id: string;
}

const ProjectDetail = async ({ id }: Props) => {
  const data = await getProject(id);

  if (!data) return <div>Project not found</div>;

  return (
    <div className={classNames("project__detail-container")}>
      <div className="project__detail-header">
        <Shape
          className={classNames(
            "project__detail-shape",
            `shape--${getColor(data.id)}`,
          )}
          id={data.id}
          size="lg"
        />
        <h1 className="project__detail-title">{data.title}</h1>
        <div>
          <div className="project__detail-caption">프로젝트 설명</div>
          <p className="project__detail-description">{data.description}</p>
        </div>
        <div>
          <div className="project__detail-caption">기술 스택</div>
          <div className="project__detail-skills">
            {data.skills.map((skill) => (
              <SkillIcon key={skill} skill={skill} size="sm" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4">
          <div>
            <div className="project__detail-caption">참여 인원</div>
            <p>{data.participants}</p>
          </div>
          <div className="col-span-2">
            <div className="project__detail-caption">기간</div>
            <p>{data.period}</p>
          </div>
          <div className="col-span-2"></div>
        </div>
      </div>
      <div className="project__detail-divider"></div>
      <div className="project__detail-content">
        <h2 className="project__detail-content-title">상세 내용</h2>
        <MarkdownContent markdown={data.contents} />
      </div>
    </div>
  );
};

export default ProjectDetail;
