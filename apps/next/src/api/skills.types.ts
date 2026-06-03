import type { SkillName } from '@jinni/ui';

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
  iconKey: SkillName;
}

export interface Skills {
  categories: Category[];
  skills: Skill[];
}