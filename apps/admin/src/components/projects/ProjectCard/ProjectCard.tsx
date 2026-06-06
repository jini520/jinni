import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ProjectListItemDto } from "@/types";
import { GripIcon, CalendarIcon } from "@/components/common";
import { ProjectStatusBadge } from "../ProjectStatusBadge";
import { formatProjectPeriod } from "@/utils/formatProjectPeriod";
import styles from "./project-card.module.scss";

export const ProjectCardBody = ({
  project,
}: {
  project: ProjectListItemDto;
}) => {
  const period = formatProjectPeriod(project.startedAt, project.endedAt);
  return (
    <>
      <h3 className={styles.title}>{project.title}</h3>
      {project.description && <p className={styles.desc}>{project.description}</p>}
      <div className={styles.meta}>
        {period && (
          <span className={styles.period}>
            <CalendarIcon />
            {period}
          </span>
        )}
        <ProjectStatusBadge status={project.status} />
      </div>
      {project.skills && project.skills.length > 0 && (
        <div className={styles.skills}>
          {project.skills.map((skill, idx) => (
            <span key={idx} className={styles.skillTag}>
              {skill}
            </span>
          ))}
        </div>
      )}
    </>
  );
};

export const SortableProjectItem = ({
  project,
  onOpen,
}: {
  project: ProjectListItemDto;
  onOpen: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: project.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.card} ${isDragging ? styles.cardDragging : ""}`}
    >
      <button
        type="button"
        className={styles.handle}
        aria-label="드래그하여 순서 변경"
        {...attributes}
        {...listeners}
      >
        <GripIcon />
      </button>
      <div className={styles.content} onClick={onOpen}>
        <ProjectCardBody project={project} />
      </div>
    </div>
  );
};

// 드래그 중 떠 있는 카드 오버레이 (DragOverlay 내부에서 사용)
export const ProjectCardOverlay = ({
  project,
}: {
  project: ProjectListItemDto;
}) => (
  <div className={`${styles.card} ${styles.cardOverlay}`}>
    <span className={styles.handle}>
      <GripIcon />
    </span>
    <div className={styles.content}>
      <ProjectCardBody project={project} />
    </div>
  </div>
);
