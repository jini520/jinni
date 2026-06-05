import { useEffect, useRef, useState } from "react";
import type {
  CareerProjectDto,
  CareerProjectRequestDto,
} from "../../../@types";
import {
  Modal,
  Form,
  FormField,
  FormActions,
  Button,
} from "../../../components";
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
  const [form, setForm] = useState<CareerProjectRequestDto>(emptyForm(0));
  const companyRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setForm(
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
  }, [open, project, defaultOrderIndex]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => companyRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

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
          ref={companyRef}
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
