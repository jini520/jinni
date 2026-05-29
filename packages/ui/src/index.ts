// ── Atoms ────────────────────────────────────────────────────────────────────
export * from './atoms/Button';
export * from './atoms/Tag';
export * from './atoms/Badge';
export * from './atoms/Icon';
export * from './atoms/Pill';

// ── Molecules ────────────────────────────────────────────────────────────────
export * from './molecules/Chip';
export * from './molecules/Accordion';

// ── Organisms ────────────────────────────────────────────────────────────────
export * from './organisms/Nav';
export * from './organisms/Card';
export * from './organisms/Modal';
export * from './organisms/IconGrid';
export * from './organisms/ProgressBar';

// ── Hooks ────────────────────────────────────────────────────────────────────
export { useReveal }         from './hooks/useReveal';
export { useMouse }          from './hooks/useMouse';
export { useScrollProgress } from './hooks/useScrollProgress';

// ── Utils ────────────────────────────────────────────────────────────────────
export { formatPeriod, calcMonths, STATUS_LABELS } from './utils/project';

// ── Data ─────────────────────────────────────────────────────────────────────
export { PROFILE, LINKS } from './data/profile';
export type { ContactLink } from './data/profile';

// ── Legacy (deprecated) ──────────────────────────────────────────────────────
/** @deprecated use organisms/ProgressBar instead */
export { ScrollProgress } from './components/ScrollProgress';
/** @deprecated use organisms/Modal instead */
export { ProjectModal } from './variants/aurora/ProjectModal';
/** @deprecated use Theme instead */
export { AuroraVariant } from './variants/aurora/Aurora';
export { MarkdownRenderer } from './components/MarkdownRenderer';
