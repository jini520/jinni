// 페이지네이션 응답 타입 (Spring Boot Page 형태)
export interface PageResponse<T> {
  items: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;  // 현재 페이지 (0부터 시작)
  first: boolean;
  last: boolean;
}

// 단일 데이터 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}