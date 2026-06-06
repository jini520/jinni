import type { FormEvent, ReactNode } from "react";
import styles from "./form.module.scss";

export function Form({
  onSubmit,
  children,
}: {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}) {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {children}
    </form>
  );
}

export function FormField({
  label,
  required,
  children,
}: {
  label: ReactNode;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </span>
      {children}
    </label>
  );
}

export function FormRow({ children }: { children: ReactNode }) {
  return <div className={styles.row}>{children}</div>;
}

export function FormActions({ children }: { children: ReactNode }) {
  return <div className={styles.actions}>{children}</div>;
}
