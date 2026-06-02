import { useState, useEffect, useMemo, useRef } from "react";
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
import { skillsApi, categoriesApi } from "../api/skills";
import type {
  SkillDto,
  CategoryDto,
  SkillRequestDto,
  CategoryRequestDto,
} from "../@types";
import {
  Page,
  PageHeader,
  Toolbar,
  ErrorBanner,
  Spinner,
  EmptyState,
  Modal,
  Form,
  FormField,
  FormActions,
  Button,
} from "../components";
import styles from "./skills.module.scss";

type ModalType = "skill" | "category" | null;

// 드래그 가능한 스킬 행
interface SortableSkillItemProps {
  skill: SkillDto;
  onEdit: (skill: SkillDto) => void;
  onDelete: (id: string) => void;
}

const SortableSkillItem = ({
  skill,
  onEdit,
  onDelete,
}: SortableSkillItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: skill.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.skillRow}>
      <div className={styles.skillInfo}>
        <span className={styles.handle} {...attributes} {...listeners}>
          ⋮⋮
        </span>
        <span className={styles.skillOrder}>{skill.order ?? 0}</span>
        <span className={styles.skillName}>{skill.name}</span>
      </div>
      <div className={styles.actions}>
        <Button variant="ghost" size="sm" onClick={() => onEdit(skill)}>
          수정
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={styles.danger}
          onClick={() => onDelete(skill.id)}
        >
          삭제
        </Button>
      </div>
    </div>
  );
};

