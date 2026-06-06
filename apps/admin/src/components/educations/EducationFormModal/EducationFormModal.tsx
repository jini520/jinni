import type { EducationRequestDto } from "@/types";
import {
  Modal,
  Form,
  FormField,
  FormRow,
  FormActions,
  Button,
} from "@/components/common";
import { useModalForm } from "@/hooks/useModalForm";
import { formatDateInput } from "@/utils/formatDateInput";

interface EducationItem {
  education: string;
  startDate: string;
  endDate: string;
  status: string;
  description?: string;
}

const emptyForm = (orderIndex: number): EducationRequestDto => ({
  education: "",
  startDate: "",
  endDate: "",
  status: "",
  description: "",
  orderIndex,
});

export const EducationFormModal = ({
  open,
  item,
  defaultOrderIndex,
  onSubmit,
  onClose,
}: {
  open: boolean;
  item: EducationItem | null;
  defaultOrderIndex: number;
  onSubmit: (data: EducationRequestDto) => void;
  onClose: () => void;
}) => {
  const { form, setForm, focusRef } = useModalForm<EducationRequestDto>(
    open,
    () =>
      item
        ? {
            education: item.education,
            startDate: item.startDate,
            endDate: item.endDate,
            status: item.status,
            description: item.description || "",
            orderIndex: 0,
          }
        : emptyForm(defaultOrderIndex)
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={item ? "교육 수정" : "교육 추가"}
    >
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(form);
        }}
      >
        <FormField label="교육명" required>
          <input
            ref={focusRef}
            type="text"
            value={form.education}
            onChange={(e) => setForm({ ...form, education: e.target.value })}
            placeholder="교육명 입력"
            required
          />
        </FormField>

        <FormRow>
          <FormField label="시작일 (YY.MM.)" required>
            <input
              type="text"
              value={form.startDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  startDate: formatDateInput(e.target.value),
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
              value={form.endDate}
              onChange={(e) =>
                setForm({ ...form, endDate: formatDateInput(e.target.value) })
              }
              placeholder="24.12. (비워두면 현재)"
              pattern="\d{2}\.\d{2}\."
            />
          </FormField>
        </FormRow>

        <FormField label="상태" required>
          <input
            type="text"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            placeholder="예: 재학중, 졸업, 수료 등"
            required
          />
        </FormField>

        <FormField label="설명">
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            placeholder="교육에 대한 설명을 입력하세요"
            rows={4}
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
