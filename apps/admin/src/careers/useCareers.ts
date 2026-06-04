import { useState, useEffect } from "react";
import { type DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { careersApi, businessApi, careerProjectApi } from "../api/careers";
import { useSortableSensors } from "../shared/useSortableSensors";
import { useResourceMutations } from "../shared/useResourceMutations";
import type {
  CareerDto,
  BusinessDto,
  CareerProjectDto,
  BusinessRequestDto,
  CareerProjectRequestDto,
} from "../@types";

const sortByOrder = <T extends CareerDto>(list: T[]): T[] =>
  [...list].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

export const useCareers = () => {
  const [businessList, setBusinessList] = useState<BusinessDto[]>([]);
  const [projectList, setProjectList] = useState<CareerProjectDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSortableSensors();

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await careersApi.getAllCareers();
      setBusinessList(sortByOrder(response.data.data.businesses || []));
      setProjectList(sortByOrder(response.data.data.projects || []));
    } catch (err) {
      setError("데이터를 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 범위 내 항목만 orderIndex를 갱신하고 변경분만 PATCH (낙관적 업데이트)
  const reorder = async <T extends CareerDto>(
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
      loadData();
    }
  };

  const onBusinessDragEnd = (event: DragEndEvent) =>
    reorder(businessList, setBusinessList, event, (business, orderIndex) =>
      businessApi.updateBusiness(business.id, {
        startDate: business.startDate,
        endDate: business.endDate,
        company: business.company,
        department: business.department,
        position: business.position,
        skills: business.skills,
        orderIndex,
        details: business.details,
      })
    );

  const onProjectDragEnd = (event: DragEndEvent) =>
    reorder(projectList, setProjectList, event, (project, orderIndex) =>
      careerProjectApi.updateCareerProject(project.id, {
        startDate: project.startDate,
        endDate: project.endDate,
        company: project.company,
        department: project.department,
        position: project.position,
        skills: project.skills,
        orderIndex,
      })
    );

  const { runSave, runDelete } = useResourceMutations(loadData, setError);

  const saveBusiness = (editing: BusinessDto | null, data: BusinessRequestDto) =>
    runSave(
      () =>
        editing
          ? businessApi.updateBusiness(editing.id, data)
          : businessApi.createBusiness(data),
      "저장에 실패했습니다."
    );

  const deleteBusiness = (id: string) =>
    runDelete(() => businessApi.deleteBusiness(id), "삭제에 실패했습니다.");

  const saveProject = (
    editing: CareerProjectDto | null,
    data: CareerProjectRequestDto
  ) =>
    runSave(
      () =>
        editing
          ? careerProjectApi.updateCareerProject(editing.id, data)
          : careerProjectApi.createCareerProject(data),
      "저장에 실패했습니다."
    );

  const deleteProject = (id: string) =>
    runDelete(() => careerProjectApi.deleteCareerProject(id), "삭제에 실패했습니다.");

  return {
    businessList,
    projectList,
    loading,
    error,
    sensors,
    reload: loadData,
    onBusinessDragEnd,
    onProjectDragEnd,
    saveBusiness,
    deleteBusiness,
    saveProject,
    deleteProject,
  };
};
