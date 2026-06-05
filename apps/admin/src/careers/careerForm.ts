// 경력 기간 표시: "{시작} ~ {종료|현재}" (시작 없으면 "-")
export const formatPeriod = (startDate?: string, endDate?: string): string => {
  if (!startDate) return "-";
  const end = endDate || "현재";
  return `${startDate} ~ ${end}`;
};
