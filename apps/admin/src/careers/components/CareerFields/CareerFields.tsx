import { forwardRef } from "react";
import { FormRow, FormField } from "../../../components";
import { formatDateInput } from "../../careerForm";

export interface CareerFieldsValue {
  company: string;
  department?: string;
  startDate: string;
  endDate?: string;
  position?: string;
}

export const CareerFields = forwardRef<
  HTMLInputElement,
  {
    value: CareerFieldsValue;
    onChange: (patch: Partial<CareerFieldsValue>) => void;
  }
>(({ value, onChange }, companyRef) => (
  <>
    <FormRow>
      <FormField label="회사명" required>
        <input
          ref={companyRef}
          type="text"
          value={value.company}
          onChange={(e) => onChange({ company: e.target.value })}
          placeholder="회사명 입력"
          required
        />
      </FormField>
      <FormField label="부서">
        <input
          type="text"
          value={value.department ?? ""}
          onChange={(e) => onChange({ department: e.target.value })}
          placeholder="부서명 입력"
        />
      </FormField>
    </FormRow>

    <FormRow>
      <FormField label="시작일 (YY.MM.)" required>
        <input
          type="text"
          value={value.startDate}
          onChange={(e) => onChange({ startDate: formatDateInput(e.target.value) })}
          placeholder="24.01."
          pattern="\d{2}\.\d{2}\."
          required
        />
      </FormField>
      <FormField label="종료일 (YY.MM.)">
        <input
          type="text"
          value={value.endDate ?? ""}
          onChange={(e) => onChange({ endDate: formatDateInput(e.target.value) })}
          placeholder="24.12. (비워두면 현재)"
          pattern="\d{2}\.\d{2}\."
        />
      </FormField>
    </FormRow>

    <FormField label="직책">
      <input
        type="text"
        value={value.position ?? ""}
        onChange={(e) => onChange({ position: e.target.value })}
        placeholder="직책 입력"
      />
    </FormField>
  </>
));

CareerFields.displayName = "CareerFields";
