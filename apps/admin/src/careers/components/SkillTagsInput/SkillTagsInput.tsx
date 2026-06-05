import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button, SortableTag } from "../../../components";
import styles from "./skill-tags-input.module.scss";

export const SkillTagsInput = ({
  skills,
  onChange,
}: {
  skills: string[];
  onChange: (next: string[]) => void;
}) => {
  const [input, setInput] = useState("");
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const addSkill = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onChange([...skills, trimmed]);
    setInput("");
  };

  const removeSkill = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    onChange(arrayMove(skills, Number(active.id), Number(over.id)));
  };

  return (
    <div className={styles.tagInput}>
      {skills.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={skills.map((_, index) => index)}
            strategy={verticalListSortingStrategy}
          >
            <div className={styles.tagsDisplay}>
              {skills.map((skill, index) => (
                <SortableTag
                  key={index}
                  id={index}
                  label={skill}
                  onRemove={() => removeSkill(index)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
      <div className={styles.tagInputRow}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSkill();
            }
          }}
          placeholder="스킬 입력 후 Enter"
        />
        <Button type="button" variant="outline" onClick={addSkill}>
          추가
        </Button>
      </div>
    </div>
  );
};
