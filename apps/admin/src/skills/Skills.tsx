import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
} from "@dnd-kit/core";
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
  Button,
} from "../components";
import { useSkillBoard, UNCAT } from "./useSkillBoard";
import { SkillColumn } from "./components/SkillColumn";
import { SkillCardOverlay } from "./components/SkillCard";
import { SkillFormModal } from "./components/SkillFormModal";
import { CategoryFormModal } from "./components/CategoryFormModal";
import styles from "./skills.module.scss";

type ModalType = "skill" | "category" | null;

const Skills = () => {
  const board = useSkillBoard();

  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingSkill, setEditingSkill] = useState<SkillDto | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryDto | null>(
    null
  );

  const openSkillModal = (skill: SkillDto) => {
    setEditingSkill(skill);
    setModalType("skill");
  };
  const openAddCategory = () => {
    setEditingCategory(null);
    setModalType("category");
  };
  const openEditCategory = (category: CategoryDto) => {
    setEditingCategory(category);
    setModalType("category");
  };
  const closeModal = () => {
    setModalType(null);
    setEditingSkill(null);
    setEditingCategory(null);
  };

  const handleSaveSkill = async (data: SkillRequestDto) => {
    if (!editingSkill) return;
    if (await board.saveSkill(editingSkill.id, data)) closeModal();
  };
  const handleSaveCategory = async (data: CategoryRequestDto) => {
    if (await board.saveCategory(editingCategory, data)) closeModal();
  };

  return (
    <Page wide fill>
      <PageHeader
        title="Skills 관리"
        subtitle={`스킬 ${board.totalSkills} · 카테고리 ${board.categories.length}개 — 카드를 드래그해 순서·카테고리를 바꿀 수 있습니다`}
        actions={<Button onClick={openAddCategory}>+ 카테고리</Button>}
      />

      <ErrorBanner message={board.error} />

      {board.loading ? (
        <Spinner />
      ) : (
        <DndContext
          sensors={board.sensors}
          collisionDetection={closestCorners}
          onDragStart={board.onDragStart}
          onDragOver={board.onDragOver}
          onDragEnd={board.onDragEnd}
        >
          <div className={styles.board}>
            {board.columns.map((col) => (
              <SkillColumn
                key={col.id}
                id={col.id}
                name={col.name}
                category={col.category}
                isUncategorized={col.id === UNCAT}
                count={(board.items[col.id] || []).length}
                skills={(board.items[col.id] || [])
                  .map((sid) => board.skillMap[sid])
                  .filter(Boolean)}
                addValue={board.addInputs[col.id] || ""}
                onAddChange={(v) => board.setAddInput(col.id, v)}
                onAddSubmit={() => board.submitAdd(col.id)}
                onEditCategory={openEditCategory}
                onDeleteCategory={board.deleteCategory}
                onEditSkill={openSkillModal}
                onDeleteSkill={board.deleteSkill}
              />
            ))}

            <button className={styles.addColumn} onClick={openAddCategory}>
              + 카테고리 추가
            </button>
          </div>

          <DragOverlay>
            {board.activeSkill ? (
              <SkillCardOverlay name={board.activeSkill.name} />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      <SkillFormModal
        open={modalType === "skill"}
        skill={editingSkill}
        categories={board.sortedCategories}
        onSubmit={handleSaveSkill}
        onClose={closeModal}
      />

      <CategoryFormModal
        open={modalType === "category"}
        category={editingCategory}
        defaultOrder={board.categories.length}
        onSubmit={handleSaveCategory}
        onClose={closeModal}
      />
    </Page>
  );
};

export default Skills;
