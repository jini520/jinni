// 바이트를 사람이 읽기 좋은 단위로 표시 (예: 1536 -> "1.5 KB")
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const base = 1024;
  const units = ["Bytes", "KB", "MB", "GB"];
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(base));
  return (
    Math.round((bytes / Math.pow(base, unitIndex)) * 100) / 100 +
    " " +
    units[unitIndex]
  );
};
