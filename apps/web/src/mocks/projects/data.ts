import { Project, ProjectDetail } from "@/api/projects.types";

export const mockProjects: Project[] = [
  {
    id: "306a3e3c-5b05-4f28-bb65-b5f12937c210",
    title: "포트폴리오 웹사이트",
    description:
      "Next.js와 TypeScript로 만든 개인 포트폴리오 사이트입니다.Next.js와 TypeScript로 만든 개인 포트폴리오 사이트입니다.Next.js와 TypeScript로 만든 개인 포트폴리오 사이트입니다.Next.js와 TypeScript로 만든 개인 포트폴리오 사이트입니다.",
    skills: [
      "react",
      "nextjs",
      "typescript",
      "springboot",
      "postgresql",
      "oracle",
      "nginx",
    ],
  },
  {
    id: "7aa9e0e4-9af5-4f02-8dde-6854cbde994c",
    title: "할 일 관리 앱",
    description: "React와 Zustand를",
    skills: ["react", "zustand", "typescript"],
  },
  {
    id: "ecce22ab-0fa5-46b5-89b2-5e2eb7eff7c3",
    title: "E-commerce 플랫폼",
    description: "풀스택 쇼핑몰 프로젝트로 결제 시스템을 구현했습니다.",
    skills: ["react", "nextjs", "typescript", "zustand", "tailwind"],
  },
];

