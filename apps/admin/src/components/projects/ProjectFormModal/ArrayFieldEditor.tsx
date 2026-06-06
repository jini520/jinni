import { useState } from "react";
import { FormField, Button } from "@/components/common";
import styles from "./project-form.module.scss";

// 단일 텍스트 입력 + Enter/버튼 추가 + 삭제 가능한 항목 리스트 (하이라이트·담당역할 공용)
export const ArrayFieldEditor = ({
  label,
  items,
  onAdd,
  onRemove,
  placeholder = "항목 입력 후 Enter",
}: {
  label: string;
  items: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  placeholder?: string;
}) => {
  const [value, setValue] = useState("");

  const add = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue("");
  };

  return (
    <FormField label={label}>
      <div className={styles.fieldGroup}>
        <div className={styles.inputRow}>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
            placeholder={placeholder}
          />
          <Button type="button" variant="outline" onClick={add}>
            추가
          </Button>
        </div>
        {items.length > 0 && (
          <ul className={styles.itemList}>
            {items.map((item, idx) => (
              <li key={idx} className={styles.item}>
                <span>{item}</span>
                <button
                  type="button"
                  className={styles.itemRemove}
                  onClick={() => onRemove(idx)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </FormField>
  );
};
