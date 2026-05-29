export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // 개발 환경이고 MSW 사용이 활성화된 경우에만 실행
    const shouldUseMSW =
      process.env.NODE_ENV === 'development' &&
      process.env.NEXT_PUBLIC_USE_MSW === 'true';

    if (shouldUseMSW) {
      // 동적 import로 production 번들에서 제외
      const { server } = await import('./mocks/server');
      server.listen({
        onUnhandledRequest: 'bypass', // 처리되지 않은 요청은 그대로 통과
      });
      console.log('🔶 MSW Server started');
    }
  }
}