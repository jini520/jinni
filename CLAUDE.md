# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 작업 방식 (중요)

`.claude/rules/workflow.md`의 **구현 승인 게이트**를 따른다:

- 비자명한 작업(3단계 이상 또는 아키텍처 결정)은 ① 코드베이스 파악 → ② 접근법 2–3가지와 트레이드오프 제시 → ③ **"구현해/진행해/GO" 등 명시적 승인 대기** → ④ 승인 후 구현.
- 즉시 실행 가능: 증상이 분명한 버그 수정, 1–2단계 단순 수정, 사용자가 "바로 구현해"라고 한 경우.
- 모호한 요청은 편집 전에 먼저 질문한다.

## 레포 구조 (모노레포)

3개의 독립 영역을 하나의 레포·단일 클론으로 운영한다.

- **`client/`** — pnpm 워크스페이스(`pnpm@10.14.0`, CI는 Node 24). 프론트엔드 앱과 공유 패키지.
- **`server/`** — Spring Boot 3.5.5 / Java 17 / Gradle. REST API 백엔드.
- **`infra/`** — docker-compose + nginx로 전체를 오케스트레이션 (운영 배포 단위).

## 클라이언트 (`client/`에서 실행)

워크스페이스 구성 (`apps/*`, `packages/*`):

| 패키지 | 역할 |
|---|---|
| `@jinni/next` (`apps/next`) | Next.js 15 SSR 포트폴리오. App Router, Turbopack, React Query, MSW 목 |
| `@jinni/react` (`apps/react`) | Vite + React Router 정적 SPA. **next의 대체 런타임** (동일 포트폴리오) |
| `@jinni/admin` (`apps/admin`) | Vite 관리자 SPA. axios, md-editor, dnd-kit |
| `@jinni/common` | next·react가 **공유**하는 포트폴리오 UI 섹션(Hero/Career/Projects 등) + 데이터 |
| `@jinni/ui` | 디자인 시스템 컴포넌트, SCSS, SVGR 아이콘 생성, Storybook |
| `@jinni/types` | 공유 TS 타입 |

워크스페이스 의존성은 `workspace:*`로 링크(`link-workspace-packages=true`).

```bash
pnpm install                       # 의존성 설치 (CI: --frozen-lockfile)
pnpm dev:next | dev:react | dev:admin   # 개별 앱 dev 서버
pnpm build                         # 전체 빌드(=--filter '@jinni/*', 타입체크 포함) — CI가 실행하는 것
pnpm build:next | build:react | build:admin
pnpm --filter @jinni/next lint     # 린트 (lint 스크립트는 next·admin만 보유, react 없음)
pnpm --filter @jinni/ui storybook  # 디자인 시스템 미리보기
pnpm --filter @jinni/ui icons:gen  # _svg → SVGR 컴포넌트 재생성
```

> 루트 README의 `pnpm dev`는 create-next-app 보일러플레이트라 무시. 실제 스크립트는 위와 `client/package.json` 참고.

**환경변수** (`client/.env`, `.env.example` 참고): `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_USE_MSW`(`true`면 MSW 목 서버 사용).

## 서버 (`server/`에서 실행)

Spring Boot, **도메인 우선** 구조. 최상위가 `domain/`·`global/`이고, 각 도메인 폴더 안에 레이어 하위 패키지가 들어간다 — 파일 경로는 `domain/career/controller/…`·`domain/skill/service/…` 식. 도메인: `career`, `skill`, `education`, `project`, `achievement`(자격증+수상), `post`(velog RSS 연동), `resume`·`portfolio`(`file`을 `FileType`으로 재사용하는 얇은 컨트롤러 — 자체 service/repository 없음), `file`(파일 업로드/저장 — API 없는 지원 도메인, project·resume·portfolio가 사용). 공통 요소는 `global/`(`config/` `exception/` `response/` `entity/`). 패키지 루트는 `site.jejinni.server`.

```bash
./gradlew bootRun                              # 로컬 실행
./gradlew build                                # 빌드(테스트 포함)
./gradlew test                                 # 전체 테스트
./gradlew test --tests "site.jejinni.server.XxxTest"   # 단일 테스트
```

> 주의: 기본 프로파일엔 datasource가 없어 DB 연결 정보 없이는 `bootRun`/`test`/`build`가 실패한다. 상세는 `server/CLAUDE.md` 참고.

핵심 인프라 의존성: PostgreSQL + JPA, **Flyway**(마이그레이션 `src/main/resources/db/migration`), **Jasypt**(설정값 암호화), Spring Security, Lombok.

**프로파일**
- 기본(`application.properties`): 공통 설정. Flyway off.
- `prod`(`application-prod.properties`): DB·파일경로·계정 등이 `ENC(...)`로 암호화되어 있고 Flyway on. 실행 시 **`JASYPT_ENCRYPTOR_PASSWORD` 환경변수 필수**(없으면 복호화 실패).

**보안 현황(인지 필요)**: `global/config/SecurityConfig`는 `/api/**`에 와일드카드 CORS + `anyRequest().permitAll()`로, 현재 **모든 엔드포인트가 무인증 공개**다(쓰기·삭제 포함). 의도된 현 상태이며 인증 도입은 보류 중 — 변경 작업 시 이 전제를 깨지 않도록 주의.

## 인프라 / 배포 (`infra/`)

`docker-compose.yml`이 postgres · server · admin · client · nginx를 묶는다.

- **nginx**가 단일 진입점: `3000`=client, `3001`=admin, `/api`→ 내부 `server:8080`(서버는 호스트 포트 미노출).
- **공개 프론트는 next/react 중 택1** — `infra/.env`의 `COMPOSE_PROFILES`(`next`|`react`)가 compose 프로파일과 nginx `client.conf` 선택을 동시에 결정한다(**필수 값**). admin은 항상 함께 빌드·배포.
- admin/react는 정적 빌드 산출물을 named volume에 복사해 nginx가 서빙. postgres 볼륨은 `external`(실수로 `down -v` 삭제 방지).
- 환경변수는 `infra/env.example` 참고.

**배포** (`.github/workflows/deploy.yml`): `main` push 시 운영 서버에 SSH → `git pull` → **변경된 경로(`server/`·`client/`·`infra/`)만** 선별 재빌드. `workflow_dispatch`(수동)는 전체 재배포.

**CI** (`.github/workflows/client-ci.yml`): `client/**` 변경 PR에서 `pnpm build`(타입체크 포함)로 검증. 서버용 CI는 없음.
