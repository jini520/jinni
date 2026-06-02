import type { ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@jinni/ui";
import { GripIcon } from "./icons";
import styles from "./sortable-card.module.scss";

export function SortableCard({
  id,
  title,
  aside,
  onEdit,
  onDelete,
  actions,
  children,
}: {
  id: string;
  title: ReactNode;
  aside?: ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  /** onEdit/onDelete 대신 커스텀 액션을 넣고 싶을 때 */
  actions?: ReactNode;
  children?: ReactNode;
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
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.card} ${isDragging ? styles.dragging : ""}`}
    >
      <div className={styles.header}>
        <div className={styles.handleArea} {...attributes} {...listeners}>
          <span className={styles.handle}>
            <GripIcon />
          </span>
          <span className={styles.title}>{title}</span>
          {aside && <span className={styles.aside}>{aside}</span>}
        </div>

        <div className={styles.actions}>
          {actions ?? (
            <>
              {onEdit && (
                <Button variant="ghost" size="sm" onClick={onEdit}>
                  수정
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  className={styles.danger}
                  onClick={onDelete}
                >
                  삭제
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {children && <div className={styles.body}>{children}</div>}
    </div>
  );
}
