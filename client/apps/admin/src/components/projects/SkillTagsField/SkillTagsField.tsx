import { useState } from "react";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  type SensorDescriptor,
  type SensorOptions,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { FormField, Button, SortableTag } from "@/components/common";
import styles from "./skill-tags-field.module.scss";

// 스킬 입력(중복 방지는 onAdd에서) + 드래그로 순서 변경 가능한 태그 목록
export const SkillTagsField = ({
  skills,
  sensors,
  onAdd,
  onRemove,
  onReorder,
}: {
  skills: string[];
  sensors: SensorDescriptor<SensorOptions>[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  onReorder: (event: DragEndEvent) => void;
}) => {
  const [value, setValue] = useState("");

  const add = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue("");
  };

  return (
    <FormField label="기술 스택">
      <div className={styles.fieldGroup}>
        <div className={styles.inputRow}>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
            placeholder="스킬 입력 후 Enter"
          />
          <Button type="button" variant="outline" onClick={add}>
            추가
          </Button>
        </div>
        {skills.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onReorder}
          >
            <SortableContext
              items={skills.map((_, index) => index)}
              strategy={verticalListSortingStrategy}
            >
              <div className={styles.tagsEdit}>
                {skills.map((skill, idx) => (
                  <SortableTag
                    key={idx}
                    id={idx}
                    label={skill}
                    onRemove={() => onRemove(idx)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </FormField>
  );
};
