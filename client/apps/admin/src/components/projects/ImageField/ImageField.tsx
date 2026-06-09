import { useRef, type ChangeEvent } from "react";
import { FormField, Button } from "@/components/common";
import styles from "./image-field.module.scss";

// 상세 페이지(useProjectDetail)가 주입하는 콘텐츠 이미지 처리 핸들러.
// upload/remove는 갱신된 URL 목록을 돌려주고(실패 시 null), 모달이 폼에 반영한다.
export interface ProjectImageHandlers {
  uploading: boolean;
  copiedIndex: number | null;
  fullUrl: (url: string) => string;
  upload: (file: File) => Promise<string[] | null>;
  remove: (url: string) => Promise<string[] | null>;
  copy: (url: string, index: number) => void;
}

export const ImageField = ({
  urls,
  setUrls,
  handlers,
}: {
  urls: string[];
  setUrls: (urls: string[]) => void;
  handlers: ProjectImageHandlers;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const next = await handlers.upload(file);
    if (next) setUrls(next);
  };

  const onDelete = async (url: string) => {
    const next = await handlers.remove(url);
    if (next) setUrls(next);
  };

  return (
    <FormField label="콘텐츠 이미지">
      <div className={styles.fieldGroup}>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onSelect}
          hidden
          disabled={handlers.uploading}
        />
        <div>
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
            disabled={handlers.uploading}
          >
            {handlers.uploading ? "업로드 중…" : "이미지 추가"}
          </Button>
        </div>
        {urls.length > 0 && (
          <ul className={styles.imageList}>
            {urls.map((url, idx) => (
              <li key={idx} className={styles.imageItem}>
                <span className={styles.imageUrl} title={handlers.fullUrl(url)}>
                  {handlers.fullUrl(url)}
                </span>
                <div className={styles.imageUrlActions}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handlers.copy(url, idx)}
                  >
                    {handlers.copiedIndex === idx ? "복사됨!" : "URL 복사"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={styles.danger}
                    onClick={() => onDelete(url)}
                  >
                    삭제
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </FormField>
  );
};
