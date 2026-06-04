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

  const findContainer = (id: string): string | undefined => {
    const cur = itemsRef.current;
    if (id in cur) return id;
    return Object.keys(cur).find((k) => cur[k].includes(id));
  };

  const handleDragStart = (e: DragStartEvent) =>
    setActiveId(String(e.active.id));

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

  const setAddInput = (id: string, value: string) =>
    setAddInputs((p) => ({ ...p, [id]: value }));

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
    (a, b) => (a.order || 0) - (b.order || 0)
  );
  const totalSkills = Object.keys(skillMap).length;

  const columns: SkillBoardColumn[] = [
    ...sortedCategories.map((c) => ({ id: c.id, name: c.name, category: c })),
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
