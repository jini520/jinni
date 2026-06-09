import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type DragEvent,
  type ReactNode,
} from "react";
import { Button } from "@jinni/ui";
import { UploadIcon, DownloadIcon } from "../icons";
import styles from "./file-manager.module.scss";

export interface UploadAreaHandle {
  open: () => void;
}

export const UploadArea = forwardRef<
  UploadAreaHandle,
  {
    text: string;
    buttonLabel: string;
    uploading: boolean;
    uploadProgress: number;
    onUpload: (files: FileList | null) => void;
    disabled?: boolean;
  }
>(function UploadArea(
  { text, buttonLabel, uploading, uploadProgress, onUpload, disabled },
  ref
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => inputRef.current?.click(),
  }));

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files);
    }
  };

  return (
    <div
      className={`${styles.uploadArea} ${isDragging ? styles.dragging : ""} ${
        uploading ? styles.uploading : ""
      }`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        hidden
        disabled={uploading || disabled}
        onChange={(e) => {
          onUpload(e.target.files);
          if (inputRef.current) inputRef.current.value = "";
        }}
      />
      <div className={styles.uploadContent}>
        {uploading ? (
          <>
            <div className={styles.uploadSpinner} />
            <p className={styles.uploadText}>
              업로드 중... {uploadProgress > 0 && `${uploadProgress}%`}
            </p>
          </>
        ) : (
          <>
            <div className={styles.uploadIcon}>
              <UploadIcon />
            </div>
            <p className={styles.uploadText}>{text}</p>
            <Button
              variant="outline"
              onClick={() => inputRef.current?.click()}
              disabled={uploading || disabled}
            >
              {buttonLabel}
            </Button>
          </>
        )}
      </div>
    </div>
  );
});

export function FileRow({
  icon,
  name,
  meta,
  onDownload,
  onDelete,
  downloadDisabled,
}: {
  icon: ReactNode;
  name: string;
  meta: (string | number | false | null | undefined)[];
  onDownload: () => void;
  onDelete: () => void;
  downloadDisabled?: boolean;
}) {
  return (
    <div className={styles.item}>
      <div className={styles.info}>
        <span className={styles.icon}>{icon}</span>
        <div className={styles.details}>
          <div className={styles.name}>{name}</div>
          <div className={styles.meta}>
            {meta.filter(Boolean).map((m, i) => (
              <span key={i}>{m}</span>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.actions}>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDownload}
          disabled={downloadDisabled}
          title="다운로드"
          aria-label="다운로드"
        >
          <DownloadIcon />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={styles.danger}
          onClick={onDelete}
          title="삭제"
        >
          삭제
        </Button>
      </div>
    </div>
  );
}

export function FileList({ children }: { children: React.ReactNode }) {
  return <div className={styles.list}>{children}</div>;
}

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  const first = page === 0;
  const last = page === totalPages - 1;
  return (
    <div className={styles.pagination}>
      <button className={styles.pageBtn} onClick={() => onChange(0)} disabled={first}>
        ««
      </button>
      <button
        className={styles.pageBtn}
        onClick={() => onChange(page - 1)}
        disabled={first}
      >
        «
      </button>
      <span className={styles.pageInfo}>
        {page + 1} / {totalPages}
      </span>
      <button
        className={styles.pageBtn}
        onClick={() => onChange(page + 1)}
        disabled={last}
      >
        »
      </button>
      <button
        className={styles.pageBtn}
        onClick={() => onChange(totalPages - 1)}
        disabled={last}
      >
        »»
      </button>
    </div>
  );
}
