// Shared API Types for jejinni monorepo

// ── api.types ──────────────────────────────────────────────────────────────
export interface PageResponse<T> {
  items: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // 현재 페이지 (0부터 시작)
  first: boolean;
  last: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ── skills.types ───────────────────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  order: number;
}

export interface Skill {
  id: string;
  name: string;
  order: number;
  categoryId: string;
  iconKey: string;
}

export interface Skills {
  categories: Category[];
  skills: Skill[];
}

// ── careers.types ──────────────────────────────────────────────────────────
export interface CareerBase {
  id: string;
  startDate: string;
  endDate: string;
  company: string;
  department: string;
  position: string;
  skills: string[];
}

export interface Business extends CareerBase {
  details: string[];
}

export type CareerProject = CareerBase;

export interface Careers {
  businesses: Business[];
  projects: CareerProject[];
}

// ── projects.types ─────────────────────────────────────────────────────────
export interface Project {
  id: string;
  title: string;
  description: string;
  skills: string[];
}

export interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  skills: string[];
  participants: number;
  period: string;
  contents: string;
}

// ── certifications.types ───────────────────────────────────────────────────
export interface Certification {
  id: string;
  name: string;
  date: string;
  organization: string;
  tier: string;
}

export interface Award {
  id: string;
  name: string;
  date: string;
  organization: string;
  tier: string;
}

export interface Certifications {
  certifications: Certification[];
  awards: Award[];
}

// ── edu.types ──────────────────────────────────────────────────────────────
export interface Edu {
  id: string;
  education: string;
  startDate: string;
  endDate: string;
  status: string;
  description: string;
}

// ── velog.types ────────────────────────────────────────────────────────────
export interface VelogPost {
  title: string;
  link: string;
  pubDate: string;
}

// ── portfolio.types ────────────────────────────────────────────────────────
export type Theme = 'dark' | 'light';
export type Density = 'compact' | 'regular' | 'comfy';

export interface PortfolioData {
  skills: Skills;
  careers: Careers;
  projects: Project[];
  posts: VelogPost[];
}
