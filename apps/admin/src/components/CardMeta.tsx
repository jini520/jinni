import type { ReactNode } from "react";
import styles from "./card-meta.module.scss";

export function MetaRow({ children }: { children: ReactNode }) {
  return <div className={styles.row}>{children}</div>;
}

export function MetaItem({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <span className={styles.item}>
      {icon}
      {children}
    </span>
  );
}
