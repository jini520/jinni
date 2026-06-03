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
import { educationsApi, educationApi } from "../api/educations";
import type { EducationDto, EducationRequestDto } from "../@types";
import {
  Page,
  PageHeader,
  Toolbar,
  ErrorBanner,
  Spinner,
  EmptyState,
  SortableCard,
  Modal,
  Form,
  FormField,
  FormRow,
  FormActions,
  Button,
  MetaRow,
  MetaItem,
  CalendarIcon,
  AwardIcon,
} from "../components";
import styles from "./educations.module.scss";

const Educations = () => {
  const [educationList, setEducationList] = useState<EducationDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 드래그 앤 드롭 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<EducationDto | null>(
    null
  );

  // 폼 상태
  const [educationForm, setEducationForm] = useState<EducationRequestDto>({
    education: "",
    startDate: "",
    endDate: "",
    status: "",
    description: "",
    orderIndex: 0,
  });

  // 입력 필드 ref (자동 포커스용)
  const educationInputRef = useRef<HTMLInputElement>(null);

  // 모달이 열릴 때 교육명 입력 필드에 포커스
  useEffect(() => {
    if (isModalOpen) {
      const timer = setTimeout(() => {
        educationInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen]);

  // 데이터 로드
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await educationsApi.getAllEducations();
      const educations = response.data.data || [];
      // orderIndex로 정렬
      const sorted = [...educations].sort((a, b) => {
        const aOrder = a.orderIndex ?? 0;
        const bOrder = b.orderIndex ?? 0;
        return aOrder - bOrder;
      });
      setEducationList(sorted);
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

  // Education CRUD
  const handleAddEducation = () => {
    setEditingEducation(null);
    setEducationForm({
      education: "",
      startDate: "",
      endDate: "",
      status: "",
      description: "",
      orderIndex: educationList.length,
    });
    setIsModalOpen(true);
  };

  const handleEditEducation = (education: EducationDto) => {
    setEditingEducation(education);
    setEducationForm({
      education: education.education || "",
      startDate: education.startDate || "",
      endDate: education.endDate || "",
      status: education.status || "",
      description: education.description || "",
      orderIndex: 0,
    });
    setIsModalOpen(true);
  };

  const handleSaveEducation = async () => {
    try {
      if (editingEducation) {
        await educationApi.updateEducation(editingEducation.id, educationForm);
      } else {
        await educationApi.createEducation(educationForm);
      }
      closeModal();
      loadData();
    } catch (err) {
      setError("저장에 실패했습니다.");
      console.error(err);
    }
  };

  const handleDeleteEducation = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await educationApi.deleteEducation(id);
      loadData();
    } catch (err) {
      setError("삭제에 실패했습니다.");
      console.error(err);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEducation(null);
  };

  // 날짜 포맷팅 (YY.MM. 형식)
  const formatPeriod = (startDate?: string, endDate?: string) => {
    if (!startDate) return "-";
    const end = endDate || "현재";
    return `${startDate} ~ ${end}`;
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

  // 드래그 종료 핸들러
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = educationList.findIndex((item) => item.id === active.id);
    const newIndex = educationList.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    // 순서 변경
    const reorderedEducations = arrayMove(educationList, oldIndex, newIndex);

    // 변경 범위 내의 항목들만 업데이트 (최소한의 API 호출)
    const startIdx = Math.min(oldIndex, newIndex);
    const endIdx = Math.max(oldIndex, newIndex);
    const itemsToUpdate = reorderedEducations.slice(startIdx, endIdx + 1);

    // 새로운 orderIndex 값 할당 및 API 호출
    const updatePromises = itemsToUpdate.map((education, relativeIndex) => {
      const newOrderIndex = startIdx + relativeIndex;
      const oldOrderIndex = educationList.findIndex(
        (e) => e.id === education.id
      );

      // 순서가 실제로 변경된 경우만 업데이트
      if (oldOrderIndex !== newOrderIndex) {
        return educationApi.updateEducation(education.id, {
          education: education.education,
          startDate: education.startDate,
          endDate: education.endDate,
          status: education.status,
          description: education.description,
          orderIndex: newOrderIndex,
        });
      }
      return Promise.resolve();
    });

    // 낙관적 업데이트 (UI 먼저 변경)
    setEducationList(
      reorderedEducations.map((edu, index) => ({
        ...edu,
        orderIndex: index,
      }))
    );

    try {
      await Promise.all(updatePromises);
    } catch (err) {
      setError("순서 변경에 실패했습니다.");
      console.error(err);
      loadData(); // 실패 시 데이터 다시 로드
    }
  };

  return (
    <Page>
      <PageHeader title="Education 관리" subtitle="교육 이력을 관리합니다" />

      <ErrorBanner message={error} />

      {loading ? (
        <Spinner />
      ) : (
        <>
          <Toolbar title="교육 이력 목록">
            <Button onClick={handleAddEducation}>+ 교육 추가</Button>
          </Toolbar>

          {educationList.length === 0 ? (
            <EmptyState
              message="등록된 교육 이력이 없습니다."
              action={
                <Button onClick={handleAddEducation}>첫 교육 추가하기</Button>
              }
            />
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={educationList.map((edu) => edu.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className={styles.list}>
                  {educationList.map((education) => (
                    <SortableCard
                      key={education.id}
                      id={education.id}
                      title={education.education}
                      onEdit={() => handleEditEducation(education)}
                      onDelete={() => handleDeleteEducation(education.id)}
                    >
                      {education.description && (
                        <p className={styles.desc}>{education.description}</p>
                      )}
                      <MetaRow>
                        {education.startDate && (
                          <MetaItem icon={<CalendarIcon />}>
                            {formatPeriod(
                              education.startDate,
                              education.endDate
                            )}
                          </MetaItem>
                        )}
                        {education.status && (
                          <MetaItem icon={<AwardIcon />}>
                            {education.status}
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
      )}

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={editingEducation ? "교육 수정" : "교육 추가"}
      >
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveEducation();
          }}
        >
          <FormField label="교육명" required>
            <input
              ref={educationInputRef}
              type="text"
              value={educationForm.education}
              onChange={(e) =>
                setEducationForm({
                  ...educationForm,
                  education: e.target.value,
                })
              }
              placeholder="교육명 입력"
              required
            />
          </FormField>

          <FormRow>
            <FormField label="시작일 (YY.MM.)" required>
              <input
                type="text"
                value={educationForm.startDate}
                onChange={(e) =>
                  setEducationForm({
                    ...educationForm,
                    startDate: handleDateInput(e.target.value),
                  })
                }
                placeholder="24.01."
                pattern="\d{2}\.\d{2}\."
                required
              />
            </FormField>
            <FormField label="종료일 (YY.MM.)">
              <input
                type="text"
                value={educationForm.endDate}
                onChange={(e) =>
                  setEducationForm({
                    ...educationForm,
                    endDate: handleDateInput(e.target.value),
                  })
                }
                placeholder="24.12. (비워두면 현재)"
                pattern="\d{2}\.\d{2}\."
              />
            </FormField>
          </FormRow>

          <FormField label="상태" required>
            <input
              type="text"
              value={educationForm.status}
              onChange={(e) =>
                setEducationForm({
                  ...educationForm,
                  status: e.target.value,
                })
              }
              placeholder="예: 재학중, 졸업, 수료 등"
              required
            />
          </FormField>

          <FormField label="설명">
            <textarea
              value={educationForm.description}
              onChange={(e) =>
                setEducationForm({
                  ...educationForm,
                  description: e.target.value,
                })
              }
              placeholder="교육에 대한 설명을 입력하세요"
              rows={4}
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

export default Educations;
