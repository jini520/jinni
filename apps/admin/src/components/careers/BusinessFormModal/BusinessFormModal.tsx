import type { BusinessDto, BusinessRequestDto } from "@/types";
import {
  Modal,
  Form,
  FormField,
  FormActions,
  Button,
} from "@/components/common";
import { useModalForm } from "@/hooks/useModalForm";
import { CareerFields } from "../CareerFields";
import { SkillTagsInput } from "../SkillTagsInput";
import { DetailsInput } from "../DetailsInput";

const emptyForm = (orderIndex: number): BusinessRequestDto => ({
  startDate: "",
  endDate: "",
  company: "",
  department: "",
  position: "",
  skills: [],
  orderIndex,
  details: [],
});

export const BusinessFormModal = ({
  open,
  business,
  defaultOrderIndex,
  onSubmit,
  onClose,
}: {
  open: boolean;
  business: BusinessDto | null;
  defaultOrderIndex: number;
  onSubmit: (data: BusinessRequestDto) => void;
  onClose: () => void;
}) => {
  const { form, setForm, focusRef } = useModalForm<BusinessRequestDto>(open, () =>
    business
      ? {
          startDate: business.startDate || "",
          endDate: business.endDate || "",
          company: business.company || "",
          department: business.department || "",
          position: business.position || "",
          skills: business.skills || [],
          orderIndex: 0,
          details: business.details || [],
        }
      : emptyForm(defaultOrderIndex)
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={business ? "업무 경력 수정" : "업무 경력 추가"}
    >
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(form);
        }}
      >
        <CareerFields
          ref={focusRef}
          value={form}
          onChange={(patch) => setForm({ ...form, ...patch })}
        />

        <FormField label="스킬">
          <SkillTagsInput
            skills={form.skills || []}
            onChange={(skills) => setForm({ ...form, skills })}
          />
        </FormField>

        <FormField label="업무 내용">
          <DetailsInput
            details={form.details || []}
            onChange={(details) => setForm({ ...form, details })}
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