const Skills = () => {
  const [skills, setSkills] = useState<SkillDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 아코디언 상태 (열린 카테고리 ID 목록)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  // 모달 상태
  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingSkill, setEditingSkill] = useState<SkillDto | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryDto | null>(
    null
  );

  // 폼 상태
  const [skillForm, setSkillForm] = useState<SkillRequestDto>({
    name: "",
    order: 0,
    categoryId: "",
  });
  const [categoryForm, setCategoryForm] = useState<CategoryRequestDto>({
    name: "",
    order: 0,
  });

  // 이름 입력 필드 ref (자동 포커스용)
  const nameInputRef = useRef<HTMLInputElement>(null);

  // 드래그 앤 드롭 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 모달이 열릴 때 이름 입력 필드에 포커스
  useEffect(() => {
    if (modalType) {
      const timer = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [modalType]);

  // 카테고리별 스킬 그룹화
  const skillsByCategory = useMemo(() => {
    const grouped: Record<string, SkillDto[]> = {};

    categories.forEach((cat) => {
      grouped[cat.id] = [];
    });

    grouped["uncategorized"] = [];

    skills.forEach((skill) => {
      if (skill.categoryId && grouped[skill.categoryId]) {
        grouped[skill.categoryId].push(skill);
      } else {
        grouped["uncategorized"].push(skill);
      }
    });

    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) => (a.order || 0) - (b.order || 0));
    });

    return grouped;
  }, [skills, categories]);

  // 데이터 로드
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [skillsRes, categoriesRes] = await Promise.all([
        skillsApi.getAllSkills(),
        categoriesApi.getCategories(),
      ]);
      setSkills(skillsRes.data.data.skills || []);
      const loadedCategories = categoriesRes.data.data || [];
      setCategories(loadedCategories);

      setExpandedCategories(new Set(loadedCategories.map((c) => c.id)));
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

  // 드래그 앤 드롭 핸들러
  const handleDragEnd = async (event: DragEndEvent, categoryId: string) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const categorySkills = skillsByCategory[categoryId] || [];
    const oldIndex = categorySkills.findIndex((s) => s.id === active.id);
    const newIndex = categorySkills.findIndex((s) => s.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    // 순서 변경
    const reorderedSkills = arrayMove(categorySkills, oldIndex, newIndex);

    // 새로운 order 값 할당 및 API 호출
    const updatePromises = reorderedSkills.map((skill, index) => {
      if (skill.order !== index) {
        return skillsApi.updateSkill(skill.id, {
          name: skill.name,
          categoryId: skill.categoryId,
          order: index,
        });
      }
      return Promise.resolve();
    });

    // 낙관적 업데이트 (UI 먼저 변경)
    setSkills((prevSkills) => {
      const updatedSkills = prevSkills.map((skill) => {
        const reorderedIndex = reorderedSkills.findIndex(
          (s) => s.id === skill.id
        );
        if (reorderedIndex !== -1) {
          return { ...skill, order: reorderedIndex };
        }
        return skill;
      });
      return updatedSkills;
    });

    try {
      await Promise.all(updatePromises);
    } catch (err) {
      setError("순서 변경에 실패했습니다.");
      console.error(err);
      loadData(); // 실패 시 데이터 다시 로드
    }
  };

  // 아코디언 토글
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  // 모두 펼치기/접기
  const expandAll = () => {
    setExpandedCategories(
      new Set([...categories.map((c) => c.id), "uncategorized"])
    );
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
  };

  // 스킬 CRUD
  const handleAddSkill = (categoryId?: string) => {
    setEditingSkill(null);
    const categorySkills = categoryId ? skillsByCategory[categoryId] || [] : [];
    setSkillForm({
      name: "",
      order: categorySkills.length,
      categoryId: categoryId || "",
    });
    setModalType("skill");
  };

  const handleEditSkill = (skill: SkillDto) => {
    setEditingSkill(skill);
    setSkillForm({
      name: skill.name,
      order: skill.order || 0,
      categoryId: skill.categoryId || "",
    });
    setModalType("skill");
  };

  const handleSaveSkill = async () => {
    try {
      if (editingSkill) {
        await skillsApi.updateSkill(editingSkill.id, skillForm);
      } else {
        await skillsApi.createSkill(skillForm);
      }
      closeModal();
      loadData();
    } catch (err) {
      setError("스킬 저장에 실패했습니다.");
      console.error(err);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await skillsApi.deleteSkill(id);
      loadData();
    } catch (err) {
      setError("스킬 삭제에 실패했습니다.");
      console.error(err);
    }
  };

  // 카테고리 CRUD
  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ name: "", order: categories.length });
    setModalType("category");
  };

  const handleEditCategory = (category: CategoryDto) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      order: category.order || 0,
    });
    setModalType("category");
  };

  const handleSaveCategory = async () => {
    try {
      if (editingCategory) {
        await categoriesApi.updateCategory(editingCategory.id, categoryForm);
      } else {
        await categoriesApi.createCategory(categoryForm);
      }
      closeModal();
      loadData();
    } catch (err) {
      setError("카테고리 저장에 실패했습니다.");
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (
      !confirm(
        "정말 삭제하시겠습니까? 해당 카테고리의 스킬은 미분류로 이동됩니다."
      )
    )
      return;
    try {
      await categoriesApi.deleteCategory(id);
      loadData();
    } catch (err) {
      setError("카테고리 삭제에 실패했습니다.");
      console.error(err);
    }
  };

  const closeModal = () => {
    setModalType(null);
    setEditingSkill(null);
    setEditingCategory(null);
  };

  // 정렬된 카테고리 목록
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [categories]);

  // 드래그 가능한 스킬 리스트 렌더링
  const renderSortableSkillsList = (
    categorySkills: SkillDto[],
    categoryId: string
  ) => {
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) => handleDragEnd(event, categoryId)}
      >
        <SortableContext
          items={categorySkills.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className={styles.skillList}>
            {categorySkills.map((skill) => (
              <SortableSkillItem
                key={skill.id}
                skill={skill}
                onEdit={handleEditSkill}
                onDelete={handleDeleteSkill}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    );
  };

  return (
    <Page>
      <PageHeader title="Skills 관리" subtitle="스킬과 카테고리를 관리합니다" />

      <ErrorBanner message={error} />

      {loading ? (
        <Spinner />
      ) : (
        <>
          <Toolbar
            title={
              <>
                스킬 목록 ({skills.length})
                <span className={styles.count}>
                  · 카테고리 {categories.length}개
                </span>
              </>
            }
          >
            <div className={styles.headerActions}>
              <Button variant="ghost" onClick={expandAll}>
                모두 펼치기
              </Button>
              <Button variant="ghost" onClick={collapseAll}>
                모두 접기
              </Button>
              <Button variant="outline" onClick={handleAddCategory}>
                + 카테고리
              </Button>
              <Button onClick={() => handleAddSkill()}>+ 스킬 추가</Button>
            </div>
          </Toolbar>

          <p className={styles.hint}>
            💡 스킬을 드래그하여 순서를 변경할 수 있습니다
          </p>

          {categories.length === 0 && skills.length === 0 ? (
            <EmptyState
              message="등록된 스킬이 없습니다. 먼저 카테고리를 추가해보세요!"
              action={
                <Button onClick={handleAddCategory}>카테고리 추가하기</Button>
              }
            />
          ) : (
            <div className={styles.accordion}>
              {/* 카테고리별 스킬 */}
              {sortedCategories.map((category) => {
                const categorySkills = skillsByCategory[category.id] || [];
                const isExpanded = expandedCategories.has(category.id);

                return (
                  <div key={category.id} className={styles.item}>
                    <div
                      className={styles.header}
                      onClick={() => toggleCategory(category.id)}
                    >
                      <div className={styles.title}>
                        <span
                          className={`${styles.arrow} ${
                            isExpanded ? styles.arrowOpen : ""
                          }`}
                        >
                          ▶
                        </span>
                        <h3 className={styles.catName}>{category.name}</h3>
                        <span className={styles.skillCount}>
                          {categorySkills.length}개
                        </span>
                        <span className={styles.order}>
                          순서: {category.order ?? 0}
                        </span>
                      </div>
                      <div
                        className={styles.actions}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className={styles.iconBtn}
                          onClick={() => handleAddSkill(category.id)}
                          title="스킬 추가"
                        >
                          +
                        </button>
                        <button
                          className={styles.iconBtn}
                          onClick={() => handleEditCategory(category)}
                          title="카테고리 수정"
                        >
                          ✎
                        </button>
                        <button
                          className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                          onClick={() => handleDeleteCategory(category.id)}
                          title="카테고리 삭제"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className={styles.content}>
                        {categorySkills.length === 0 ? (
                          <div className={styles.emptyCategory}>
                            <p>스킬이 없습니다</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddSkill(category.id)}
                            >
                              + 스킬 추가
                            </Button>
                          </div>
                        ) : (
                          renderSortableSkillsList(categorySkills, category.id)
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* 미분류 스킬 */}
              {skillsByCategory["uncategorized"]?.length > 0 && (
                <div className={styles.item}>
                  <div
                    className={styles.header}
                    onClick={() => toggleCategory("uncategorized")}
                  >
                    <div className={styles.title}>
                      <span
                        className={`${styles.arrow} ${
                          expandedCategories.has("uncategorized")
                            ? styles.arrowOpen
                            : ""
                        }`}
                      >
                        ▶
                      </span>
                      <h3 className={styles.catName}>미분류</h3>
                      <span className={styles.skillCount}>
                        {skillsByCategory["uncategorized"].length}개
                      </span>
                    </div>
                  </div>

                  {expandedCategories.has("uncategorized") && (
                    <div className={styles.content}>
                      {renderSortableSkillsList(
                        skillsByCategory["uncategorized"],
                        "uncategorized"
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* 스킬 모달 */}
      <Modal
        open={modalType === "skill"}
        onClose={closeModal}
        title={editingSkill ? "스킬 수정" : "스킬 추가"}
      >
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveSkill();
          }}
        >
          <FormField label="스킬 이름" required>
            <input
              ref={modalType === "skill" ? nameInputRef : undefined}
              type="text"
              value={skillForm.name}
              onChange={(e) =>
                setSkillForm({ ...skillForm, name: e.target.value })
              }
              placeholder="React, TypeScript 등"
              required
            />
          </FormField>
          <FormField label="카테고리">
            <select
              value={skillForm.categoryId}
              onChange={(e) =>
                setSkillForm({
                  ...skillForm,
                  categoryId: e.target.value,
                })
              }
            >
              <option value="">선택 안함</option>
              {sortedCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="표시 순서">
            <input
              type="number"
              min="0"
              value={skillForm.order}
              onChange={(e) =>
                setSkillForm({
                  ...skillForm,
                  order: parseInt(e.target.value),
                })
              }
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

      {/* 카테고리 모달 */}
      <Modal
        open={modalType === "category"}
        onClose={closeModal}
        title={editingCategory ? "카테고리 수정" : "카테고리 추가"}
      >
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveCategory();
          }}
        >
          <FormField label="카테고리 이름" required>
            <input
              ref={modalType === "category" ? nameInputRef : undefined}
              type="text"
              value={categoryForm.name}
              onChange={(e) =>
                setCategoryForm({
                  ...categoryForm,
                  name: e.target.value,
                })
              }
              placeholder="Frontend, Backend 등"
              required
            />
          </FormField>
          <FormField label="표시 순서">
            <input
              type="number"
              min="0"
              value={categoryForm.order}
              onChange={(e) =>
                setCategoryForm({
                  ...categoryForm,
                  order: parseInt(e.target.value),
                })
              }
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

export default Skills;
