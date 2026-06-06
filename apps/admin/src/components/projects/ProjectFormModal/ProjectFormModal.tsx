import { arrayMove } from "@dnd-kit/sortable";
import type { DragEndEvent } from "@dnd-kit/core";
import MDEditor from "@uiw/react-md-editor";
import type { ProjectRequestDto } from "@/types";
import {
  Modal,
  Form,
  FormField,
  FormActions,
  Button,
} from "@/components/common";
import { useModalForm } from "@/hooks/useModalForm";
import { useSortableSensors } from "@/hooks/useSortableSensors";
import { ProjectScalarFields } from "./ProjectScalarFields";
import { ArrayFieldEditor } from "./ArrayFieldEditor";
import { PairFieldEditor } from "./PairFieldEditor";
import { SkillTagsField } from "./SkillTagsField";
import styles from "./project-form.module.scss";
import "@uiw/react-md-editor/markdown-editor.css";

// 프로젝트 생성/수정 공용 폼 모달. projectForm 상태와 배열 필드 핸들러를 모두 보유한다.
export const ProjectFormModal = ({
  open,
  title,
  initial,
  onSubmit,
  onClose,
}: {
  open: boolean;
  title: string;
  initial: ProjectRequestDto;
  onSubmit: (form: ProjectRequestDto) => void;
  onClose: () => void;
}) => {
  const { form, setForm, focusRef } = useModalForm<ProjectRequestDto>(
    open,
    () => initial
  );
  const sensors = useSortableSensors();

  const addHighlight = (value: string) =>
    setForm({ ...form, highlights: [...(form.highlights ?? []), value] });
  const removeHighlight = (index: number) =>
    setForm({ ...form, highlights: form.highlights?.filter((_, i) => i !== index) });

  const addResponsibility = (value: string) =>
    setForm({
      ...form,
      responsibilities: [...(form.responsibilities ?? []), value],
    });
  const removeResponsibility = (index: number) =>
    setForm({
      ...form,
      responsibilities: form.responsibilities?.filter((_, i) => i !== index),
    });

  const addFeature = (name: string, note: string) =>
    setForm({
      ...form,
      features: [...(form.features ?? []), { name, note: note || undefined }],
    });
  const removeFeature = (index: number) =>
    setForm({ ...form, features: form.features?.filter((_, i) => i !== index) });

  const addLink = (label: string, href: string) =>
    setForm({ ...form, links: [...(form.links ?? []), { label, href }] });
  const removeLink = (index: number) =>
    setForm({ ...form, links: form.links?.filter((_, i) => i !== index) });

  const addSkill = (value: string) => {
    if (form.skills?.includes(value)) return;
    setForm({ ...form, skills: [...(form.skills ?? []), value] });
  };
  const removeSkill = (index: number) =>
    setForm({ ...form, skills: form.skills?.filter((_, i) => i !== index) ?? [] });
  const reorderSkills = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setForm({
      ...form,
      skills: arrayMove(form.skills ?? [], Number(active.id), Number(over.id)),
    });
  };

  const themeMode =
    document.documentElement.getAttribute("data-theme") === "dark"
      ? "dark"
      : "light";

  return (
    <Modal open={open} onClose={onClose} title={title} size="lg">
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(form);
        }}
      >
        <ProjectScalarFields form={form} setForm={setForm} focusRef={focusRef} />

        <ArrayFieldEditor
          label="주요 성과 / 하이라이트"
          items={form.highlights ?? []}
          onAdd={addHighlight}
          onRemove={removeHighlight}
        />

        <ArrayFieldEditor
          label="담당 역할"
          items={form.responsibilities ?? []}
          onAdd={addResponsibility}
          onRemove={removeResponsibility}
        />

        <PairFieldEditor
          label="주요 기능"
          addLabel="기능 추가"
          placeholders={["기능명", "설명 (선택)"]}
          items={form.features ?? []}
          renderItem={(feature) => (
            <>
              <strong>{feature.name}</strong>
              {feature.note && ` — ${feature.note}`}
            </>
          )}
          onAdd={addFeature}
          onRemove={removeFeature}
        />

        <PairFieldEditor
          label="링크"
          addLabel="링크 추가"
          placeholders={["링크 라벨 (예: GitHub)", "URL"]}
          items={form.links ?? []}
          renderItem={(link) => `${link.label} — ${link.href}`}
          onAdd={addLink}
          onRemove={removeLink}
          requireBoth
        />

        <SkillTagsField
          skills={form.skills ?? []}
          sensors={sensors}
          onAdd={addSkill}
          onRemove={removeSkill}
          onReorder={reorderSkills}
        />

        <FormField label="표시 순서">
          <input
            type="number"
            min="0"
            value={form.order ?? 0}
            onChange={(e) =>
              setForm({ ...form, order: parseInt(e.target.value) || 0 })
            }
          />
        </FormField>

        <FormField label="내용 (Markdown)">
          <div data-color-mode={themeMode} className="md-editor-wrapper">
            <MDEditor
              value={form.contents || ""}
              onChange={(value) => setForm({ ...form, contents: value || "" })}
              preview="edit"
              hideToolbar={false}
              visibleDragbar={false}
              height={400}
            />
          </div>
          <p className={styles.hint}>
            Markdown 문법을 사용하여 작성할 수 있습니다. (예: # 제목, **굵게**, `코드`)
          </p>
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
