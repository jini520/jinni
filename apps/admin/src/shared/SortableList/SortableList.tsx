import type { ReactNode } from "react";
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
import { Toolbar, EmptyState, Button } from "../../components";
import styles from "./sortable-list.module.scss";

// 툴바 + 빈 상태 + 세로 드래그 리스트 셸. 카드 렌더는 renderItem에 위임.
export const SortableList = <T extends { id: string }>({
  items,
  sensors,
  toolbarTitle,
  addLabel,
  emptyMessage,
  emptyActionLabel,
  onAdd,
  onDragEnd,
  renderItem,
}: {
  items: T[];
  sensors: SensorDescriptor<SensorOptions>[];
  toolbarTitle: string;
  addLabel: string;
  emptyMessage: string;
  emptyActionLabel: string;
  onAdd: () => void;
  onDragEnd: (event: DragEndEvent) => void;
  renderItem: (item: T) => ReactNode;
}) => (
  <>
    <Toolbar title={toolbarTitle}>
      <Button onClick={onAdd}>{addLabel}</Button>
    </Toolbar>

    {items.length === 0 ? (
      <EmptyState
        message={emptyMessage}
        action={<Button onClick={onAdd}>{emptyActionLabel}</Button>}
      />
    ) : (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className={styles.list}>{items.map(renderItem)}</div>
        </SortableContext>
      </DndContext>
    )}
  </>
);
