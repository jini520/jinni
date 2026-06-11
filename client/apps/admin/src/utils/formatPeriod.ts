import { formatYearMonth } from "@jinni/ui";

// 기간 표시: "{시작} ~ {종료|현재}" (시작 없으면 "-")
export const formatPeriod = (startDate?: string, endDate?: string): string => {
  if (!startDate) return "-";
  const end = endDate ? formatYearMonth(endDate) : "현재";
  return `${formatYearMonth(startDate)} ~ ${end}`;
};
