import { useState } from "react";
import type {
  SkillDto,
  CategoryDto,
  SkillRequestDto,
  CategoryRequestDto,
} from "../@types";
import { Page, PageHeader, ErrorBanner, Spinner, Button } from "../components";
import { useSkillBoard } from "./useSkillBoard";
import { SkillBoard } from "./components/SkillBoard";
import { SkillFormModal } from "./components/SkillFormModal";
import { CategoryFormModal } from "./components/CategoryFormModal";

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
        <SkillBoard
          columns={board.columns}
          items={board.items}
          skillMap={board.skillMap}
          sensors={board.sensors}
          activeSkill={board.activeSkill}
          addInputs={board.addInputs}
          onDragStart={board.onDragStart}
          onDragOver={board.onDragOver}
          onDragEnd={board.onDragEnd}
          onAddChange={board.setAddInput}
          onAddSubmit={board.submitAdd}
          onAddCategory={openAddCategory}
          onEditCategory={openEditCategory}
          onDeleteCategory={board.deleteCategory}
          onEditSkill={openSkillModal}
          onDeleteSkill={board.deleteSkill}
        />
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
