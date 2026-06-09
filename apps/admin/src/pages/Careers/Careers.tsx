import { useState } from "react";
import type {
  BusinessDto,
  CareerProjectDto,
  BusinessRequestDto,
  CareerProjectRequestDto,
} from "@/types";
import { Page, PageHeader, ErrorBanner, Spinner, Tabs } from "@/components/common";
import { useCareers } from "@/hooks/useCareers";
import { CareerList } from "@/components/careers/CareerList";
import { BusinessFormModal } from "@/components/careers/BusinessFormModal";
import { CareerProjectFormModal } from "@/components/careers/CareerProjectFormModal";

type TabType = "business" | "projects";
type ModalType = "business" | "careerProject" | null;

const Careers = () => {
  const careers = useCareers();

  const [activeTab, setActiveTab] = useState<TabType>("business");
  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingBusiness, setEditingBusiness] = useState<BusinessDto | null>(
    null
  );
  const [editingProject, setEditingProject] = useState<CareerProjectDto | null>(
    null
  );

  const openAddBusiness = () => {
    setEditingBusiness(null);
    setModalType("business");
  };
  const openEditBusiness = (business: BusinessDto) => {
    setEditingBusiness(business);
    setModalType("business");
  };
  const openAddProject = () => {
    setEditingProject(null);
    setModalType("careerProject");
  };
  const openEditProject = (project: CareerProjectDto) => {
    setEditingProject(project);
    setModalType("careerProject");
  };
  const closeModal = () => {
    setModalType(null);
    setEditingBusiness(null);
    setEditingProject(null);
  };

  const handleSaveBusiness = async (data: BusinessRequestDto) => {
    if (await careers.saveBusiness(editingBusiness, data)) closeModal();
  };
  const handleSaveProject = async (data: CareerProjectRequestDto) => {
    if (await careers.saveProject(editingProject, data)) closeModal();
  };

  return (
    <Page>
      <PageHeader title="Careers 관리" subtitle="경력 정보를 관리합니다" />

      <ErrorBanner message={careers.error} />

      <Tabs
        active={activeTab}
        onChange={setActiveTab}
        tabs={[
          {
            key: "business",
            label: `업무 경력 (${careers.businessList.length})`,
          },
          {
            key: "projects",
            label: `프로젝트 경력 (${careers.projectList.length})`,
          },
        ]}
      />

      {careers.loading ? (
        <Spinner />
      ) : activeTab === "business" ? (
        <CareerList
          items={careers.businessList}
          sensors={careers.sensors}
          toolbarTitle="업무 경력 목록"
          addLabel="+ 경력 추가"
          emptyMessage="등록된 업무 경력이 없습니다."
          onAdd={openAddBusiness}
          onEdit={openEditBusiness}
          onDelete={careers.deleteBusiness}
          onDragEnd={careers.onBusinessDragEnd}
        />
      ) : (
        <CareerList
          items={careers.projectList}
          sensors={careers.sensors}
          toolbarTitle="프로젝트 경력 목록"
          addLabel="+ 경력 추가"
          emptyMessage="등록된 프로젝트 경력이 없습니다."
          onAdd={openAddProject}
          onEdit={openEditProject}
          onDelete={careers.deleteProject}
          onDragEnd={careers.onProjectDragEnd}
        />
      )}

      <BusinessFormModal
        open={modalType === "business"}
        business={editingBusiness}
        defaultOrderIndex={careers.businessList.length}
        onSubmit={handleSaveBusiness}
        onClose={closeModal}
      />

      <CareerProjectFormModal
        open={modalType === "careerProject"}
        project={editingProject}
        defaultOrderIndex={careers.projectList.length}
        onSubmit={handleSaveProject}
        onClose={closeModal}
      />
    </Page>
  );
};

export default Careers;
