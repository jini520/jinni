import type {
  DragEndEvent,
  SensorDescriptor,
  SensorOptions,
} from "@dnd-kit/core";
import { SortableList } from "@/components/common/SortableList";
import { EducationCard } from "../EducationCard";

interface EducationItem {
  id: string;
  education: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  description?: string;
}

export const EducationList = <T extends EducationItem>({
  items,
  sensors,
  toolbarTitle,
  addLabel,
  emptyMessage,
  emptyActionLabel,
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
  emptyActionLabel: string;
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
    emptyActionLabel={emptyActionLabel}
    onAdd={onAdd}
    onDragEnd={onDragEnd}
    renderItem={(item) => (
      <EducationCard
        key={item.id}
        id={item.id}
        title={item.education}
        startDate={item.startDate}
        endDate={item.endDate}
        status={item.status}
        description={item.description}
        onEdit={() => onEdit(item)}
        onDelete={() => onDelete(item.id)}
      />
    )}
  />
);
