import type { ProjectStatus } from '@jinni/types';

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  IN_PROGRESS: '진행 중',
  LIVE: '운영 중',
  COMPLETED: '완료',
};

/** ISO 날짜("2025-11-01") → "2025. 11." (국어 규범: 마침표 뒤 공백, 월 앞자리 0 없음) */
export function formatYearMonth(isoDate?: string | null): string {
  if (!isoDate) return '';
  const [year, month] = isoDate.split('-');
  return `${year}. ${Number(month)}.`;
}

/** "2025. 11. -"  또는  "2025. 11. - 2026. 5." */
export function formatPeriod(startedAt: string | null, endedAt: string | null): string {
  if (!startedAt) return '';
  const start = formatYearMonth(startedAt);
  if (!endedAt) return `${start} -`;
  return `${start} - ${formatYearMonth(endedAt)}`;
}

/** 경과/소요 개월 수 */
export function calcMonths(startedAt: string | null, endedAt: string | null): number {
  if (!startedAt) return 0;
  const s = new Date(startedAt);
  const e = endedAt ? new Date(endedAt) : new Date();
  return (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
}
