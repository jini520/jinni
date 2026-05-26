import { IconNames } from "@/constants/iconRegistry";

export interface Project {
  id: string;
  title: string;
  description: string;
  skills: IconNames[];
}

export interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  skills: IconNames[];
  participants: number;
  period: string;
  contents: string;
}
