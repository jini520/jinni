import axiosInstance from './axios-instance';
import type { ApiResponse, FileListDto, FileDto } from '@/types';

// Portfolios API
export const portfoliosApi = {
  // 포트폴리오 목록 조회 (페이지네이션)
  getPortfolioList: (page = 0, size = 10) =>
    axiosInstance.get<ApiResponse<FileListDto>>('/api/portfolios', {
      params: { page, size },
    }),

  // 포트폴리오 업로드
  uploadPortfolio: (formData: FormData) =>
    axiosInstance.post<ApiResponse<FileDto>>(
      '/api/portfolios/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    ),

  // 포트폴리오 삭제
  deletePortfolio: (id: string) =>
    axiosInstance.delete<ApiResponse<string>>(`/api/portfolios/${id}`),

  // 포트폴리오 다운로드 URL 생성
  getDownloadUrl: (id: string) => {
    const baseURL = axiosInstance.defaults.baseURL || '';
    return `${baseURL}/api/portfolios/download/${id}`;
  },

  // 포트폴리오 정보 조회
  getPortfolioInfo: (id: string) =>
    axiosInstance.get<ApiResponse<FileDto>>(`/api/portfolios/${id}`),

  // 포트폴리오 업데이트
  updatePortfolio: (id: string, formData: FormData) =>
    axiosInstance.put<ApiResponse<FileDto>>(`/api/portfolios/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};
