import type { SkillName } from '@jinni/ui';

export interface Careers {
  businesses: Business[];
  projects: Project[];
}

export interface Career {
  id: string;
  startDate: string;
  endDate: string;
  company: string;
  department: string;
  position: string;
  skills: SkillName[];
}

export interface Business extends Career {
  details: string[];
}

// Project는 Career과 동일하므로 타입 별칭 사용
export type Project = Career;