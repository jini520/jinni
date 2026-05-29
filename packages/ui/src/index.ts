// @jejinni/ui — Shared portfolio UI

// ── Variants ────────────────────────────────────────────────────────────────
export { AuroraVariant } from './variants/aurora/Aurora';
export { ProjectModal } from './variants/aurora/ProjectModal';

// ── Components ──────────────────────────────────────────────────────────────
export { ScrollProgress } from './components/ScrollProgress';
export { MarkdownRenderer } from './components/MarkdownRenderer';

// ── Hooks ───────────────────────────────────────────────────────────────────
export { useReveal } from './hooks/useReveal';
export { useMouse } from './hooks/useMouse';
export { useScrollProgress } from './hooks/useScrollProgress';

// ── Utils ────────────────────────────────────────────────────────────────────
export { formatPeriod, calcMonths, STATUS_LABELS } from './utils/project';

// ── Data ────────────────────────────────────────────────────────────────────
export { PROFILE, LINKS } from './data/profile';
export type { ContactLink } from './data/profile';
