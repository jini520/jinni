import type {
  DragEndEvent,
  SensorDescriptor,
  SensorOptions,
} from "@dnd-kit/core";
import { formatYearMonth } from "@jinni/ui";
import { SortableList } from "@/components/common/SortableList";
import { CertificationCard } from "../CertificationCard";

interface CertItem {
  id: string;
  name: string;
  date?: string;
  organization?: string;
  tier?: string;
}

export const CertificationList = <T extends CertItem>({
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
      <CertificationCard
        key={item.id}
        id={item.id}
        title={item.name}
        date={formatYearMonth(item.date)}
        organization={item.organization}
        tier={item.tier}
        onEdit={() => onEdit(item)}
        onDelete={() => onDelete(item.id)}
      />
    )}
  />
);
