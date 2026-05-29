import type { ProjectStatus } from '@jejinni/types';

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  IN_PROGRESS: '진행 중',
  LIVE: '운영 중',
  COMPLETED: '완료',
};

/** "2025-11-01" → "2025.11" */
function toYearMonth(isoDate: string): string {
  return isoDate.substring(0, 7).replace('-', '.');
}

/** "2025.11. -"  또는  "2025.11. - 2026.05." */
export function formatPeriod(startedAt: string | null, endedAt: string | null): string {
  if (!startedAt) return '';
  const start = toYearMonth(startedAt);
  if (!endedAt) return `${start}. -`;
  return `${start}. - ${toYearMonth(endedAt)}.`;
}

/** 경과/소요 개월 수 */
export function calcMonths(startedAt: string | null, endedAt: string | null): number {
  if (!startedAt) return 0;
  const s = new Date(startedAt);
  const e = endedAt ? new Date(endedAt) : new Date();
  return (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
}
