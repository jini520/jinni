import { useState, useEffect } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  certificationsApi,
  certificationApi,
  awardApi,
} from "@/api/certifications";
import type {
  CertificationDto,
  AwardDto,
  CertificationRequestDto,
  AwardRequestDto,
} from "@/types";
import { useSortableSensors } from "@/hooks/useSortableSensors";
import { useResourceMutations } from "@/hooks/useResourceMutations";
import { useSortableReorder } from "@/hooks/useSortableReorder";

const sortByOrder = <T extends { orderIndex?: number }>(list: T[]): T[] =>
  [...list].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

export const useCertifications = () => {
  const [certificationList, setCertificationList] = useState<
    CertificationDto[]
  >([]);
  const [awardList, setAwardList] = useState<AwardDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSortableSensors();

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await certificationsApi.getAllCertifications();
      setCertificationList(
        sortByOrder(response.data.data.certifications || [])
      );
      setAwardList(sortByOrder(response.data.data.awards || []));
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

  const onCertificationDragEnd = (event: DragEndEvent) =>
    reorder(
      certificationList,
      setCertificationList,
      event,
      (certification, orderIndex) =>
        certificationApi.updateCertification(certification.id, {
          name: certification.name,
          date: certification.date,
          organization: certification.organization,
          tier: certification.tier,
          orderIndex,
        })
    );

  const onAwardDragEnd = (event: DragEndEvent) =>
    reorder(awardList, setAwardList, event, (award, orderIndex) =>
      awardApi.updateAward(award.id, {
        name: award.name,
        date: award.date,
        organization: award.organization,
        tier: award.tier,
        orderIndex,
      })
    );

  const saveCertification = (
    editing: CertificationDto | null,
    data: CertificationRequestDto
  ) =>
    runSave(
      () =>
        editing
          ? certificationApi.updateCertification(editing.id, data)
          : certificationApi.createCertification(data),
      "저장에 실패했습니다."
    );

  const deleteCertification = (id: string) =>
    runDelete(
      () => certificationApi.deleteCertification(id),
      "삭제에 실패했습니다."
    );

  const saveAward = (editing: AwardDto | null, data: AwardRequestDto) =>
    runSave(
      () =>
        editing
          ? awardApi.updateAward(editing.id, data)
          : awardApi.createAward(data),
      "저장에 실패했습니다."
    );

  const deleteAward = (id: string) =>
    runDelete(() => awardApi.deleteAward(id), "삭제에 실패했습니다.");

  return {
    certificationList,
    awardList,
    loading,
    error,
    sensors,
    reload: loadData,
    onCertificationDragEnd,
    onAwardDragEnd,
    saveCertification,
    deleteCertification,
    saveAward,
    deleteAward,
  };
};
