// ISO 문자열을 "YYYY.MM.DD. HH:MM"(ko-KR) 형식으로 표시
export const formatDateTime = (dateString?: string): string => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
