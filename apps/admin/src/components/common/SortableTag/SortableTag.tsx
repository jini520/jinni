import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripIcon, CloseIcon } from "../icons";
import styles from "./sortable-tag.module.scss";

// 모달 내 스택(태그) 순서 변경용 — 그립 핸들 드래그 + 삭제. 전 페이지 공통.
export function SortableTag({
  id,
  label,
  onRemove,
}: {
  id: number;
  label: string;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <span ref={setNodeRef} style={style} className={styles.tag}>
      <button
        type="button"
        className={styles.handle}
        aria-label="드래그하여 순서 변경"
        {...attributes}
        {...listeners}
      >
        <GripIcon />
      </button>
      {label}
      <button
        type="button"
        className={styles.remove}
        onClick={onRemove}
        aria-label="삭제"
      >
        <CloseIcon />
      </button>
    </span>
  );
}
