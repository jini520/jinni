import axiosInstance from './axios-instance';
import type { ApiResponse, FileListDto, FileDto, FileType } from '@/types';

// Files API
export const filesApi = {
  // 파일 목록 조회 (페이지네이션)
  getFileList: (type: FileType = 'DOCUMENT', page = 0, size = 10) =>
    axiosInstance.get<ApiResponse<FileListDto>>('/api/files', {
      params: { type, page, size },
    }),

  // 파일 업로드
  uploadFile: (formData: FormData, type: FileType = 'DOCUMENT') =>
    axiosInstance.post<ApiResponse<FileDto>>(
      '/api/files/upload',
      formData,
      {
        params: { type },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    ),

  // 파일 삭제
  deleteFile: (id: string, type: FileType = 'DOCUMENT') =>
    axiosInstance.delete<ApiResponse<string>>(`/api/files/${id}`, {
      params: { type },
    }),

  // 파일 다운로드 URL 생성
  getDownloadUrl: (id: string, type: FileType = 'DOCUMENT') => {
    const baseURL = axiosInstance.defaults.baseURL || '';
    return `${baseURL}/api/files/download/${id}?type=${type}`;
  },
};
