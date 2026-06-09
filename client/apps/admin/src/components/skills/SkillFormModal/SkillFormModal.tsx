import type { CategoryDto, SkillDto, SkillRequestDto } from "@/types";
import {
  Modal,
  Form,
  FormField,
  FormActions,
  Button,
} from "@/components/common";
import { useModalForm } from "@/hooks/useModalForm";

export const SkillFormModal = ({
  open,
  skill,
  categories,
  onSubmit,
  onClose,
}: {
  open: boolean;
  skill: SkillDto | null;
  categories: CategoryDto[];
  onSubmit: (data: SkillRequestDto) => void;
  onClose: () => void;
}) => {
  const { form, setForm, focusRef } = useModalForm<SkillRequestDto>(open, () =>
    skill
      ? {
          name: skill.name,
          order: skill.order || 0,
          categoryId: skill.categoryId || "",
        }
      : { name: "", order: 0, categoryId: "" }
  );

  return (
    <Modal open={open} onClose={onClose} title="스킬 수정">
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(form);
        }}
      >
        <FormField label="스킬 이름" required>
          <input
            ref={focusRef}
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="React, TypeScript 등"
            required
          />
        </FormField>
        <FormField label="카테고리">
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            <option value="">미분류</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </FormField>
        <FormActions>
          <Button type="button" variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button type="submit">저장</Button>
        </FormActions>
      </Form>
    </Modal>
  );
};
