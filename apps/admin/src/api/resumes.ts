import axiosInstance from "./axios-instance";
import type { ApiResponse, FileListDto, FileDto } from "@/types";

// Resumes API
export const resumesApi = {
  // 이력서 목록 조회 (페이지네이션)
  getResumeList: (page = 0, size = 10) =>
    axiosInstance.get<ApiResponse<FileListDto>>("/api/resumes", {
      params: { page, size },
    }),

  // 이력서 업로드
  uploadResume: (formData: FormData) =>
    axiosInstance.post<ApiResponse<FileDto>>("/api/resumes/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // 이력서 삭제
  deleteResume: (id: string) =>
    axiosInstance.delete<ApiResponse<string>>(`/api/resumes/${id}`),

  // 이력서 다운로드 URL 생성
  getDownloadUrl: (id: string) => {
    const baseURL = axiosInstance.defaults.baseURL || "";
    return `${baseURL}/api/resumes/download/${id}`;
  },

  // 최신 이력서 다운로드 URL 생성
  getLatestDownloadUrl: () => {
    const baseURL = axiosInstance.defaults.baseURL || "";
    return `${baseURL}/api/resumes/latest`;
  },

  // 이력서 정보 조회
  getResumeInfo: (id: string) =>
    axiosInstance.get<ApiResponse<FileDto>>(`/api/resumes/${id}`),

  // 이력서 업데이트
  updateResume: (id: string, formData: FormData) =>
    axiosInstance.put<ApiResponse<FileDto>>(`/api/resumes/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};
