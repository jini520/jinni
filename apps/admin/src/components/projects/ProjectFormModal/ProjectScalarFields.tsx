import type { RefObject } from "react";
import { FormField, FormRow } from "@/components/common";
import type { ProjectRequestDto, ProjectStatus } from "@/types";

// 프로젝트 폼 상단 스칼라 입력 (제목·설명·기간·상태·참여 인원·회사·개요)
export const ProjectScalarFields = ({
  form,
  setForm,
  focusRef,
}: {
  form: ProjectRequestDto;
  setForm: (form: ProjectRequestDto) => void;
  focusRef: RefObject<HTMLInputElement | null>;
}) => (
  <>
    <FormField label="제목" required>
      <input
        ref={focusRef}
        type="text"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        placeholder="프로젝트 제목"
        required
      />
    </FormField>

    <FormField label="설명">
      <textarea
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        placeholder="프로젝트 설명"
        rows={2}
      />
    </FormField>

    <FormRow>
      <FormField label="시작일">
        <input
          type="date"
          value={form.startedAt || ""}
          onChange={(e) =>
            setForm({ ...form, startedAt: e.target.value || undefined })
          }
        />
      </FormField>
      <FormField label="종료일">
        <input
          type="date"
          value={form.endedAt || ""}
          onChange={(e) =>
            setForm({ ...form, endedAt: e.target.value || undefined })
          }
        />
      </FormField>
    </FormRow>

    <FormRow>
      <FormField label="상태">
        <select
          value={form.status || ""}
          onChange={(e) =>
            setForm({
              ...form,
              status: (e.target.value as ProjectStatus) || undefined,
            })
          }
        >
          <option value="">선택 안함</option>
          <option value="IN_PROGRESS">진행 중</option>
          <option value="LIVE">운영 중</option>
          <option value="COMPLETED">완료</option>
        </select>
      </FormField>
      <FormField label="참여 인원">
        <input
          type="text"
          value={form.participants || ""}
          onChange={(e) =>
            setForm({ ...form, participants: e.target.value || undefined })
          }
          placeholder="예: 3명, 1인 개인 프로젝트"
        />
      </FormField>
    </FormRow>

    <FormField label="회사 / 소속">
      <input
        type="text"
        value={form.company || ""}
        onChange={(e) =>
          setForm({ ...form, company: e.target.value || undefined })
        }
        placeholder="회사 또는 소속 (선택)"
      />
    </FormField>

    <FormField label="개요">
      <textarea
        value={form.overview || ""}
        onChange={(e) =>
          setForm({ ...form, overview: e.target.value || undefined })
        }
        placeholder="프로젝트 개요"
        rows={3}
      />
    </FormField>
  </>
);
