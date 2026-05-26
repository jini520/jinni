import { ApiResponse } from "@/types/api.types";

// API 기본 설정
// MSW 사용 시 상대 경로, 실제 서버 사용 시 절대 경로
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_USE_MSW === "true") {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"; // MSW는 상대 경로로 인터셉트
  }
  return process.env.NEXT_PUBLIC_API_URL || "";
};

// 공통 fetch 함수
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${getBaseUrl()}${endpoint}`;

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    // TO-DO: 캐싱 비활성화 (매번 새로 가져옴)
    // TO-DO: cache: 'no-store' -> next: { revalidate: 3600 } 추가
    cache: "no-store",
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API 요청에 실패했습니다.");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
