import { useState, useEffect } from "react";
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { careersApi, businessApi, careerProjectApi } from "../api/careers";
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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

  const saveBusiness = async (
    editing: BusinessDto | null,
    data: BusinessRequestDto
  ): Promise<boolean> => {
    try {
      if (editing) {
        await businessApi.updateBusiness(editing.id, data);
      } else {
        await businessApi.createBusiness(data);
      }
      loadData();
      return true;
    } catch (err) {
      setError("저장에 실패했습니다.");
      console.error(err);
      return false;
    }
  };

  const deleteBusiness = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await businessApi.deleteBusiness(id);
      loadData();
    } catch (err) {
      setError("삭제에 실패했습니다.");
      console.error(err);
    }
  };

  const saveProject = async (
    editing: CareerProjectDto | null,
    data: CareerProjectRequestDto
  ): Promise<boolean> => {
    try {
      if (editing) {
        await careerProjectApi.updateCareerProject(editing.id, data);
      } else {
        await careerProjectApi.createCareerProject(data);
      }
      loadData();
      return true;
    } catch (err) {
      setError("저장에 실패했습니다.");
      console.error(err);
      return false;
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await careerProjectApi.deleteCareerProject(id);
      loadData();
    } catch (err) {
      setError("삭제에 실패했습니다.");
      console.error(err);
    }
  };

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
