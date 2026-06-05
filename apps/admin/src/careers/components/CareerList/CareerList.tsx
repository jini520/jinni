import type {
  DragEndEvent,
  SensorDescriptor,
  SensorOptions,
} from "@dnd-kit/core";
import type { CareerDto } from "../../../@types";
import { SortableList } from "../../../shared/SortableList";
import { CareerCard } from "../CareerCard";

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
  <SortableList
    items={items}
    sensors={sensors}
    toolbarTitle={toolbarTitle}
    addLabel={addLabel}
    emptyMessage={emptyMessage}
    emptyActionLabel="첫 경력 추가하기"
    onAdd={onAdd}
    onDragEnd={onDragEnd}
    renderItem={(item) => (
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
    )}
  />
);
