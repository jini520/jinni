import styles from "./project-status-badge.module.scss";

const STATUS_LABELS: Record<string, string> = {
  IN_PROGRESS: "진행 중",
  LIVE: "운영 중",
  COMPLETED: "완료",
};

const STATUS_STYLE: Record<string, string> = {
  IN_PROGRESS: styles.inProgress,
  LIVE: styles.live,
  COMPLETED: styles.completed,
};

export const ProjectStatusBadge = ({ status }: { status?: string }) => {
  if (!status) return null;
  return (
    <span className={`${styles.status} ${STATUS_STYLE[status] ?? ""}`}>
      {STATUS_LABELS[status]}
    </span>
  );
};
