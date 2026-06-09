import { useState } from "react";
import { Button } from "@/components/common";
import styles from "./details-input.module.scss";

export const DetailsInput = ({
  details,
  onChange,
}: {
  details: string[];
  onChange: (next: string[]) => void;
}) => {
  const [input, setInput] = useState("");

  const addDetail = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onChange([...details, trimmed]);
    setInput("");
  };

  const removeDetail = (index: number) => {
    onChange(details.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.tagInput}>
      <div className={styles.detailsDisplay}>
        {details.map((detail, index) => (
          <div key={index} className={styles.detailItem}>
            <span>{detail}</span>
            <button
              type="button"
              className={styles.detailRemove}
              onClick={() => removeDetail(index)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className={styles.tagInputRow}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addDetail();
            }
          }}
          placeholder="업무 내용 입력 후 Enter"
        />
        <Button type="button" variant="outline" onClick={addDetail}>
          추가
        </Button>
      </div>
    </div>
  );
};
