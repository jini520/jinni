import { useState } from "react";
import type {
  CertificationDto,
  AwardDto,
  CertificationRequestDto,
  AwardRequestDto,
} from "@/types";
import { Page, PageHeader, ErrorBanner, Spinner, Tabs } from "@/components/common";
import { useCertifications } from "@/hooks/useCertifications";
import { CertificationList } from "@/components/certifications/CertificationList";
import { CertificationFormModal } from "@/components/certifications/CertificationFormModal";

type TabType = "certifications" | "awards";
type ModalType = "certification" | "award" | null;

const Certifications = () => {
  const certs = useCertifications();

  const [activeTab, setActiveTab] = useState<TabType>("certifications");
  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingCertification, setEditingCertification] =
    useState<CertificationDto | null>(null);
  const [editingAward, setEditingAward] = useState<AwardDto | null>(null);

  const openAddCertification = () => {
    setEditingCertification(null);
    setModalType("certification");
  };
  const openEditCertification = (certification: CertificationDto) => {
    setEditingCertification(certification);
    setModalType("certification");
  };
  const openAddAward = () => {
    setEditingAward(null);
    setModalType("award");
  };
  const openEditAward = (award: AwardDto) => {
    setEditingAward(award);
    setModalType("award");
  };
  const closeModal = () => {
    setModalType(null);
    setEditingCertification(null);
    setEditingAward(null);
  };

  const handleSaveCertification = async (data: CertificationRequestDto) => {
    if (await certs.saveCertification(editingCertification, data)) closeModal();
  };
  const handleSaveAward = async (data: AwardRequestDto) => {
    if (await certs.saveAward(editingAward, data)) closeModal();
  };

  return (
    <Page>
      <PageHeader
        title="Certifications 관리"
        subtitle="자격증과 수상 내역을 관리합니다"
      />

      <ErrorBanner message={certs.error} />

      <Tabs
        active={activeTab}
        onChange={setActiveTab}
        tabs={[
          {
            key: "certifications",
            label: `자격증 (${certs.certificationList.length})`,
          },
          { key: "awards", label: `수상 내역 (${certs.awardList.length})` },
        ]}
      />

      {certs.loading ? (
        <Spinner />
      ) : activeTab === "certifications" ? (
        <CertificationList
          items={certs.certificationList}
          sensors={certs.sensors}
          toolbarTitle="자격증 목록"
          addLabel="+ 자격증 추가"
          emptyMessage="등록된 자격증이 없습니다."
          emptyActionLabel="첫 자격증 추가하기"
          onAdd={openAddCertification}
          onEdit={openEditCertification}
          onDelete={certs.deleteCertification}
          onDragEnd={certs.onCertificationDragEnd}
        />
      ) : (
        <CertificationList
          items={certs.awardList}
          sensors={certs.sensors}
          toolbarTitle="수상 내역 목록"
          addLabel="+ 수상 내역 추가"
          emptyMessage="등록된 수상 내역이 없습니다."
          emptyActionLabel="첫 수상 내역 추가하기"
          onAdd={openAddAward}
          onEdit={openEditAward}
          onDelete={certs.deleteAward}
          onDragEnd={certs.onAwardDragEnd}
        />
      )}

      <CertificationFormModal
        open={modalType === "certification"}
        variant="certification"
        item={editingCertification}
        defaultOrderIndex={certs.certificationList.length}
        onSubmit={handleSaveCertification}
        onClose={closeModal}
      />

      <CertificationFormModal
        open={modalType === "award"}
        variant="award"
        item={editingAward}
        defaultOrderIndex={certs.awardList.length}
        onSubmit={handleSaveAward}
        onClose={closeModal}
      />
    </Page>
  );
};

export default Certifications;
