import { Certifications } from "@/api/certifications.types";

export const mockCertifications: Certifications = {
  certifications: [
    {
      id: "1",
      name: "정보처리기사",
      date: "2022.09.",
      organization: "한국산업인력공단",
      tier: "기사",
    },
  ],
  awards: [
    {
      id: "2",
      name: "SSAFY 자율 프로젝트 우수상",
      date: "2021.02.",
      organization: "삼성전자",
      tier: "1위",
    },
    {
      id: "3",
      name: "SSAFY 특화 프로젝트 우수상",
      date: "2021.02.",
      organization: "삼성전자",
      tier: "1위",
    },
    {
      id: "4",
      name: "SSAFY 공통 프로젝트 우수상",
      date: "2021.02.",
      organization: "삼성전자",
      tier: "1위",
    },
  ],
};
