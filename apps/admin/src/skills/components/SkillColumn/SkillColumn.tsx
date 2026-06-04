import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { CategoryDto, SkillDto } from "../../../@types";
import { EditIcon, CloseIcon } from "../../../components";
import { SkillCard } from "../SkillCard";
import styles from "./skill-column.module.scss";

export const SkillColumn = ({
  id,
  name,
  count,
  category,
  skills,
  isUncategorized,
  addValue,
  onAddChange,
  onAddSubmit,
  onEditCategory,
  onDeleteCategory,
  onEditSkill,
  onDeleteSkill,
}: {
  id: string;
  name: string;
  count: number;
  category: CategoryDto | null;
  skills: SkillDto[];
  isUncategorized: boolean;
  addValue: string;
  onAddChange: (v: string) => void;
  onAddSubmit: () => void;
  onEditCategory: (c: CategoryDto) => void;
  onDeleteCategory: (id: string) => void;
  onEditSkill: (s: SkillDto) => void;
  onDeleteSkill: (id: string) => void;
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className={`${styles.column} ${isUncategorized ? styles.uncategorized : ""}`}>
      <div className={styles.columnHeader}>
        <div className={styles.columnTitle}>
          <span className={styles.columnName}>{name}</span>
          <span className={styles.columnCount}>{count}</span>
        </div>
        {category && (
          <div className={styles.columnActions}>
            <button
              className={styles.iconBtn}
              onClick={() => onEditCategory(category)}
              title="카테고리 수정"
              aria-label="카테고리 수정"
            >
              <EditIcon />
            </button>
            <button
              className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
              onClick={() => onDeleteCategory(category.id)}
              title="카테고리 삭제"
              aria-label="카테고리 삭제"
            >
              <CloseIcon />
            </button>
          </div>
        )}
      </div>

      <div
        ref={setNodeRef}
        className={`${styles.columnBody} ${isOver ? styles.columnBodyOver : ""}`}
      >
        <SortableContext
          items={skills.map((skill) => skill.id)}
          strategy={verticalListSortingStrategy}
        >
          {skills.length === 0 ? (
            <div className={styles.empty}>여기로 드래그</div>
          ) : (
            skills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onEdit={onEditSkill}
                onDelete={onDeleteSkill}
              />
            ))
          )}
        </SortableContext>
      </div>

      <div className={styles.footer}>
        <input
          className={styles.addInput}
          value={addValue}
          onChange={(e) => onAddChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAddSubmit();
            }
          }}
          placeholder="+ 스킬 추가"
        />
      </div>
    </div>
  );
};
