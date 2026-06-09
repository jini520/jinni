import type {
  CareerProjectDto,
  CareerProjectRequestDto,
} from "@/types";
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

const emptyForm = (orderIndex: number): CareerProjectRequestDto => ({
  startDate: "",
  endDate: "",
  company: "",
  department: "",
  position: "",
  skills: [],
  orderIndex,
});

export const CareerProjectFormModal = ({
  open,
  project,
  defaultOrderIndex,
  onSubmit,
  onClose,
}: {
  open: boolean;
  project: CareerProjectDto | null;
  defaultOrderIndex: number;
  onSubmit: (data: CareerProjectRequestDto) => void;
  onClose: () => void;
}) => {
  const { form, setForm, focusRef } = useModalForm<CareerProjectRequestDto>(
    open,
    () =>
      project
        ? {
            startDate: project.startDate || "",
            endDate: project.endDate || "",
            company: project.company || "",
            department: project.department || "",
            position: project.position || "",
            skills: project.skills || [],
            orderIndex: 0,
          }
        : emptyForm(defaultOrderIndex)
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={project ? "프로젝트 경력 수정" : "프로젝트 경력 추가"}
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
