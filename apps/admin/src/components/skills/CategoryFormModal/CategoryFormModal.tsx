import type { CategoryDto, CategoryRequestDto } from "@/types";
import {
  Modal,
  Form,
  FormField,
  FormActions,
  Button,
} from "@/components/common";
import { useModalForm } from "@/hooks/useModalForm";

export const CategoryFormModal = ({
  open,
  category,
  defaultOrder,
  onSubmit,
  onClose,
}: {
  open: boolean;
  category: CategoryDto | null;
  defaultOrder: number;
  onSubmit: (data: CategoryRequestDto) => void;
  onClose: () => void;
}) => {
  const { form, setForm, focusRef } = useModalForm<CategoryRequestDto>(open, () =>
    category
      ? {
          name: category.name,
          nameEn: category.nameEn,
          order: category.order || 0,
        }
      : { name: "", nameEn: "", order: defaultOrder }
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={category ? "카테고리 수정" : "카테고리 추가"}
    >
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(form);
        }}
      >
        <FormField label="카테고리 이름" required>
          <input
            ref={focusRef}
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Frontend, Backend 등"
            required
          />
        </FormField>
        <FormField label="영문 이름" required>
          <input
            type="text"
            value={form.nameEn}
            onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
            placeholder="frontend, backend 등"
            required
          />
        </FormField>
        <FormField label="표시 순서">
          <input
            type="number"
            min="0"
            value={form.order}
            onChange={(e) =>
              setForm({ ...form, order: parseInt(e.target.value) || 0 })
            }
          />
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
