import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { SkillDto } from "@/types";
import { GripIcon, EditIcon, CloseIcon } from "@/components/common";
import styles from "./skill-card.module.scss";

export const SkillCard = ({
  skill,
  onEdit,
  onDelete,
}: {
  skill: SkillDto;
  onEdit: (skill: SkillDto) => void;
  onDelete: (id: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: skill.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const stop = (e: React.PointerEvent | React.MouseEvent) =>
    e.stopPropagation();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.card} ${isDragging ? styles.cardDragging : ""}`}
    >
      <button
        type="button"
        className={styles.cardGrip}
        aria-label="드래그하여 순서 변경"
        {...attributes}
        {...listeners}
      >
        <GripIcon />
      </button>
      <span className={styles.skillName}>{skill.name}</span>
      <div className={styles.cardActions}>
        <button
          className={styles.cardBtn}
          onPointerDown={stop}
          onClick={(e) => {
            stop(e);
            onEdit(skill);
          }}
          title="수정"
          aria-label="수정"
        >
          <EditIcon />
        </button>
        <button
          className={`${styles.cardBtn} ${styles.cardBtnDanger}`}
          onPointerDown={stop}
          onClick={(e) => {
            stop(e);
            onDelete(skill.id);
          }}
          title="삭제"
          aria-label="삭제"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
};

export const SkillCardOverlay = ({ name }: { name: string }) => (
  <div className={`${styles.card} ${styles.cardOverlay}`}>
    <span className={styles.skillName}>{name}</span>
  </div>
);
