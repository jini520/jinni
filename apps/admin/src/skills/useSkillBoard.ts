import { useState, useEffect, useRef } from "react";
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { skillsApi, categoriesApi } from "../api/skills";
import type {
  SkillDto,
  CategoryDto,
  SkillRequestDto,
  CategoryRequestDto,
} from "../@types";

export const UNCAT = "__uncategorized__";

export interface SkillBoardColumn {
  id: string;
  name: string;
  category: CategoryDto | null;
}

export const useSkillBoard = () => {
  const [skillMap, setSkillMap] = useState<Record<string, SkillDto>>({});
  const [items, setItems] = useState<Record<string, string[]>>({});
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addInputs, setAddInputs] = useState<Record<string, string>>({});
  const [activeId, setActiveId] = useState<string | null>(null);

  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [skillsRes, categoriesRes] = await Promise.all([
        skillsApi.getAllSkills(),
        categoriesApi.getCategories(),
      ]);
      const skills: SkillDto[] = skillsRes.data.data.skills || [];
      const loadedCategories: CategoryDto[] = categoriesRes.data.data || [];

      const skillsById: Record<string, SkillDto> = {};
      skills.forEach((skill) => (skillsById[skill.id] = skill));
      setSkillMap(skillsById);
      setCategories(loadedCategories);

      const itemsByColumn: Record<string, string[]> = {};
      loadedCategories.forEach((category) => (itemsByColumn[category.id] = []));
      itemsByColumn[UNCAT] = [];
      [...skills]
        .sort((skillA, skillB) => (skillA.order || 0) - (skillB.order || 0))
        .forEach((skill) => {
          const columnId =
            skill.categoryId && itemsByColumn[skill.categoryId]
              ? skill.categoryId
              : UNCAT;
          itemsByColumn[columnId].push(skill.id);
        });
      setItems(itemsByColumn);
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

  const findColumn = (itemId: string): string | undefined => {
    const currentItems = itemsRef.current;
    if (itemId in currentItems) return itemId;
    return Object.keys(currentItems).find((columnId) =>
      currentItems[columnId].includes(itemId)
    );
  };

  const handleDragStart = (e: DragStartEvent) =>
    setActiveId(String(e.active.id));

  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over) return;
    const activeItemId = String(active.id);
    const overItemId = String(over.id);
    const activeColumnId = findColumn(activeItemId);
    const overColumnId = findColumn(overItemId);
    if (!activeColumnId || !overColumnId || activeColumnId === overColumnId)
      return;

    setItems((prev) => {
      const activeColumnItems = prev[activeColumnId];
      const overColumnItems = prev[overColumnId];
      const overIndexRaw =
        overItemId in prev
          ? overColumnItems.length
          : overColumnItems.indexOf(overItemId);
      const insertIndex = overIndexRaw === -1 ? overColumnItems.length : overIndexRaw;
      return {
        ...prev,
        [activeColumnId]: activeColumnItems.filter(
          (itemId) => itemId !== activeItemId
        ),
        [overColumnId]: [
          ...overColumnItems.slice(0, insertIndex),
          activeItemId,
          ...overColumnItems.slice(insertIndex),
        ],
      };
    });
  };

  const persist = async (itemsByColumn: Record<string, string[]>) => {
    const updates: Promise<unknown>[] = [];
    const nextSkillMap = { ...skillMap };
    Object.keys(itemsByColumn).forEach((columnId) => {
      const desiredCategoryId = columnId === UNCAT ? "" : columnId;
      itemsByColumn[columnId].forEach((skillId, index) => {
        const skill = skillMap[skillId];
        if (!skill) return;
        const currentCategoryId = skill.categoryId || "";
        if (
          currentCategoryId !== desiredCategoryId ||
          (skill.order ?? 0) !== index
        ) {
          updates.push(
            skillsApi.updateSkill(skillId, {
              name: skill.name,
              categoryId: desiredCategoryId,
              order: index,
            })
          );
          nextSkillMap[skillId] = {
            ...skill,
            categoryId: desiredCategoryId,
            order: index,
          };
        }
      });
    });
    if (!updates.length) return;
    setSkillMap(nextSkillMap);
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
    const activeItemId = String(active.id);
    const overItemId = String(over.id);
    const overColumnId = findColumn(overItemId);
    if (!overColumnId) return;

    const currentItems = itemsRef.current;
    let nextItems = currentItems;
    const columnItems = currentItems[overColumnId];
    const oldIndex = columnItems.indexOf(activeItemId);
    const newIndex =
      overItemId in currentItems
        ? columnItems.length - 1
        : columnItems.indexOf(overItemId);
    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      nextItems = {
        ...currentItems,
        [overColumnId]: arrayMove(columnItems, oldIndex, newIndex),
      };
      setItems(nextItems);
    }
    persist(nextItems);
  };

  const setAddInput = (id: string, value: string) =>
    setAddInputs((prev) => ({ ...prev, [id]: value }));

  const submitAdd = async (columnId: string) => {
    const name = (addInputs[columnId] || "").trim();
    if (!name) return;
    try {
      await skillsApi.createSkill({
        name,
        order: (items[columnId] || []).length,
        categoryId: columnId === UNCAT ? "" : columnId,
      });
      setAddInputs((prev) => ({ ...prev, [columnId]: "" }));
      loadData();
    } catch (err) {
      setError("스킬 추가에 실패했습니다.");
      console.error(err);
    }
  };

  const saveSkill = async (
    id: string,
    data: SkillRequestDto
  ): Promise<boolean> => {
    try {
      await skillsApi.updateSkill(id, data);
      loadData();
      return true;
    } catch (err) {
      setError("스킬 저장에 실패했습니다.");
      console.error(err);
      return false;
    }
  };

  const deleteSkill = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await skillsApi.deleteSkill(id);
      loadData();
    } catch (err) {
      setError("스킬 삭제에 실패했습니다.");
      console.error(err);
    }
  };

  const saveCategory = async (
    category: CategoryDto | null,
    data: CategoryRequestDto
  ): Promise<boolean> => {
    try {
      if (category) {
        await categoriesApi.updateCategory(category.id, data);
      } else {
        await categoriesApi.createCategory(data);
      }
      loadData();
      return true;
    } catch (err) {
      setError("카테고리 저장에 실패했습니다.");
      console.error(err);
      return false;
    }
  };

  const deleteCategory = async (id: string) => {
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

  const sortedCategories = [...categories].sort(
    (categoryA, categoryB) => (categoryA.order || 0) - (categoryB.order || 0)
  );
  const totalSkills = Object.keys(skillMap).length;

  const columns: SkillBoardColumn[] = [
    ...sortedCategories.map((category) => ({
      id: category.id,
      name: category.name,
      category,
    })),
  ];
  if ((items[UNCAT]?.length ?? 0) > 0) {
    columns.push({ id: UNCAT, name: "미분류", category: null });
  }

  const activeSkill = activeId ? skillMap[activeId] : null;

  return {
    skillMap,
    items,
    categories,
    sortedCategories,
    columns,
    totalSkills,
    loading,
    error,
    sensors,
    activeSkill,
    addInputs,
    setAddInput,
    submitAdd,
    saveSkill,
    deleteSkill,
    saveCategory,
    deleteCategory,
    onDragStart: handleDragStart,
    onDragOver: handleDragOver,
    onDragEnd: handleDragEnd,
  };
};
