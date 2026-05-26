import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 데이터가 오래된 것으로 간주되는 시간 (5분)
      staleTime: 5 * 60 * 1000,
      // 캐시된 데이터를 유지하는 시간 (10분)
      gcTime: 10 * 60 * 1000,
      // 자동 리페칭 비활성화 (필요시 활성화)
      refetchOnWindowFocus: false,
      // 재시도 횟수
      retry: 1,
      // 에러 발생시 재시도 여부
      retryOnMount: true,
    },
    mutations: {
      // 뮤테이션 재시도 횟수
      retry: 1,
    },
  },
});
