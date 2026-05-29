import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Node.js용 MSW 서버 설정 (테스트용)
export const server = setupServer(...handlers);
