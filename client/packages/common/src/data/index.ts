// 순수 데이터 배럴 — client 훅/컴포넌트를 끌어오지 않아 서버 컴포넌트에서 안전하게 import 가능.
// (메인 배럴 '@jinni/common'은 섹션·PortfolioPage 등 client 모듈을 포함한다.)
export { PROFILE, LINKS } from './profile';
export type { ContactLink } from './profile';
export { CARD_ACCENTS, TECH_GROUPS_KO, QA_BLOCKS } from './content';
