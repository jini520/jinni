import { useState, useEffect } from "react";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { projectsApi } from "@/api/projects";
import type {
  ProjectListItemDto,
  ProjectRequestDto,
  ProjectStatus,
} from "@/types";
import { useSortableSensors } from "@/hooks/useSortableSensors";

export const useProjects = () => {
  const [projects, setProjects] = useState<ProjectListItemDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sensors = useSortableSensors();

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);

  const loadProjects = async (pageNum = 0) => {
    setLoading(true);
    setError(null);
    try {
      const data = (await projectsApi.getProjectList(pageNum)).data.data;
      const sorted = [...(data.items || [])].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      );
      setProjects(sorted);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
      setPage(data.number);
    } catch (err) {
      setError("프로젝트 목록을 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
    // 마운트 시 1회만 로드
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) loadProjects(newPage);
  };

  const handleDragStart = (event: DragStartEvent) =>
    setActiveId(String(event.active.id));

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = projects.findIndex((project) => project.id === active.id);
    const newIndex = projects.findIndex((project) => project.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(projects, oldIndex, newIndex).map(
      (project, index) => ({ ...project, order: index })
    );
    setProjects(reordered);

    // 변경된 범위만 업데이트
    const start = Math.min(oldIndex, newIndex);
    const end = Math.max(oldIndex, newIndex);
    const updates = [];
    for (let index = start; index <= end; index++) {
      const project = reordered[index];
      updates.push(
        projectsApi.updateProject(project.id, {
          title: project.title,
          startedAt: project.startedAt,
          endedAt: project.endedAt,
          status: project.status as ProjectStatus | undefined,
          order: index,
        })
      );
    }
    try {
      await Promise.all(updates);
    } catch (err) {
      setError("순서 변경에 실패했습니다.");
      console.error(err);
      loadProjects(page);
    }
  };

  const createProject = async (
    form: ProjectRequestDto
  ): Promise<string | null> => {
    try {
      const res = await projectsApi.createProject(form);
      return res.data.data.id;
    } catch (err) {
      setError("프로젝트 생성에 실패했습니다.");
      console.error(err);
      return null;
    }
  };

  return {
    projects,
    loading,
    error,
    sensors,
    page,
    totalPages,
    totalElements,
    activeId,
    reload: loadProjects,
    handlePageChange,
    handleDragStart,
    handleDragEnd,
    createProject,
  };
};
