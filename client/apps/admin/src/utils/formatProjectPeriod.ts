import { formatYearMonth } from "@jinni/ui";

// 프로젝트 기간 "2024. 3. ~ 2024. 6." (시작 없으면 null, 종료 없으면 빈칸)
export const formatProjectPeriod = (
  startedAt?: string,
  endedAt?: string
): string | null => {
  if (!startedAt) return null;
  return `${formatYearMonth(startedAt)} ~ ${formatYearMonth(endedAt)}`;
};
