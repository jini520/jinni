import { arrayMove } from "@dnd-kit/sortable";
import type { DragEndEvent } from "@dnd-kit/core";

interface Orderable {
  id: string;
  orderIndex?: number;
}

// 단일 리스트 드래그 재정렬 공통 처리.
// 범위(min..max) 내 항목만 orderIndex를 갱신하고 변경분만 update로 PATCH한다(낙관적).
// 실패 시 setError + reload로 롤백.
export const useSortableReorder = (
  setError: (message: string | null) => void,
  reload: () => void
) => {
  const reorder = async <T extends Orderable>(
    list: T[],
    setList: (next: T[]) => void,
    event: DragEndEvent,
    update: (item: T, newOrderIndex: number) => Promise<unknown>
  ) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = list.findIndex((item) => item.id === active.id);
    const newIndex = list.findIndex((item) => item.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(list, oldIndex, newIndex);
    const startIndex = Math.min(oldIndex, newIndex);
    const endIndex = Math.max(oldIndex, newIndex);

    const updates = reordered
      .slice(startIndex, endIndex + 1)
      .map((item, relativeIndex) => {
        const newOrderIndex = startIndex + relativeIndex;
        const oldOrderIndex = list.findIndex((entry) => entry.id === item.id);
        return oldOrderIndex !== newOrderIndex
          ? update(item, newOrderIndex)
          : Promise.resolve();
      });

    setList(reordered.map((item, index) => ({ ...item, orderIndex: index })));

    try {
      await Promise.all(updates);
    } catch (err) {
      setError("순서 변경에 실패했습니다.");
      console.error(err);
      reload();
    }
  };

  return reorder;
};
