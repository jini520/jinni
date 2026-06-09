import { useState, type ReactNode } from "react";
import { FormField, Button } from "@/components/common";
import styles from "./pair-field-editor.module.scss";

// 2개 입력 + 추가 버튼 + 항목 리스트 (주요 기능: 이름/설명, 링크: 라벨/URL 공용).
// 첫 입력은 필수, 둘째는 requireBoth일 때만 필수.
export const PairFieldEditor = <T,>({
  label,
  addLabel,
  placeholders,
  items,
  renderItem,
  onAdd,
  onRemove,
  requireBoth = false,
}: {
  label: string;
  addLabel: string;
  placeholders: [string, string];
  items: T[];
  renderItem: (item: T) => ReactNode;
  onAdd: (first: string, second: string) => void;
  onRemove: (index: number) => void;
  requireBoth?: boolean;
}) => {
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");

  const add = () => {
    const a = first.trim();
    const b = second.trim();
    if (!a || (requireBoth && !b)) return;
    onAdd(a, b);
    setFirst("");
    setSecond("");
  };

  return (
    <FormField label={label}>
      <div className={styles.fieldGroup}>
        <div className={styles.twoCol}>
          <input
            type="text"
            value={first}
            onChange={(e) => setFirst(e.target.value)}
            placeholder={placeholders[0]}
          />
          <input
            type="text"
            value={second}
            onChange={(e) => setSecond(e.target.value)}
            placeholder={placeholders[1]}
          />
        </div>
        <div>
          <Button type="button" variant="outline" onClick={add}>
            {addLabel}
          </Button>
        </div>
        {items.length > 0 && (
          <ul className={styles.itemList}>
            {items.map((item, idx) => (
              <li key={idx} className={styles.item}>
                <span>{renderItem(item)}</span>
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
