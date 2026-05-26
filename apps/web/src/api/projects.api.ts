import { apiRequest } from "@/lib/api";
import { Project, ProjectDetail } from "@/api/projects.types";
import { PageResponse } from "@/types/api.types";

interface GetProjectsParams {
  page?: number;
  size?: number;
}

export async function getProjects(
  params: GetProjectsParams = {},
): Promise<PageResponse<Project>> {
  const { page = 0, size = 10 } = params;
  const response = await apiRequest<PageResponse<Project>>(
    `/api/projects?page=${page}&size=${size}`,
  );

  return (
    response.data || {
      items: [],
      totalPages: 0,
      totalElements: 0,
      size,
      number: page,
      first: true,
      last: true,
    }
  );
}

export async function getProject(
  id: string,
): Promise<ProjectDetail | undefined> {
  const response = await apiRequest<ProjectDetail>(`/api/projects/${id}`);

  return response.data;
}
