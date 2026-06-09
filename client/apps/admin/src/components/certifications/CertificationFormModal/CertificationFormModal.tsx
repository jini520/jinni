import type { CertificationRequestDto } from "@/types";
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

interface CertItem {
  id: string;
  name: string;
  date: string;
  organization?: string;
  tier?: string;
}

type Variant = "certification" | "award";

const LABELS: Record<
  Variant,
  {
    add: string;
    edit: string;
    name: string;
    namePlaceholder: string;
    date: string;
    tierPlaceholder: string;
    org: string;
    orgPlaceholder: string;
  }
> = {
  certification: {
    add: "자격증 추가",
    edit: "자격증 수정",
    name: "자격증명",
    namePlaceholder: "자격증명 입력",
    date: "취득일 (YY.MM.)",
    tierPlaceholder: "1급, 2급 등",
    org: "발급 기관",
    orgPlaceholder: "발급 기관명 입력",
  },
  award: {
    add: "수상 내역 추가",
    edit: "수상 내역 수정",
    name: "수상명",
    namePlaceholder: "수상명 입력",
    date: "수상일 (YY.MM.)",
    tierPlaceholder: "금상, 은상 등",
    org: "주최 기관",
    orgPlaceholder: "주최 기관명 입력",
  },
};

const emptyForm = (orderIndex: number): CertificationRequestDto => ({
  name: "",
  date: "",
  organization: "",
  tier: "",
  orderIndex,
});

export const CertificationFormModal = ({
  open,
  variant,
  item,
  defaultOrderIndex,
  onSubmit,
  onClose,
}: {
  open: boolean;
  variant: Variant;
  item: CertItem | null;
  defaultOrderIndex: number;
  onSubmit: (data: CertificationRequestDto) => void;
  onClose: () => void;
}) => {
  const labels = LABELS[variant];
  const { form, setForm, focusRef } = useModalForm<CertificationRequestDto>(
    open,
    () =>
      item
        ? {
            name: item.name,
            date: item.date,
            organization: item.organization || "",
            tier: item.tier || "",
            orderIndex: 0,
          }
        : emptyForm(defaultOrderIndex)
  );

  return (
    <Modal open={open} onClose={onClose} title={item ? labels.edit : labels.add}>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(form);
        }}
      >
        <FormField label={labels.name} required>
          <input
            ref={focusRef}
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={labels.namePlaceholder}
            required
          />
        </FormField>

        <FormRow>
          <FormField label={labels.date} required>
            <input
              type="text"
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: formatDateInput(e.target.value) })
              }
              placeholder="24.01."
              pattern="\d{2}\.\d{2}\."
              required
            />
          </FormField>
          <FormField label="등급">
            <input
              type="text"
              value={form.tier}
              onChange={(e) => setForm({ ...form, tier: e.target.value })}
              placeholder={labels.tierPlaceholder}
            />
          </FormField>
        </FormRow>

        <FormField label={labels.org}>
          <input
            type="text"
            value={form.organization}
            onChange={(e) =>
              setForm({ ...form, organization: e.target.value })
            }
            placeholder={labels.orgPlaceholder}
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
