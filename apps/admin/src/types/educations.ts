// Education 타입
export interface EducationDto {
  id: string;
  education: string;
  startDate: string; // "YY.MM." 형식
  endDate: string; // "YY.MM." 형식
  status: string;
  description?: string;
  orderIndex?: number;
}

export interface EducationRequestDto {
  education: string;
  startDate: string;
  endDate?: string;
  status: string;
  description?: string;
  orderIndex?: number;
}

// 전체 조회 응답
export interface EducationsDto {
  educations: EducationDto[];
}
