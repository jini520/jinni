import {
  DndContext,
  DragOverlay,
  closestCorners,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  type SensorDescriptor,
  type SensorOptions,
} from "@dnd-kit/core";
import type { CategoryDto, SkillDto } from "../../../@types";
import { UNCAT, type SkillBoardColumn } from "../../useSkillBoard";
import { SkillColumn } from "../SkillColumn";
import { SkillCardOverlay } from "../SkillCard";
import styles from "./skill-board.module.scss";

export const SkillBoard = ({
  columns,
  items,
  skillMap,
  sensors,
  activeSkill,
  addInputs,
  onDragStart,
  onDragOver,
  onDragEnd,
  onAddChange,
  onAddSubmit,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onEditSkill,
  onDeleteSkill,
}: {
  columns: SkillBoardColumn[];
  items: Record<string, string[]>;
  skillMap: Record<string, SkillDto>;
  sensors: SensorDescriptor<SensorOptions>[];
  activeSkill: SkillDto | null;
  addInputs: Record<string, string>;
  onDragStart: (e: DragStartEvent) => void;
  onDragOver: (e: DragOverEvent) => void;
  onDragEnd: (e: DragEndEvent) => void;
  onAddChange: (id: string, value: string) => void;
  onAddSubmit: (id: string) => void;
  onAddCategory: () => void;
  onEditCategory: (c: CategoryDto) => void;
  onDeleteCategory: (id: string) => void;
  onEditSkill: (s: SkillDto) => void;
  onDeleteSkill: (id: string) => void;
}) => {
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className={styles.board}>
        {columns.map((col) => (
          <SkillColumn
            key={col.id}
            id={col.id}
            name={col.name}
            category={col.category}
            isUncategorized={col.id === UNCAT}
            count={(items[col.id] || []).length}
            skills={(items[col.id] || [])
              .map((sid) => skillMap[sid])
              .filter(Boolean)}
            addValue={addInputs[col.id] || ""}
            onAddChange={(v) => onAddChange(col.id, v)}
            onAddSubmit={() => onAddSubmit(col.id)}
            onEditCategory={onEditCategory}
            onDeleteCategory={onDeleteCategory}
            onEditSkill={onEditSkill}
            onDeleteSkill={onDeleteSkill}
          />
        ))}

        <button className={styles.addColumn} onClick={onAddCategory}>
          + 카테고리 추가
        </button>
      </div>

      <DragOverlay>
        {activeSkill ? <SkillCardOverlay name={activeSkill.name} /> : null}
      </DragOverlay>
    </DndContext>
  );
};
