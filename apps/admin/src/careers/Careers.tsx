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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { careersApi, businessApi, careerProjectApi } from "../api/careers";
import type {
  BusinessDto,
  CareerProjectDto,
  BusinessRequestDto,
  CareerProjectRequestDto,
} from "../@types";
import {
  Page,
  PageHeader,
  Toolbar,
  Tabs,
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
  BriefcaseIcon,
  UserIcon,
} from "../components";
import styles from "./careers.module.scss";

// 드래그 가능한 스킬 태그 컴포넌트
interface SortableSkillTagProps {
  id: number;
  skill: string;
  onRemove: () => void;
}

const SortableSkillTag = ({ id, skill, onRemove }: SortableSkillTagProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <span ref={setNodeRef} style={style} className={styles.tag}>
      <span className={styles.tagHandle} {...attributes} {...listeners}>
        ⋮⋮
      </span>
      {skill}
      <button type="button" className={styles.tagRemove} onClick={onRemove}>
        ×
      </button>
    </span>
  );
};

type TabType = "business" | "projects";
type ModalType = "business" | "careerProject" | null;

const Careers = () => {
  const [businessList, setBusinessList] = useState<BusinessDto[]>([]);
  const [projectList, setProjectList] = useState<CareerProjectDto[]>([]);
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
  const [activeTab, setActiveTab] = useState<TabType>("business");

  // 모달 상태
  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingBusiness, setEditingBusiness] = useState<BusinessDto | null>(
    null
  );
  const [editingProject, setEditingProject] = useState<CareerProjectDto | null>(
    null
  );

  // 폼 상태
  const [businessForm, setBusinessForm] = useState<BusinessRequestDto>({
    startDate: "",
    endDate: "",
    company: "",
    department: "",
    position: "",
    skills: [],
    orderIndex: 0,
    details: [],
  });

  const [projectForm, setProjectForm] = useState<CareerProjectRequestDto>({
    startDate: "",
    endDate: "",
    company: "",
    department: "",
    position: "",
    skills: [],
    orderIndex: 0,
  });

  // 스킬 및 세부사항 입력용 임시 상태
  const [skillInput, setSkillInput] = useState("");
  const [detailInput, setDetailInput] = useState("");

  // 입력 필드 ref (자동 포커스용)
  const companyInputRef = useRef<HTMLInputElement>(null);

  // 모달이 열릴 때 회사 입력 필드에 포커스
  useEffect(() => {
    if (modalType) {
      const timer = setTimeout(() => {
        companyInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [modalType]);

  // 데이터 로드
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await careersApi.getAllCareers();
      const businesses = response.data.data.businesses || [];
      const projects = response.data.data.projects || [];
      // orderIndex로 정렬
      const sortedBusinesses = [...businesses].sort((a, b) => {
        const aOrder = a.orderIndex ?? 0;
        const bOrder = b.orderIndex ?? 0;
        return aOrder - bOrder;
      });
      const sortedProjects = [...projects].sort((a, b) => {
        const aOrder = a.orderIndex ?? 0;
        const bOrder = b.orderIndex ?? 0;
        return aOrder - bOrder;
      });
      setBusinessList(sortedBusinesses);
      setProjectList(sortedProjects);
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

  // Business CRUD
  const handleAddBusiness = () => {
    setEditingBusiness(null);
    setBusinessForm({
      startDate: "",
      endDate: "",
      company: "",
      department: "",
      position: "",
      skills: [],
      orderIndex: businessList.length,
      details: [],
    });
    setSkillInput("");
    setDetailInput("");
    setModalType("business");
  };

  const handleEditBusiness = (business: BusinessDto) => {
    setEditingBusiness(business);
    setBusinessForm({
      startDate: business.startDate || "",
      endDate: business.endDate || "",
      company: business.company || "",
      department: business.department || "",
      position: business.position || "",
      skills: business.skills || [],
      orderIndex: 0,
      details: business.details || [],
    });
    setSkillInput("");
    setDetailInput("");
    setModalType("business");
  };

  const handleSaveBusiness = async () => {
    try {
      if (editingBusiness) {
        await businessApi.updateBusiness(editingBusiness.id, businessForm);
      } else {
        await businessApi.createBusiness(businessForm);
      }
      closeModal();
      loadData();
    } catch (err) {
      setError("저장에 실패했습니다.");
      console.error(err);
    }
  };

  const handleDeleteBusiness = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await businessApi.deleteBusiness(id);
      loadData();
    } catch (err) {
      setError("삭제에 실패했습니다.");
      console.error(err);
    }
  };

  // Career Project CRUD
  const handleAddProject = () => {
    setEditingProject(null);
    setProjectForm({
      startDate: "",
      endDate: "",
      company: "",
      department: "",
      position: "",
      skills: [],
      orderIndex: projectList.length,
    });
    setSkillInput("");
    setModalType("careerProject");
  };

  const handleEditProject = (project: CareerProjectDto) => {
    setEditingProject(project);
    setProjectForm({
      startDate: project.startDate || "",
      endDate: project.endDate || "",
      company: project.company || "",
      department: project.department || "",
      position: project.position || "",
      skills: project.skills || [],
      orderIndex: 0,
    });
    setSkillInput("");
    setModalType("careerProject");
  };

  const handleSaveProject = async () => {
    try {
      if (editingProject) {
        await careerProjectApi.updateCareerProject(
          editingProject.id,
          projectForm
        );
      } else {
        await careerProjectApi.createCareerProject(projectForm);
      }
      closeModal();
      loadData();
    } catch (err) {
      setError("저장에 실패했습니다.");
      console.error(err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await careerProjectApi.deleteCareerProject(id);
      loadData();
    } catch (err) {
      setError("삭제에 실패했습니다.");
      console.error(err);
    }
  };

  const closeModal = () => {
    setModalType(null);
    setEditingBusiness(null);
    setEditingProject(null);
  };

  // Business 드래그 종료 핸들러
  const handleBusinessDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = businessList.findIndex((item) => item.id === active.id);
    const newIndex = businessList.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const reordered = arrayMove(businessList, oldIndex, newIndex);

    // 변경 범위 내의 항목들만 업데이트 (최소한의 API 호출)
    const startIdx = Math.min(oldIndex, newIndex);
    const endIdx = Math.max(oldIndex, newIndex);
    const itemsToUpdate = reordered.slice(startIdx, endIdx + 1);

    const updatePromises = itemsToUpdate.map((business, relativeIndex) => {
      const newOrderIndex = startIdx + relativeIndex;
      const oldOrderIndex = businessList.findIndex((b) => b.id === business.id);

      // 순서가 실제로 변경된 경우만 업데이트
      if (oldOrderIndex !== newOrderIndex) {
        return businessApi.updateBusiness(business.id, {
          startDate: business.startDate,
          endDate: business.endDate,
          company: business.company,
          department: business.department,
          position: business.position,
          skills: business.skills,
          orderIndex: newOrderIndex,
          details: business.details,
        });
      }
      return Promise.resolve();
    });

    setBusinessList(
      reordered.map((b, index) => ({
        ...b,
        orderIndex: index,
      }))
    );

    try {
      await Promise.all(updatePromises);
    } catch (err) {
      setError("순서 변경에 실패했습니다.");
      console.error(err);
      loadData();
    }
  };

  // Career Project 드래그 종료 핸들러
  const handleCareerProjectDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = projectList.findIndex((item) => item.id === active.id);
    const newIndex = projectList.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const reordered = arrayMove(projectList, oldIndex, newIndex);

    // 변경 범위 내의 항목들만 업데이트 (최소한의 API 호출)
    const startIdx = Math.min(oldIndex, newIndex);
    const endIdx = Math.max(oldIndex, newIndex);
    const itemsToUpdate = reordered.slice(startIdx, endIdx + 1);

    const updatePromises = itemsToUpdate.map((project, relativeIndex) => {
      const newOrderIndex = startIdx + relativeIndex;
      const oldOrderIndex = projectList.findIndex((p) => p.id === project.id);

      // 순서가 실제로 변경된 경우만 업데이트
      if (oldOrderIndex !== newOrderIndex) {
        return careerProjectApi.updateCareerProject(project.id, {
          startDate: project.startDate,
          endDate: project.endDate,
          company: project.company,
          department: project.department,
          position: project.position,
          skills: project.skills,
          orderIndex: newOrderIndex,
        });
      }
      return Promise.resolve();
    });

    setProjectList(
      reordered.map((p, index) => ({
        ...p,
        orderIndex: index,
      }))
    );

    try {
      await Promise.all(updatePromises);
    } catch (err) {
      setError("순서 변경에 실패했습니다.");
      console.error(err);
      loadData();
    }
  };

  // 스킬 추가/삭제 핸들러
  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    if (modalType === "business") {
      setBusinessForm({
        ...businessForm,
        skills: [...(businessForm.skills || []), skillInput.trim()],
      });
    } else {
      setProjectForm({
        ...projectForm,
        skills: [...(projectForm.skills || []), skillInput.trim()],
      });
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (index: number) => {
    if (modalType === "business") {
      setBusinessForm({
        ...businessForm,
        skills: businessForm.skills?.filter((_, i) => i !== index),
      });
    } else {
      setProjectForm({
        ...projectForm,
        skills: projectForm.skills?.filter((_, i) => i !== index),
      });
    }
  };

  // 스킬 순서 변경 핸들러 (드래그 앤 드롭)
  const handleSkillsDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIndex = Number(active.id);
    const overIndex = Number(over.id);

    if (modalType === "business") {
      const reordered = arrayMove(
        businessForm.skills || [],
        activeIndex,
        overIndex
      );
      setBusinessForm({
        ...businessForm,
        skills: reordered,
      });
    } else {
      const reordered = arrayMove(
        projectForm.skills || [],
        activeIndex,
        overIndex
      );
      setProjectForm({
        ...projectForm,
        skills: reordered,
      });
    }
  };

  // 세부사항 추가/삭제 핸들러 (Business 전용)
  const handleAddDetail = () => {
    if (!detailInput.trim()) return;
    setBusinessForm({
      ...businessForm,
      details: [...(businessForm.details || []), detailInput.trim()],
    });
    setDetailInput("");
  };

  const handleRemoveDetail = (index: number) => {
    setBusinessForm({
      ...businessForm,
      details: businessForm.details?.filter((_, i) => i !== index),
    });
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

  // 스킬 태그 입력 위젯 (business/project 공용)
  const renderSkillTags = (skills: string[] | undefined) => (
    <div className={styles.tagInput}>
      {skills && skills.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleSkillsDragEnd}
        >
          <SortableContext
            items={skills.map((_, index) => index)}
            strategy={verticalListSortingStrategy}
          >
            <div className={styles.tagsDisplay}>
              {skills.map((skill, index) => (
                <SortableSkillTag
                  key={index}
                  id={index}
                  skill={skill}
                  onRemove={() => handleRemoveSkill(index)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
      <div className={styles.tagInputRow}>
        <input
          type="text"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddSkill();
            }
          }}
          placeholder="스킬 입력 후 Enter"
        />
        <Button type="button" variant="outline" onClick={handleAddSkill}>
          추가
        </Button>
      </div>
    </div>
  );

  return (
    <Page>
      <PageHeader title="Careers 관리" subtitle="경력 정보를 관리합니다" />

      <ErrorBanner message={error} />

      <Tabs
        active={activeTab}
        onChange={setActiveTab}
        tabs={[
          { key: "business", label: `업무 경력 (${businessList.length})` },
          { key: "projects", label: `프로젝트 경력 (${projectList.length})` },
        ]}
      />

      {loading ? (
        <Spinner />
      ) : activeTab === "business" ? (
        <>
          <Toolbar title="업무 경력 목록">
            <Button onClick={handleAddBusiness}>+ 경력 추가</Button>
          </Toolbar>

          {businessList.length === 0 ? (
            <EmptyState
              message="등록된 업무 경력이 없습니다."
              action={<Button onClick={handleAddBusiness}>첫 경력 추가하기</Button>}
            />
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleBusinessDragEnd}
            >
              <SortableContext
                items={businessList.map((b) => b.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className={styles.list}>
                  {businessList.map((business) => (
                    <SortableCard
                      key={business.id}
                      id={business.id}
                      title={business.company}
                      onEdit={() => handleEditBusiness(business)}
                      onDelete={() => handleDeleteBusiness(business.id)}
                    >
                      <MetaRow>
                        {business.startDate && (
                          <MetaItem icon={<CalendarIcon />}>
                            {formatPeriod(business.startDate, business.endDate)}
                          </MetaItem>
                        )}
                        {business.department && (
                          <MetaItem icon={<BriefcaseIcon />}>
                            {business.department}
                          </MetaItem>
                        )}
                        {business.position && (
                          <MetaItem icon={<UserIcon />}>
                            {business.position}
                          </MetaItem>
                        )}
                      </MetaRow>

                      {business.skills && business.skills.length > 0 && (
                        <div className={styles.skills}>
                          {business.skills.map((skill, index) => (
                            <span key={index} className={styles.skillTag}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      {business.details && business.details.length > 0 && (
                        <div className={styles.details}>
                          <strong>업무 내용:</strong>
                          <ul>
                            {business.details.map((detail, index) => (
                              <li key={index}>{detail}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </SortableCard>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </>
      ) : (
        <>
          <Toolbar title="프로젝트 경력 목록">
            <Button onClick={handleAddProject}>+ 경력 추가</Button>
          </Toolbar>

          {projectList.length === 0 ? (
            <EmptyState
              message="등록된 프로젝트 경력이 없습니다."
              action={<Button onClick={handleAddProject}>첫 경력 추가하기</Button>}
            />
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleCareerProjectDragEnd}
            >
              <SortableContext
                items={projectList.map((p) => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className={styles.list}>
                  {projectList.map((project) => (
                    <SortableCard
                      key={project.id}
                      id={project.id}
                      title={project.company}
                      onEdit={() => handleEditProject(project)}
                      onDelete={() => handleDeleteProject(project.id)}
                    >
                      <MetaRow>
                        {project.startDate && (
                          <MetaItem icon={<CalendarIcon />}>
                            {formatPeriod(project.startDate, project.endDate)}
                          </MetaItem>
                        )}
                        {project.department && (
                          <MetaItem icon={<BriefcaseIcon />}>
                            {project.department}
                          </MetaItem>
                        )}
                        {project.position && (
                          <MetaItem icon={<UserIcon />}>
                            {project.position}
                          </MetaItem>
                        )}
                      </MetaRow>

                      {project.skills && project.skills.length > 0 && (
                        <div className={styles.skills}>
                          {project.skills.map((skill, index) => (
                            <span key={index} className={styles.skillTag}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </SortableCard>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </>
      )}

      {/* 업무 경력 모달 */}
      <Modal
        open={modalType === "business"}
        onClose={closeModal}
        title={editingBusiness ? "업무 경력 수정" : "업무 경력 추가"}
      >
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveBusiness();
          }}
        >
          <FormRow>
            <FormField label="회사명" required>
              <input
                ref={modalType === "business" ? companyInputRef : undefined}
                type="text"
                value={businessForm.company}
                onChange={(e) =>
                  setBusinessForm({ ...businessForm, company: e.target.value })
                }
                placeholder="회사명 입력"
                required
              />
            </FormField>
            <FormField label="부서">
              <input
                type="text"
                value={businessForm.department}
                onChange={(e) =>
                  setBusinessForm({
                    ...businessForm,
                    department: e.target.value,
                  })
                }
                placeholder="부서명 입력"
              />
            </FormField>
          </FormRow>

          <FormRow>
            <FormField label="시작일 (YY.MM.)" required>
              <input
                type="text"
                value={businessForm.startDate}
                onChange={(e) =>
                  setBusinessForm({
                    ...businessForm,
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
                value={businessForm.endDate}
                onChange={(e) =>
                  setBusinessForm({
                    ...businessForm,
                    endDate: handleDateInput(e.target.value),
                  })
                }
                placeholder="24.12. (비워두면 현재)"
                pattern="\d{2}\.\d{2}\."
              />
            </FormField>
          </FormRow>

          <FormField label="직책">
            <input
              type="text"
              value={businessForm.position}
              onChange={(e) =>
                setBusinessForm({ ...businessForm, position: e.target.value })
              }
              placeholder="직책 입력"
            />
          </FormField>

          <FormField label="스킬">{renderSkillTags(businessForm.skills)}</FormField>

          <FormField label="업무 내용">
            <div className={styles.tagInput}>
              <div className={styles.detailsDisplay}>
                {businessForm.details?.map((detail, index) => (
                  <div key={index} className={styles.detailItem}>
                    <span>{detail}</span>
                    <button
                      type="button"
                      className={styles.detailRemove}
                      onClick={() => handleRemoveDetail(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className={styles.tagInputRow}>
                <input
                  type="text"
                  value={detailInput}
                  onChange={(e) => setDetailInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddDetail();
                    }
                  }}
                  placeholder="업무 내용 입력 후 Enter"
                />
                <Button type="button" variant="outline" onClick={handleAddDetail}>
                  추가
                </Button>
              </div>
            </div>
          </FormField>

          <FormActions>
            <Button type="button" variant="ghost" onClick={closeModal}>
              취소
            </Button>
            <Button type="submit">저장</Button>
          </FormActions>
        </Form>
      </Modal>

      {/* 프로젝트 경력 모달 */}
      <Modal
        open={modalType === "careerProject"}
        onClose={closeModal}
        title={editingProject ? "프로젝트 경력 수정" : "프로젝트 경력 추가"}
      >
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveProject();
          }}
        >
          <FormRow>
            <FormField label="회사명" required>
              <input
                ref={modalType === "careerProject" ? companyInputRef : undefined}
                type="text"
                value={projectForm.company}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, company: e.target.value })
                }
                placeholder="회사명 입력"
                required
              />
            </FormField>
            <FormField label="부서">
              <input
                type="text"
                value={projectForm.department}
                onChange={(e) =>
                  setProjectForm({
                    ...projectForm,
                    department: e.target.value,
                  })
                }
                placeholder="부서명 입력"
              />
            </FormField>
          </FormRow>

          <FormRow>
            <FormField label="시작일 (YY.MM.)" required>
              <input
                type="text"
                value={projectForm.startDate}
                onChange={(e) =>
                  setProjectForm({
                    ...projectForm,
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
                value={projectForm.endDate}
                onChange={(e) =>
                  setProjectForm({
                    ...projectForm,
                    endDate: handleDateInput(e.target.value),
                  })
                }
                placeholder="24.12. (비워두면 현재)"
                pattern="\d{2}\.\d{2}\."
              />
            </FormField>
          </FormRow>

          <FormField label="직책">
            <input
              type="text"
              value={projectForm.position}
              onChange={(e) =>
                setProjectForm({ ...projectForm, position: e.target.value })
              }
              placeholder="직책 입력"
            />
          </FormField>

          <FormField label="스킬">{renderSkillTags(projectForm.skills)}</FormField>

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

export default Careers;
