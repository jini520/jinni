import type { ProjectDetailDto, ProjectRequestDto } from "@/types";

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

// 상세 응답을 수정 폼 값으로 변환
export const projectToForm = (project: ProjectDetailDto): ProjectRequestDto => ({
  title: project.title,
  description: project.description || "",
  skills: project.skills || [],
  participants: project.participants || "",
  startedAt: project.startedAt || "",
  endedAt: project.endedAt || "",
  status: project.status,
  company: project.company || "",
  overview: project.overview || "",
  highlights: project.highlights || [],
  responsibilities: project.responsibilities || [],
  features: project.features || [],
  links: project.links || [],
  order: project.order ?? 0,
  contents: project.contents || "",
  contentImageUrls: project.contentImageUrls || [],
});
