// 파일 타입
export type FileType = "IMAGE" | "DOCUMENT" | "RESUME" | "PORTFOLIO";

// 파일 정보 DTO
export interface FileDto {
  id: string; // UUID
  originalFileName?: string; // 원본 파일명 (확장자 포함)
  fileSize?: number; // Long
  contentType?: string;
  fileType?: FileType; // "IMAGE" | "DOCUMENT"
  downloadUrl?: string;
  exists?: boolean;
  createdAt?: string; // LocalDateTime
  updatedAt?: string; // LocalDateTime
}

// 파일 목록 응답 (페이지네이션)
export interface FileListDto {
  items: FileDto[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

