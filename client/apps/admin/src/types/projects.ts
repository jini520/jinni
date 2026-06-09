export type ProjectStatus = "IN_PROGRESS" | "LIVE" | "COMPLETED";

export interface ProjectFeature {
  name: string;
  note?: string;
}

export interface ProjectLink {
  label: string;
  href: string;
}

// 프로젝트 요청 (생성/수정용)
export interface ProjectRequestDto {
  title: string;
  description?: string;
  skills?: string[];
  participants?: string;
  startedAt?: string;
  endedAt?: string;
  status?: ProjectStatus;
  company?: string;
  overview?: string;
  highlights?: string[];
  responsibilities?: string[];
  features?: ProjectFeature[];
  links?: ProjectLink[];
  order?: number;
  contents?: string;
  contentImageUrls?: string[];
}

// 프로젝트 상세
export interface ProjectDetailDto {
  id: string;
  title: string;
  description?: string;
  skills?: string[];
  participants?: string;
  startedAt?: string;
  endedAt?: string;
  status?: ProjectStatus;
  company?: string;
  overview?: string;
  highlights?: string[];
  responsibilities?: string[];
  features?: ProjectFeature[];
  links?: ProjectLink[];
  order?: number;
  contents?: string;
  contentImageUrls?: string[];
}

// 프로젝트 목록 아이템
export interface ProjectListItemDto {
  id: string;
  title: string;
  description?: string;
  skills?: string[];
  startedAt?: string;
  endedAt?: string;
  status?: ProjectStatus;
  order?: number;
}

// 프로젝트 목록 (페이지네이션)
export interface ProjectListDto {
  items: ProjectListItemDto[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
