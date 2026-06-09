import axiosInstance from './axios-instance';
import type {
  ApiResponse,
  ProjectListDto,
  ProjectDetailDto,
  ProjectRequestDto,
} from '@/types';

// Projects API
export const projectsApi = {
  // 프로젝트 목록 조회 (페이지네이션)
  getProjectList: (page = 0, size = 10) =>
    axiosInstance.get<ApiResponse<ProjectListDto>>('/api/projects', {
      params: { page, size },
    }),

  // 프로젝트 상세 조회
  getProjectDetail: (id: string) =>
    axiosInstance.get<ApiResponse<ProjectDetailDto>>(`/api/projects/${id}`),

  // 프로젝트 생성
  createProject: (request: ProjectRequestDto) =>
    axiosInstance.post<ApiResponse<ProjectDetailDto>>(
      '/api/projects',
      request
    ),

  // 프로젝트 수정
  updateProject: (id: string, request: ProjectRequestDto) =>
    axiosInstance.put<ApiResponse<ProjectDetailDto>>(
      `/api/projects/${id}`,
      request
    ),

  // 프로젝트 삭제
  deleteProject: (id: string) =>
    axiosInstance.delete(`/api/projects/${id}`),

  // 프로젝트 콘텐츠 이미지 업로드
  uploadProjectImage: (projectId: string, formData: FormData) =>
    axiosInstance.post<ApiResponse<ProjectDetailDto>>(
      `/api/projects/${projectId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    ),

  // 프로젝트 콘텐츠 이미지 삭제
  deleteProjectImage: (projectId: string, fileId: string) =>
    axiosInstance.delete<ApiResponse<ProjectDetailDto>>(
      `/api/projects/${projectId}/images/${fileId}`
    ),
};