const firstProjectContents = `# 포트폴리오 웹사이트 개발

## 프로젝트 개요

**Jejinni** 포트폴리오 프로젝트는 4개의 모노레포로 구성된 풀스택 웹 애플리케이션입니다.
프론트엔드, 백엔드, 관리자 페이지, 인프라를 분리하여 개발 및 배포의 유연성과 확장성을 확보했습니다.

## 프로젝트 구조

### 1. jejinni-client (프론트엔드)

**왜 분리했나?**
- 사용자 경험 최적화를 위한 클라이언트 사이드 최적화
- 정적 자산의 CDN 배포로 빠른 로딩 속도
- Next.js의 서버 컴포넌트를 활용한 성능 향상

**주요 작업 내용:**

#### Next.js 15 App Router 도입
\`\`\`typescript
// Parallel Routes를 활용한 모달 시스템
app/
  @modal/
    (.)projects/[id]/page.tsx  // 인터셉팅 라우트
  projects/
    [id]/page.tsx              // 일반 페이지
\`\`\`

- **왜?** 페이지 새로고침 없이 모달로 프로젝트 상세를 표시하여 UX 개선
- Parallel Routes를 활용해 모달과 페이지를 동시에 렌더링

#### React Query를 통한 서버 상태 관리
\`\`\`typescript
// 페이지네이션 지원 API 호출
export function useProjects({ page = 0, size = 10 }: UseProjectsParams = {}) {
  return useQuery({
    queryKey: projectKeys.list(page, size),
    queryFn: () => getProjects({ page, size }),
  });
}
\`\`\`

- **왜?** 서버 상태와 클라이언트 상태를 분리하여 데이터 동기화 문제 해결
- 페이지네이션, 캐싱, 자동 리페칭 등 복잡한 상태 관리 로직을 간소화

#### MSW를 활용한 API 모킹
\`\`\`typescript
// 개발 환경에서 실제 서버 없이 프론트엔드 개발 가능
if (process.env.NEXT_PUBLIC_USE_MSW === "true") {
  const { worker } = await import("../../mocks/browser");
  await worker.start({ onUnhandledRequest: "bypass" });
}
\`\`\`

- **왜?** 백엔드 개발과 독립적으로 프론트엔드 개발 진행
- 환경 변수로 MSW/실제 서버 전환 가능하여 개발 효율성 향상

#### 마크다운 지원
- **왜?** 프로젝트 설명을 풍부하게 표현하기 위해 마크다운 문법 지원
- \`marked\`와 \`highlight.js\`를 사용하여 코드 블록 구문 강조

### 2. jejinni-server (백엔드)

**왜 분리했나?**
- RESTful API 설계로 다양한 클라이언트 지원 (웹, 모바일 등)
- 비즈니스 로직과 데이터베이스 로직의 명확한 분리
- 독립적인 스케일링 가능

**주요 작업 내용:**

#### Spring Boot 기반 REST API
- **왜?** Java 생태계의 안정성과 풍부한 라이브러리 활용
- 페이지네이션, 정렬, 필터링 등 표준화된 API 제공

#### 페이지네이션 구현
\`\`\`java
// Spring Data JPA Page 응답
Page<Project> projects = projectRepository.findAll(pageable);
return PageResponse.builder()
    .items(projects.getContent())
    .totalPages(projects.getTotalPages())
    .totalElements(projects.getTotalElements())
    .build();
\`\`\`

- **왜?** 대량의 데이터를 효율적으로 전송하고 클라이언트 성능 최적화
- 표준화된 페이지네이션 응답 구조로 프론트엔드와의 협업 용이

### 3. jejinni-admin (관리자 페이지)

**왜 분리했나?**
- 관리자 기능과 사용자 기능의 명확한 분리
- 보안 정책을 다르게 적용 가능
- 독립적인 배포로 운영 안정성 확보

**주요 작업 내용:**
- 프로젝트, 스킬, 경력 등 데이터 CRUD 관리
- 관리자 전용 인증 및 권한 관리

### 4. jejinni-infra (인프라)

**왜 분리했나?**
- 인프라 설정의 버전 관리 및 재사용성
- 환경별(개발/스테이징/프로덕션) 설정 분리
- CI/CD 파이프라인 자동화

**주요 작업 내용:**

#### Docker 멀티 스테이지 빌드
\`\`\`dockerfile
# 빌드 스테이지
FROM node:20-alpine AS builder
RUN pnpm install && pnpm run build

# 실행 스테이지
FROM node:20-alpine
COPY --from=builder /app/.next ./.next
CMD ["pnpm", "start"]
\`\`\`

- **왜?** 최종 이미지 크기 최소화 및 빌드 의존성 제거
- 프로덕션 환경에서 불필요한 파일 제외로 보안 강화

#### 환경별 Dockerfile 분리
- \`Dockerfile\`: 프로덕션용 (main 브랜치)
- \`Dockerfile.staging\`: 스테이징용 (develop 브랜치)

- **왜?** 브랜치별로 다른 빌드 전략 적용
- 환경 변수와 설정을 분리하여 배포 안정성 확보

## 기술 스택

### Frontend (jejinni-client)
- **Next.js 15**: App Router, 서버 컴포넌트
- **React 19**: 최신 React 기능 활용
- **TypeScript**: 타입 안정성
- **React Query**: 서버 상태 관리
- **Tailwind CSS + SCSS**: 유틸리티 우선 + 커스텀 스타일
- **MSW**: API 모킹

### Backend (jejinni-server)
- **Spring Boot**: RESTful API
- **JPA**: 데이터베이스 추상화
- **Pageable**: 페이지네이션 지원

### Infrastructure (jejinni-infra)
- **Docker**: 컨테이너화
- **pnpm**: 빠른 패키지 관리

## 기술적 도전과 해결

### 1. 서버/클라이언트 컴포넌트 분리
**문제**: 마크다운 처리를 위해 \`remark\` 사용 시 서버 컴포넌트 필요
**해결**: 
- 서버 컴포넌트 래퍼(\`ProjectDetailWrapper\`)에서 마크다운 처리
- 클라이언트 컴포넌트는 이미 변환된 HTML만 렌더링

### 2. MSW 환경별 제어
**문제**: 개발/프로덕션 환경에서 MSW 사용 여부 제어 필요
**해결**: 
- \`NEXT_PUBLIC_USE_MSW\` 환경 변수로 제어
- 서버/클라이언트 모두에서 동일한 로직 적용

### 3. 페이지네이션 타입 안정성
**문제**: Spring Boot의 \`Page\` 응답을 TypeScript로 타입 정의
**해결**: 
- \`PageResponse<T>\` 인터페이스로 표준화
- \`items\`, \`totalPages\`, \`totalElements\` 등 명확한 구조

## 배포 전략

| 환경 | 브랜치 | Dockerfile | 목적 |
|------|--------|------------|------|
| Production | main | Dockerfile | 실제 서비스 |
| Staging | develop | Dockerfile.staging | 테스트 및 검증 |

## 배운 점

1. **모노레포 구조의 장점**: 프로젝트 간 코드 공유와 일관성 유지
2. **서버/클라이언트 컴포넌트 분리**: 성능과 기능의 적절한 균형
3. **MSW 활용**: 백엔드와 독립적인 프론트엔드 개발 가능
4. **Docker 멀티 스테이지 빌드**: 이미지 크기 최적화와 보안 강화

이 프로젝트를 통해 **현대적인 웹 개발 아키텍처**와 **DevOps 실무**를 경험할 수 있었습니다.`;

export const mockProjectDetails: ProjectDetail[] = [
  {
    id: "306a3e3c-5b05-4f28-bb65-b5f12937c210",
    title: "포트폴리오 웹사이트",
    description: "Next.js와 TypeScript로 만든 개인 포트폴리오 사이트입니다.",
    skills: ["react", "nextjs", "typescript"],
    participants: 1,
    period: "2024.01. - 2024.12.",
    contents: firstProjectContents,
  },
  {
    id: "7aa9e0e4-9af5-4f02-8dde-6854cbde994c",
    title: "할 일 관리 앱",
    description: "React와 Zustand를 활용한 투두리스트 애플리케이션입니다.",
    skills: ["react", "zustand", "typescript"],
    participants: 2,
    period: "2024.01. - 2024.12.",
    contents: "",
  },
  {
    id: "ecce22ab-0fa5-46b5-89b2-5e2eb7eff7c3",
    title: "E-commerce 플랫폼",
    description: "풀스택 쇼핑몰 프로젝트로 결제 시스템을 구현했습니다.",
    skills: ["react", "nextjs", "typescript", "zustand", "tailwind"],
    participants: 3,
    period: "2024.01. - 2024.12.",
    contents: "",
  },
];
