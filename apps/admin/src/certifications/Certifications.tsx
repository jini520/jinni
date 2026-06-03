import { useState, useEffect, useRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  certificationsApi,
  certificationApi,
  awardApi,
} from "../api/certifications";
import type {
  CertificationDto,
  AwardDto,
  CertificationRequestDto,
  AwardRequestDto,
} from "../@types";
import {
  Page,
  PageHeader,
  Toolbar,
  ErrorBanner,
  Spinner,
  EmptyState,
  SortableCard,
  Modal,
  Tabs,
  Form,
  FormField,
  FormRow,
  FormActions,
  Button,
  MetaRow,
  MetaItem,
  CalendarIcon,
  BuildingIcon,
  AwardIcon,
} from "../components";
import styles from "./certifications.module.scss";

type TabType = "certifications" | "awards";
type ModalType = "certification" | "award" | null;

const Certifications = () => {
  const [certificationList, setCertificationList] = useState<
    CertificationDto[]
  >([]);
  const [awardList, setAwardList] = useState<AwardDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 드래그 앤 드롭 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 탭 상태
  const [activeTab, setActiveTab] = useState<TabType>("certifications");

  // 모달 상태
  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingCertification, setEditingCertification] =
    useState<CertificationDto | null>(null);
  const [editingAward, setEditingAward] = useState<AwardDto | null>(null);

  // 폼 상태
  const [certificationForm, setCertificationForm] =
    useState<CertificationRequestDto>({
      name: "",
      date: "",
      organization: "",
      tier: "",
      orderIndex: 0,
    });

  const [awardForm, setAwardForm] = useState<AwardRequestDto>({
    name: "",
    date: "",
    organization: "",
    tier: "",
    orderIndex: 0,
  });

  // 입력 필드 ref (자동 포커스용)
  const nameInputRef = useRef<HTMLInputElement>(null);

  // 모달이 열릴 때 이름 입력 필드에 포커스
  useEffect(() => {
    if (modalType) {
      const timer = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [modalType]);

  // 데이터 로드
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await certificationsApi.getAllCertifications();
      const certifications = response.data.data.certifications || [];
      const awards = response.data.data.awards || [];
      // orderIndex로 정렬
      const sortedCertifications = [...certifications].sort((a, b) => {
        const aOrder = a.orderIndex ?? 0;
        const bOrder = b.orderIndex ?? 0;
        return aOrder - bOrder;
      });
      const sortedAwards = [...awards].sort((a, b) => {
        const aOrder = a.orderIndex ?? 0;
        const bOrder = b.orderIndex ?? 0;
        return aOrder - bOrder;
      });
      setCertificationList(sortedCertifications);
      setAwardList(sortedAwards);
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

  // Certification CRUD
  const handleAddCertification = () => {
    setEditingCertification(null);
    setCertificationForm({
      name: "",
      date: "",
      organization: "",
      tier: "",
      orderIndex: certificationList.length,
    });
    setModalType("certification");
  };

  const handleEditCertification = (certification: CertificationDto) => {
    setEditingCertification(certification);
    setCertificationForm({
      name: certification.name || "",
      date: certification.date || "",
      organization: certification.organization || "",
      tier: certification.tier || "",
      orderIndex: 0,
    });
    setModalType("certification");
  };

  const handleSaveCertification = async () => {
    try {
      if (editingCertification) {
        await certificationApi.updateCertification(
          editingCertification.id,
          certificationForm
        );
      } else {
        await certificationApi.createCertification(certificationForm);
      }
      closeModal();
      loadData();
    } catch (err) {
      setError("저장에 실패했습니다.");
      console.error(err);
    }
  };

  const handleDeleteCertification = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await certificationApi.deleteCertification(id);
      loadData();
    } catch (err) {
      setError("삭제에 실패했습니다.");
      console.error(err);
    }
  };

  // Award CRUD
  const handleAddAward = () => {
    setEditingAward(null);
    setAwardForm({
      name: "",
      date: "",
      organization: "",
      tier: "",
      orderIndex: awardList.length,
    });
    setModalType("award");
  };

  const handleEditAward = (award: AwardDto) => {
    setEditingAward(award);
    setAwardForm({
      name: award.name || "",
      date: award.date || "",
      organization: award.organization || "",
      tier: award.tier || "",
      orderIndex: 0,
    });
    setModalType("award");
  };

  const handleSaveAward = async () => {
    try {
      if (editingAward) {
        await awardApi.updateAward(editingAward.id, awardForm);
      } else {
        await awardApi.createAward(awardForm);
      }
      closeModal();
      loadData();
    } catch (err) {
      setError("저장에 실패했습니다.");
      console.error(err);
    }
  };

  const handleDeleteAward = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await awardApi.deleteAward(id);
      loadData();
    } catch (err) {
      setError("삭제에 실패했습니다.");
      console.error(err);
    }
  };

  const closeModal = () => {
    setModalType(null);
    setEditingCertification(null);
    setEditingAward(null);
  };

  // 자격증 드래그 종료 핸들러
  const handleCertificationDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = certificationList.findIndex((item) => item.id === active.id);
    const newIndex = certificationList.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const reordered = arrayMove(certificationList, oldIndex, newIndex);

    // 변경 범위 내의 항목들만 업데이트 (최소한의 API 호출)
    const startIdx = Math.min(oldIndex, newIndex);
    const endIdx = Math.max(oldIndex, newIndex);
    const itemsToUpdate = reordered.slice(startIdx, endIdx + 1);

    const updatePromises = itemsToUpdate.map((certification, relativeIndex) => {
      const newOrderIndex = startIdx + relativeIndex;
      const oldOrderIndex = certificationList.findIndex((c) => c.id === certification.id);

      // 순서가 실제로 변경된 경우만 업데이트
      if (oldOrderIndex !== newOrderIndex) {
        return certificationApi.updateCertification(certification.id, {
          name: certification.name,
          date: certification.date,
          organization: certification.organization,
          tier: certification.tier,
          orderIndex: newOrderIndex,
        });
      }
      return Promise.resolve();
    });

    setCertificationList(reordered.map((cert, index) => ({
      ...cert,
      orderIndex: index,
    })));

    try {
      await Promise.all(updatePromises);
    } catch (err) {
      setError("순서 변경에 실패했습니다.");
      console.error(err);
      loadData();
    }
  };

  // 수상 드래그 종료 핸들러
  const handleAwardDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = awardList.findIndex((item) => item.id === active.id);
    const newIndex = awardList.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const reordered = arrayMove(awardList, oldIndex, newIndex);

    // 변경 범위 내의 항목들만 업데이트 (최소한의 API 호출)
    const startIdx = Math.min(oldIndex, newIndex);
    const endIdx = Math.max(oldIndex, newIndex);
    const itemsToUpdate = reordered.slice(startIdx, endIdx + 1);

    const updatePromises = itemsToUpdate.map((award, relativeIndex) => {
      const newOrderIndex = startIdx + relativeIndex;
      const oldOrderIndex = awardList.findIndex((a) => a.id === award.id);

      // 순서가 실제로 변경된 경우만 업데이트
      if (oldOrderIndex !== newOrderIndex) {
        return awardApi.updateAward(award.id, {
          name: award.name,
          date: award.date,
          organization: award.organization,
          tier: award.tier,
          orderIndex: newOrderIndex,
        });
      }
      return Promise.resolve();
    });

    setAwardList(reordered.map((award, index) => ({
      ...award,
      orderIndex: index,
    })));

    try {
      await Promise.all(updatePromises);
    } catch (err) {
      setError("순서 변경에 실패했습니다.");
      console.error(err);
      loadData();
    }
  };

  // 날짜 입력 핸들러 (YY.MM. 형식 자동 포맷팅)
  const handleDateInput = (value: string, maxLength = 6) => {
    // 숫자와 점만 허용
    let cleaned = value.replace(/[^\d.]/g, "");

    // 자동으로 점 추가 (2자리 입력 후, 4자리 입력 후)
    const digits = cleaned.replace(/\./g, "");
    if (digits.length >= 4) {
      cleaned = digits.substring(0, 2) + "." + digits.substring(2, 4) + ".";
    } else if (digits.length >= 2) {
      cleaned = digits.substring(0, 2) + "." + digits.substring(2);
    } else {
      cleaned = digits;
    }

    // 최대 길이 제한 (YY.MM. = 6자)
    return cleaned.substring(0, maxLength);
  };

  const isCert = activeTab === "certifications";

  return (
    <Page>
      <PageHeader
        title="Certifications 관리"
        subtitle="자격증과 수상 내역을 관리합니다"
      />

      <ErrorBanner message={error} />

      {/* 탭 */}
      <Tabs
        active={activeTab}
        onChange={setActiveTab}
        tabs={[
          { key: "certifications", label: `자격증 (${certificationList.length})` },
          { key: "awards", label: `수상 내역 (${awardList.length})` },
        ]}
      />

      {loading ? (
        <Spinner />
      ) : isCert ? (
        <>
          <Toolbar title="자격증 목록">
            <Button onClick={handleAddCertification}>+ 자격증 추가</Button>
          </Toolbar>

          {certificationList.length === 0 ? (
            <EmptyState
              message="등록된 자격증이 없습니다."
              action={
                <Button onClick={handleAddCertification}>
                  첫 자격증 추가하기
                </Button>
              }
            />
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleCertificationDragEnd}
            >
              <SortableContext
                items={certificationList.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className={styles.list}>
                  {certificationList.map((certification) => (
                    <SortableCard
                      key={certification.id}
                      id={certification.id}
                      title={certification.name}
                      onEdit={() => handleEditCertification(certification)}
                      onDelete={() => handleDeleteCertification(certification.id)}
                    >
                      <MetaRow>
                        {certification.date && (
                          <MetaItem icon={<CalendarIcon />}>
                            {certification.date}
                          </MetaItem>
                        )}
                        {certification.organization && (
                          <MetaItem icon={<BuildingIcon />}>
                            {certification.organization}
                          </MetaItem>
                        )}
                        {certification.tier && (
                          <MetaItem icon={<AwardIcon />}>
                            {certification.tier}
                          </MetaItem>
                        )}
                      </MetaRow>
                    </SortableCard>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </>
      ) : (
        <>
          <Toolbar title="수상 내역 목록">
            <Button onClick={handleAddAward}>+ 수상 내역 추가</Button>
          </Toolbar>

          {awardList.length === 0 ? (
            <EmptyState
              message="등록된 수상 내역이 없습니다."
              action={
                <Button onClick={handleAddAward}>첫 수상 내역 추가하기</Button>
              }
            />
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleAwardDragEnd}
            >
              <SortableContext
                items={awardList.map((a) => a.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className={styles.list}>
                  {awardList.map((award) => (
                    <SortableCard
                      key={award.id}
                      id={award.id}
                      title={award.name}
                      onEdit={() => handleEditAward(award)}
                      onDelete={() => handleDeleteAward(award.id)}
                    >
                      <MetaRow>
                        {award.date && (
                          <MetaItem icon={<CalendarIcon />}>
                            {award.date}
                          </MetaItem>
                        )}
                        {award.organization && (
                          <MetaItem icon={<BuildingIcon />}>
                            {award.organization}
                          </MetaItem>
                        )}
                        {award.tier && (
                          <MetaItem icon={<AwardIcon />}>{award.tier}</MetaItem>
                        )}
                      </MetaRow>
                    </SortableCard>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </>
      )}

      {/* 모달 */}
      <Modal
        open={modalType === "certification"}
        onClose={closeModal}
        title={editingCertification ? "자격증 수정" : "자격증 추가"}
      >
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveCertification();
          }}
        >
          <FormField label="자격증명" required>
            <input
              ref={modalType === "certification" ? nameInputRef : undefined}
              type="text"
              value={certificationForm.name}
              onChange={(e) =>
                setCertificationForm({
                  ...certificationForm,
                  name: e.target.value,
                })
              }
              placeholder="자격증명 입력"
              required
            />
          </FormField>

          <FormRow>
            <FormField label="취득일 (YY.MM.)" required>
              <input
                type="text"
                value={certificationForm.date}
                onChange={(e) =>
                  setCertificationForm({
                    ...certificationForm,
                    date: handleDateInput(e.target.value),
                  })
                }
                placeholder="24.01."
                pattern="\d{2}\.\d{2}\."
                required
              />
            </FormField>
            <FormField label="등급">
              <input
                type="text"
                value={certificationForm.tier}
                onChange={(e) =>
                  setCertificationForm({
                    ...certificationForm,
                    tier: e.target.value,
                  })
                }
                placeholder="1급, 2급 등"
              />
            </FormField>
          </FormRow>

          <FormField label="발급 기관">
            <input
              type="text"
              value={certificationForm.organization}
              onChange={(e) =>
                setCertificationForm({
                  ...certificationForm,
                  organization: e.target.value,
                })
              }
              placeholder="발급 기관명 입력"
            />
          </FormField>

          <FormActions>
            <Button type="button" variant="ghost" onClick={closeModal}>
              취소
            </Button>
            <Button type="submit">저장</Button>
          </FormActions>
        </Form>
      </Modal>

      <Modal
        open={modalType === "award"}
        onClose={closeModal}
        title={editingAward ? "수상 내역 수정" : "수상 내역 추가"}
      >
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveAward();
          }}
        >
          <FormField label="수상명" required>
            <input
              ref={modalType === "award" ? nameInputRef : undefined}
              type="text"
              value={awardForm.name}
              onChange={(e) =>
                setAwardForm({
                  ...awardForm,
                  name: e.target.value,
                })
              }
              placeholder="수상명 입력"
              required
            />
          </FormField>

          <FormRow>
            <FormField label="수상일 (YY.MM.)" required>
              <input
                type="text"
                value={awardForm.date}
                onChange={(e) =>
                  setAwardForm({
                    ...awardForm,
                    date: handleDateInput(e.target.value),
                  })
                }
                placeholder="24.01."
                pattern="\d{2}\.\d{2}\."
                required
              />
            </FormField>
            <FormField label="등급">
              <input
                type="text"
                value={awardForm.tier}
                onChange={(e) =>
                  setAwardForm({
                    ...awardForm,
                    tier: e.target.value,
                  })
                }
                placeholder="금상, 은상 등"
              />
            </FormField>
          </FormRow>

          <FormField label="주최 기관">
            <input
              type="text"
              value={awardForm.organization}
              onChange={(e) =>
                setAwardForm({
                  ...awardForm,
                  organization: e.target.value,
                })
              }
              placeholder="주최 기관명 입력"
            />
          </FormField>

          <FormActions>
            <Button type="button" variant="ghost" onClick={closeModal}>
              취소
            </Button>
            <Button type="submit">저장</Button>
          </FormActions>
        </Form>
      </Modal>
    </Page>
  );
};

export default Certifications;
