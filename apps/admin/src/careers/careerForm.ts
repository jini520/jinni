// 경력 기간 표시: "{시작} ~ {종료|현재}" (시작 없으면 "-")
export const formatPeriod = (startDate?: string, endDate?: string): string => {
  if (!startDate) return "-";
  const end = endDate || "현재";
  return `${startDate} ~ ${end}`;
};

// 날짜 입력 자동 포맷: 숫자만 추출해 "YY.MM." 형태로 변환
export const formatDateInput = (value: string, maxLength = 6): string => {
  const digits = value.replace(/[^\d.]/g, "").replace(/\./g, "");
  let formatted: string;
  if (digits.length >= 4) {
    formatted = `${digits.substring(0, 2)}.${digits.substring(2, 4)}.`;
  } else if (digits.length >= 2) {
    formatted = `${digits.substring(0, 2)}.${digits.substring(2)}`;
  } else {
    formatted = digits;
  }
  return formatted.substring(0, maxLength);
};
