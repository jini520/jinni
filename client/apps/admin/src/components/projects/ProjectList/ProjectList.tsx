import {
  DndContext,
  DragOverlay,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
  type SensorDescriptor,
  type SensorOptions,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { ProjectListItemDto } from "@/types";
import { SortableProjectItem, ProjectCardOverlay } from "../ProjectCard";
import styles from "./project-list.module.scss";

// 프로젝트 카드 드래그 정렬 그리드 + 드래그 오버레이
export const ProjectList = ({
  projects,
  sensors,
  activeId,
  onOpen,
  onDragStart,
  onDragEnd,
}: {
  projects: ProjectListItemDto[];
  sensors: SensorDescriptor<SensorOptions>[];
  activeId: string | null;
  onOpen: (id: string) => void;
  onDragStart: (event: DragStartEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
}) => {
  const activeProject = activeId
    ? projects.find((project) => project.id === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={projects.map((project) => project.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className={styles.grid}>
          {projects.map((project) => (
            <SortableProjectItem
              key={project.id}
              project={project}
              onOpen={() => onOpen(project.id)}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeProject ? <ProjectCardOverlay project={activeProject} /> : null}
      </DragOverlay>
    </DndContext>
  );
};
