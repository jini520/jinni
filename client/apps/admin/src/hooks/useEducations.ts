import { useState, useEffect } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import { educationsApi, educationApi } from "@/api/educations";
import type { EducationDto, EducationRequestDto } from "@/types";
import { useSortableSensors } from "@/hooks/useSortableSensors";
import { useResourceMutations } from "@/hooks/useResourceMutations";
import { useSortableReorder } from "@/hooks/useSortableReorder";

const sortByOrder = <T extends { orderIndex?: number }>(list: T[]): T[] =>
  [...list].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

export const useEducations = () => {
  const [educationList, setEducationList] = useState<EducationDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSortableSensors();

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await educationsApi.getAllEducations();
      setEducationList(sortByOrder(response.data.data || []));
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

  const reorder = useSortableReorder(setError, loadData);
  const { runSave, runDelete } = useResourceMutations(loadData, setError);

  const onEducationDragEnd = (event: DragEndEvent) =>
    reorder(educationList, setEducationList, event, (education, orderIndex) =>
      educationApi.updateEducation(education.id, {
        education: education.education,
        startDate: education.startDate,
        endDate: education.endDate,
        status: education.status,
        description: education.description,
        orderIndex,
      })
    );

  const saveEducation = (
    editing: EducationDto | null,
    data: EducationRequestDto
  ) =>
    runSave(
      () =>
        editing
          ? educationApi.updateEducation(editing.id, data)
          : educationApi.createEducation(data),
      "저장에 실패했습니다."
    );

  const deleteEducation = (id: string) =>
    runDelete(() => educationApi.deleteEducation(id), "삭제에 실패했습니다.");

  return {
    educationList,
    loading,
    error,
    sensors,
    reload: loadData,
    onEducationDragEnd,
    saveEducation,
    deleteEducation,
  };
};
