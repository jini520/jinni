// ISO 날짜(YYYY-MM-DD)를 "YYYY.MM"로 축약
const formatMonth = (date?: string): string | null =>
  date ? date.slice(0, 7).replace("-", ".") : null;

// 프로젝트 기간 "YYYY.MM ~ YYYY.MM" (시작 없으면 null, 종료 없으면 빈칸)
export const formatProjectPeriod = (
  startedAt?: string,
  endedAt?: string
): string | null => {
  const start = formatMonth(startedAt);
  if (!start) return null;
  return `${start} ~ ${formatMonth(endedAt) ?? ""}`;
};
