import type { ProjectDetailDto } from "@/types";
import { Button } from "@/components/common";
import { ProjectStatusBadge } from "../ProjectStatusBadge";
import { ProjectMarkdown } from "../ProjectMarkdown";
import { formatProjectPeriod } from "@/utils/formatProjectPeriod";
import styles from "./project-detail-view.module.scss";

// 프로젝트 상세 읽기 뷰 (헤더·메타·스킬·섹션·콘텐츠 마크다운)
export const ProjectDetailView = ({
  project,
  onEdit,
  onDelete,
}: {
  project: ProjectDetailDto;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const period = formatProjectPeriod(project.startedAt, project.endedAt);

  return (
    <>
      <div className={styles.detailHeader}>
        <div className={styles.detailHeaderTop}>
          <h2 className={styles.detailTitle}>{project.title}</h2>
          <div className={styles.detailActions}>
            <Button variant="outline" onClick={onEdit}>
              프로젝트 수정
            </Button>
            <Button
              variant="ghost"
              className={styles.danger}
              onClick={onDelete}
            >
              프로젝트 삭제
            </Button>
          </div>
        </div>
        {project.description && (
          <p className={styles.detailDesc}>{project.description}</p>
        )}
        <div className={styles.detailMeta}>
          {project.order !== undefined && <span>순서 {project.order}</span>}
          {period && <span>{period}</span>}
          <ProjectStatusBadge status={project.status} />
          {project.participants && <span>참여 {project.participants}</span>}
          {project.company && <span>{project.company}</span>}
        </div>
        {project.skills && project.skills.length > 0 && (
          <div className={styles.detailSkills}>
            {project.skills.map((skill, idx) => (
              <span key={idx} className={styles.skillTag}>
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {project.overview && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>개요</h3>
          <p className={styles.detailText}>{project.overview}</p>
        </div>
      )}

      {project.highlights && project.highlights.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>주요 성과</h3>
          <ul className={styles.detailList}>
            {project.highlights.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {project.responsibilities && project.responsibilities.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>담당 역할</h3>
          <ul className={styles.detailList}>
            {project.responsibilities.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {project.features && project.features.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>주요 기능</h3>
          {project.features.map((feature, idx) => (
            <div key={idx} className={styles.feature}>
              <div className={styles.featureName}>{feature.name}</div>
              {feature.note && (
                <div className={styles.featureNote}>{feature.note}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {project.links && project.links.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>링크</h3>
          <div className={styles.links}>
            {project.links.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>프로젝트 콘텐츠</h3>
        {!project.contents || project.contents.trim() === "" ? (
          <p className={styles.detailText}>
            등록된 콘텐츠가 없습니다. 프로젝트 수정 버튼을 눌러 콘텐츠를 추가하세요.
          </p>
        ) : (
          <ProjectMarkdown content={project.contents} />
        )}
      </div>
    </>
  );
};
