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
import type { CareerDto } from "../../../@types";
import { Toolbar, EmptyState, Button } from "../../../components";
import { CareerCard } from "../CareerCard";
import styles from "./career-list.module.scss";

export const CareerList = <T extends CareerDto>({
  items,
  sensors,
  toolbarTitle,
  addLabel,
  emptyMessage,
  onAdd,
  onEdit,
  onDelete,
  onDragEnd,
}: {
  items: T[];
  sensors: SensorDescriptor<SensorOptions>[];
  toolbarTitle: string;
  addLabel: string;
  emptyMessage: string;
  onAdd: () => void;
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
  onDragEnd: (event: DragEndEvent) => void;
}) => (
  <>
    <Toolbar title={toolbarTitle}>
      <Button onClick={onAdd}>{addLabel}</Button>
    </Toolbar>

    {items.length === 0 ? (
      <EmptyState
        message={emptyMessage}
        action={<Button onClick={onAdd}>첫 경력 추가하기</Button>}
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
          <div className={styles.list}>
            {items.map((item) => (
              <CareerCard
                key={item.id}
                id={item.id}
                title={item.company}
                startDate={item.startDate}
                endDate={item.endDate}
                department={item.department}
                position={item.position}
                skills={item.skills}
                details={(item as { details?: string[] }).details}
                onEdit={() => onEdit(item)}
                onDelete={() => onDelete(item.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    )}
  </>
);
