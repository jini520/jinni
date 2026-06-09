import { http, HttpResponse } from "msw";
import { mockProjects, mockProjectDetails } from "./data";

export const projectHandlers = [
  // 프로젝트 목록 조회 (페이지네이션)
  http.get(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "0", 10);
    const size = parseInt(url.searchParams.get("size") || "10", 10);

    const start = page * size;
    const end = start + size;
    const paginatedItems = mockProjects.slice(start, end);
    const totalElements = mockProjects.length;
    const totalPages = Math.ceil(totalElements / size);

    return HttpResponse.json({
      success: true,
      data: {
        items: paginatedItems,
        totalPages,
        totalElements,
        size,
        number: page,
        first: page === 0,
        last: page >= totalPages - 1,
      },
    });
  }),

  // 프로젝트 단일 조회
  http.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/projects/:id`,
    ({ params }) => {
      const { id } = params;
      const project = mockProjectDetails.find((p) => p.id === id);

      if (!project) {
        return HttpResponse.json(
          { success: false, message: "프로젝트를 찾을 수 없습니다." },
          { status: 404 }
        );
      }

      return HttpResponse.json({
        success: true,
        data: project,
      });
    }
  ),
];
