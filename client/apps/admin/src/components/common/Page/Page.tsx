import type { ReactNode } from "react";
import styles from "./page.module.scss";

export function Page({
  children,
  wide,
  fill,
}: {
  children: ReactNode;
  wide?: boolean;
  fill?: boolean;
}) {
  return (
    <div
      className={`${styles.page} ${wide ? styles.wide : ""} ${
        fill ? styles.fill : ""
      }`}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {actions && <div>{actions}</div>}
    </header>
  );
}

export function Toolbar({
  title,
  children,
}: {
  title?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className={styles.toolbar}>
      {title && <h2 className={styles.toolbarTitle}>{title}</h2>}
      {children}
    </div>
  );
}
