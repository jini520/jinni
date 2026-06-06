import type { ProjectRequestDto } from "@/types";

// 프로젝트 생성 폼 초기값
export const emptyProjectForm = (): ProjectRequestDto => ({
  title: "",
  description: "",
  skills: [],
  participants: "",
  startedAt: "",
  endedAt: "",
  status: undefined,
  company: "",
  overview: "",
  highlights: [],
  responsibilities: [],
  features: [],
  links: [],
  order: 0,
  contents: "",
  contentImageUrls: [],
});
