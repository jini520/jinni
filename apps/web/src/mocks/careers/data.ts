import type { Careers } from "@/api/careers.types";

export const mockCareers: Careers = {
  businesses: [
    {
      id: "ff3bd3e2-a374-4213-9c5b-1f34aa056ca2",
      startDate: "24.06.",
      endDate: "25.02.",
      company: "Connecting Point",
      department: "스타트업",
      position: "Frontend Developer",
      skills: [
        "react",
        "reactnative",
        "javascript",
        "typescript",
        "redux",
        "sass",
        "github",
        "vite",
      ],
      details: [
        "React, Typescript 기반 타이어 중개 판매 서비스 개발",
        "인증/로그인 기능 구현",
        "크로스 플랫폼 기능 확장",
      ],
    },
    {
      id: "028125c3-c489-45fb-940b-560a4215da49",
      startDate: "23.08.",
      endDate: "24.05.",
      company: "Fasoo",
      department: "개발센터",
      position: "개발 센터, Frontend Developer",
      skills: ["react", "javascript", "typescript", "redux", "sass", "gitlab"],
      details: [
        "React, Typescript 기반 LLM 제품 신규 개발",
        "LLM 텍스트 스트리밍 모듈 개발",
        "채팅 데이터 관리 최적화",
        "컴포넌트 재사용성 강화",
      ],
    },
  ],
  projects: [
    {
      id: "55f4b952-a7a4-4b90-9f09-da151f461ce9",
      startDate: "22.04.",
      endDate: "22.05.",
      company: "Tooliv",
      department: "삼성 청년 SW 아카데미",
      position: "Frontend Developer",
      skills: [
        "javascript",
        "typescript",
        "react",
        "nextjs",
        "electron",
        "recoil",
        "gitlab",
        "jira",
      ],
    },
  ],
};
