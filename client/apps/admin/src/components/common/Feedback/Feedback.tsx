import type { ReactNode } from "react";
import styles from "./feedback.module.scss";

export function ErrorBanner({ message }: { message?: string | null }) {
  if (!message) return null;
  return <div className={styles.error}>{message}</div>;
}

export function Spinner({ label = "로딩중..." }: { label?: string }) {
  return (
    <div className={styles.loading}>
      <div className={styles.spinner} />
      <p>{label}</p>
    </div>
  );
}

export function EmptyState({
  message,
  action,
}: {
  message: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className={styles.empty}>
      <p>{message}</p>
      {action}
    </div>
  );
}
