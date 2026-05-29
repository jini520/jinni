import { http, HttpResponse } from "msw";
import { mockCareers } from "./data";

export const careerHandlers = [
  // 프로젝트 목록 조회 (페이지네이션)
  http.get(`${process.env.NEXT_PUBLIC_API_URL}/api/careers`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        businesses: mockCareers.businesses,
        projects: mockCareers.projects,
      },
    });
  }),
];
