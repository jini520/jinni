// 프로젝트별 색 — 저채도 차분 팔레트. 중간 명도로 라이트·다크 양쪽 가독 확보.
export const CARD_ACCENTS = ['#C25E86', '#8470C0', '#3F95A8', '#B5822F'];

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
    a: [
      (<>사용자 경험을 코드로 설계하고, 그 코드가 <span className="hl">사용자에게 닿는 순간까지</span> 책임지는 프론트엔드 개발자입니다. React와 TypeScript가 주력이지만, 필요하면 API와 인프라까지 직접 만들고 운영합니다.</>),
    ],
    tags: ['React · TypeScript', 'End-to-End', 'Web · Mobile'],
  },
  {
    q: (<><span className="hl">무엇</span>에 집착하나요?</>),
    a: [
      (<>돌아가는 코드보다 <span className="hl">유지보수 가능한 구조</span>에 집착합니다. 디자인 시스템을 처음부터 구축하고 컴포넌트 API를 다듬는 일을 가장 좋아하며, 마이크로 인터랙션의 디테일이 제품의 신뢰감을 만든다고 믿습니다.</>),
    ],
    tags: ['Design Systems', 'Refactoring', 'Micro-interaction'],
  },
  {
    q: (<><span className="hl">어떻게</span> 일하나요?</>),
    a: [
      (<>문제를 만나면 증상이 아니라 <span className="hl">근본 원인</span>까지 파고들고, 배운 것은 팀이 다시 쓸 수 있게 문서로 남깁니다. 디자이너와는 Figma 핸드오프 단계부터 인터랙션을 함께 리뷰하며 의도를 맞춥니다.</>),
      (<>AI를 <span className="hl">가장 빠른 동료</span>로 씁니다. 프로젝트의 맥락과 규칙을 문서로 만들어 주입하고, 결과물은 직접 검증하는 협업 프로세스를 설계했습니다. 덕분에 주력인 프론트엔드를 넘어 서버와 인프라까지, 혼자서도 팀의 속도로 다룹니다.</>),
    ],
    tags: ['Root-cause', 'Documentation', 'AI-assisted', 'Context Engineering'],
  },
];
