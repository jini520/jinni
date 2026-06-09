export const CARD_ACCENTS = ['#ff3d9a', '#9b5cff', '#3dd0ff', '#ffb84d'];

export const TECH_GROUPS_KO: Record<string, string> = {
  언어: '언어',
  프론트엔드: '프론트엔드',
  라이브러리: '라이브러리',
  빌드: '빌드',
  도구: '도구',
};

export const QA_BLOCKS = [
  {
    q: (<>어떤 <span className="hl">개발자</span>인가요?</>),
    a: (<>사용자 경험을 코드로 설계하는 <span className="hl">프론트엔드 개발자</span>입니다. React와 TypeScript를 주력으로 웹 · 모바일 영역 모두에서 일해왔고, 디자이너의 의도를 한 픽셀까지 살리는 것에 집착합니다.</>),
    tags: ['React · TypeScript', 'Web · Mobile', '5+ years'],
  },
  {
    q: (<><span className="hl">무엇</span>을 즐기나요?</>),
    a: (<><span className="hl">디자인 시스템</span>을 처음부터 구축하고, 컴포넌트 API를 다듬는 일을 가장 좋아합니다. 마이크로 인터랙션이 제품의 신뢰감을 만든다고 믿고, 그 디테일을 챙기는 일에서 보람을 느낍니다.</>),
    tags: ['Design Systems', 'Micro-interaction', 'Performance'],
  },
  {
    q: (<><span className="hl">어떻게</span> 일하나요?</>),
    a: (<>디자이너와 <span className="hl">가깝게 일하는 것</span>을 선호합니다. Figma 핸드오프 단계에서 인터랙션을 함께 리뷰하고, 컴포넌트 단계부터 의도를 맞추는 협업이 결과적으로 더 빠르고 정확한 제품을 만든다고 믿습니다.</>),
    tags: ['Designer-friendly', 'Component-first', 'Remote OK'],
  },
];
