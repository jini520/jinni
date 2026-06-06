import { useState } from "react";
import type { EducationDto, EducationRequestDto } from "@/types";
import { Page, PageHeader, ErrorBanner, Spinner } from "@/components/common";
import { useEducations } from "@/hooks/useEducations";
import { EducationList } from "@/components/educations/EducationList";
import { EducationFormModal } from "@/components/educations/EducationFormModal";

const Educations = () => {
  const educations = useEducations();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<EducationDto | null>(
    null
  );

  const openAdd = () => {
    setEditingEducation(null);
    setIsModalOpen(true);
  };
  const openEdit = (education: EducationDto) => {
    setEditingEducation(education);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEducation(null);
  };

  const handleSave = async (data: EducationRequestDto) => {
    if (await educations.saveEducation(editingEducation, data)) closeModal();
  };

  return (
    <Page>
      <PageHeader title="Education 관리" subtitle="교육 이력을 관리합니다" />

      <ErrorBanner message={educations.error} />

      {educations.loading ? (
        <Spinner />
      ) : (
        <EducationList
          items={educations.educationList}
          sensors={educations.sensors}
          toolbarTitle="교육 이력 목록"
          addLabel="+ 교육 추가"
          emptyMessage="등록된 교육 이력이 없습니다."
          emptyActionLabel="첫 교육 추가하기"
          onAdd={openAdd}
          onEdit={openEdit}
          onDelete={educations.deleteEducation}
          onDragEnd={educations.onEducationDragEnd}
        />
      )}

      <EducationFormModal
        open={isModalOpen}
        item={editingEducation}
        defaultOrderIndex={educations.educationList.length}
        onSubmit={handleSave}
        onClose={closeModal}
      />
    </Page>
  );
};

export default Educations;
