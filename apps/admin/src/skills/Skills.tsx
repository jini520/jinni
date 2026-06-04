import { useState, useEffect, useRef } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
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
  ErrorBanner,
  Spinner,
  Modal,
  Form,
  FormField,
  FormActions,
  Button,
} from "../components";
import styles from "./skills.module.scss";
import { SkillCardOverlay } from "./components/SkillCard";
import { SkillColumn } from "./components/SkillColumn";
import { SkillFormModal } from "./components/SkillFormModal";

const UNCAT = "__uncategorized__";
type ModalType = "skill" | "category" | null;

const Skills = () => {
  const [skillMap, setSkillMap] = useState<Record<string, SkillDto>>({});
  const [items, setItems] = useState<Record<string, string[]>>({});
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [addInputs, setAddInputs] = useState<Record<string, string>>({});
  const [activeId, setActiveId] = useState<string | null>(null);

  // 모달
  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingSkill, setEditingSkill] = useState<SkillDto | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryDto | null>(null);
  const [categoryForm, setCategoryForm] = useState<CategoryRequestDto>({ name: "", order: 0 });
  const nameInputRef = useRef<HTMLInputElement>(null);

  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (modalType) {
      const timer = setTimeout(() => nameInputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [modalType]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sRes, cRes] = await Promise.all([
        skillsApi.getAllSkills(),
        categoriesApi.getCategories(),
      ]);
      const sk: SkillDto[] = sRes.data.data.skills || [];
      const cats: CategoryDto[] = cRes.data.data || [];

      const map: Record<string, SkillDto> = {};
      sk.forEach((s) => (map[s.id] = s));
      setSkillMap(map);
      setCategories(cats);

      const it: Record<string, string[]> = {};
      cats.forEach((c) => (it[c.id] = []));
      it[UNCAT] = [];
      [...sk]
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .forEach((s) => {
          const cid = s.categoryId && it[s.categoryId] ? s.categoryId : UNCAT;
          it[cid].push(s.id);
        });
      setItems(it);
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

  // ── DnD ────────────────────────────────────────────────────────────────
  const findContainer = (id: string): string | undefined => {
    const cur = itemsRef.current;
    if (id in cur) return id;
    return Object.keys(cur).find((k) => cur[k].includes(id));
  };

  const handleDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id));

  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over) return;
    const a = String(active.id);
    const o = String(over.id);
    const ac = findContainer(a);
    const oc = findContainer(o);
    if (!ac || !oc || ac === oc) return;

    setItems((prev) => {
      const aItems = prev[ac];
      const oItems = prev[oc];
      const overIndex = o in prev ? oItems.length : oItems.indexOf(o);
      const newIndex = overIndex === -1 ? oItems.length : overIndex;
      return {
        ...prev,
        [ac]: aItems.filter((x) => x !== a),
        [oc]: [...oItems.slice(0, newIndex), a, ...oItems.slice(newIndex)],
      };
    });
  };

  const persist = async (board: Record<string, string[]>) => {
    const updates: Promise<unknown>[] = [];
    const nextMap = { ...skillMap };
    Object.keys(board).forEach((cId) => {
      const desiredCat = cId === UNCAT ? "" : cId;
      board[cId].forEach((sid, index) => {
        const s = skillMap[sid];
        if (!s) return;
        const curCat = s.categoryId || "";
        if (curCat !== desiredCat || (s.order ?? 0) !== index) {
          updates.push(
            skillsApi.updateSkill(sid, {
              name: s.name,
              categoryId: desiredCat,
              order: index,
            })
          );
          nextMap[sid] = { ...s, categoryId: desiredCat, order: index };
        }
      });
    });
    if (!updates.length) return;
    setSkillMap(nextMap);
    try {
      await Promise.all(updates);
    } catch (err) {
      setError("순서 변경에 실패했습니다.");
      console.error(err);
      loadData();
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveId(null);
    if (!over) return;
    const a = String(active.id);
    const o = String(over.id);
    const oc = findContainer(o);
    if (!oc) return;

    const cur = itemsRef.current;
    let next = cur;
    const arr = cur[oc];
    const oldIndex = arr.indexOf(a);
    const newIndex = o in cur ? arr.length - 1 : arr.indexOf(o);
    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      next = { ...cur, [oc]: arrayMove(arr, oldIndex, newIndex) };
      setItems(next);
    }
    persist(next);
  };

  // ── 인라인 추가 ──────────────────────────────────────────────────────────
  const submitAdd = async (containerId: string) => {
    const name = (addInputs[containerId] || "").trim();
    if (!name) return;
    try {
      await skillsApi.createSkill({
        name,
        order: (items[containerId] || []).length,
        categoryId: containerId === UNCAT ? "" : containerId,
      });
      setAddInputs((p) => ({ ...p, [containerId]: "" }));
      loadData();
    } catch (err) {
      setError("스킬 추가에 실패했습니다.");
      console.error(err);
    }
  };

  // ── 스킬 모달 ────────────────────────────────────────────────────────────
  const handleEditSkill = (skill: SkillDto) => {
    setEditingSkill(skill);
    setModalType("skill");
  };

  const handleSaveSkill = async (data: SkillRequestDto) => {
    if (!editingSkill) return;
    try {
      await skillsApi.updateSkill(editingSkill.id, data);
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

  // ── 카테고리 모달 ────────────────────────────────────────────────────────
  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ name: "", order: categories.length });
    setModalType("category");
  };

  const handleEditCategory = (category: CategoryDto) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name, order: category.order || 0 });
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
    if (!confirm("정말 삭제하시겠습니까? 해당 카테고리의 스킬은 미분류로 이동됩니다.")) return;
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

  const sortedCategories = [...categories].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  const totalSkills = Object.keys(skillMap).length;

  const columns: { id: string; name: string; category: CategoryDto | null }[] = [
    ...sortedCategories.map((c) => ({ id: c.id, name: c.name, category: c })),
  ];
  if ((items[UNCAT]?.length ?? 0) > 0) {
    columns.push({ id: UNCAT, name: "미분류", category: null });
  }

  const activeSkill = activeId ? skillMap[activeId] : null;

  return (
    <Page wide fill>
      <PageHeader
        title="Skills 관리"
        subtitle={`스킬 ${totalSkills} · 카테고리 ${categories.length}개 — 카드를 드래그해 순서·카테고리를 바꿀 수 있습니다`}
        actions={<Button onClick={handleAddCategory}>+ 카테고리</Button>}
      />

      <ErrorBanner message={error} />

      {loading ? (
        <Spinner />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className={styles.board}>
            {columns.map((col) => (
              <SkillColumn
                key={col.id}
                id={col.id}
                name={col.name}
                category={col.category}
                isUncategorized={col.id === UNCAT}
                count={(items[col.id] || []).length}
                skills={(items[col.id] || []).map((sid) => skillMap[sid]).filter(Boolean)}
                addValue={addInputs[col.id] || ""}
                onAddChange={(v) => setAddInputs((p) => ({ ...p, [col.id]: v }))}
                onAddSubmit={() => submitAdd(col.id)}
                onEditCategory={handleEditCategory}
                onDeleteCategory={handleDeleteCategory}
                onEditSkill={handleEditSkill}
                onDeleteSkill={handleDeleteSkill}
              />
            ))}

            <button className={styles.addColumn} onClick={handleAddCategory}>
              + 카테고리 추가
            </button>
          </div>

          <DragOverlay>
            {activeSkill ? <SkillCardOverlay name={activeSkill.name} /> : null}
          </DragOverlay>
        </DndContext>
      )}

      <SkillFormModal
        open={modalType === "skill"}
        skill={editingSkill}
        categories={sortedCategories}
        onSubmit={handleSaveSkill}
        onClose={closeModal}
      />

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
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              placeholder="Frontend, Backend 등"
              required
            />
          </FormField>
          <FormField label="표시 순서">
            <input
              type="number"
              min="0"
              value={categoryForm.order}
              onChange={(e) => setCategoryForm({ ...categoryForm, order: parseInt(e.target.value) || 0 })}
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
