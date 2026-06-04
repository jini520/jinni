import { useEffect, useRef, useState } from "react";
import type { CategoryDto, SkillDto, SkillRequestDto } from "../../../@types";
import {
  Modal,
  Form,
  FormField,
  FormActions,
  Button,
} from "../../../components";

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
  const [form, setForm] = useState<SkillRequestDto>({
    name: "",
    order: 0,
    categoryId: "",
  });
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && skill) {
      setForm({
        name: skill.name,
        order: skill.order || 0,
        categoryId: skill.categoryId || "",
      });
    }
  }, [open, skill]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => nameRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

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
            ref={nameRef}
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
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
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
