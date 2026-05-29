import { IconNames } from "@/constants/iconRegistry";

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
  iconKey: IconNames;
}

export interface Skills {
  categories: Category[];
  skills: Skill[];
}