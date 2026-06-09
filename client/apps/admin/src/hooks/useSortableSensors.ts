import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type PointerSensorOptions,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

// @dnd-kit 정렬용 포인터/키보드 센서 공통 설정.
export const useSortableSensors = (pointerOptions?: PointerSensorOptions) =>
  useSensors(
    useSensor(PointerSensor, pointerOptions),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
