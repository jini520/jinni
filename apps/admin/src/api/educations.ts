import axiosInstance from "./axios-instance";
import type { ApiResponse, EducationDto, EducationRequestDto } from "@/types";

// Educations API
export const educationsApi = {
  // 전체 조회
  getAllEducations: () =>
    axiosInstance.get<ApiResponse<EducationDto[]>>("/api/edu"),
};

// Education API
export const educationApi = {
  // Education 생성
  createEducation: (request: EducationRequestDto) =>
    axiosInstance.post<ApiResponse<EducationDto>>("/api/edu", request),

  // Education 조회
  getEducationById: (id: string) =>
    axiosInstance.get<ApiResponse<EducationDto>>(`/api/edu/${id}`),

  // Education 수정
  updateEducation: (id: string, request: EducationRequestDto) =>
    axiosInstance.put<ApiResponse<EducationDto>>(`/api/edu/${id}`, request),

  // Education 삭제
  deleteEducation: (id: string) => axiosInstance.delete<void>(`/api/edu/${id}`),
};
