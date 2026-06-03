# 설계: admin 디자인시스템 통합

- 날짜: 2026-06-02
- 대상: `apps/admin` (`@jinni/admin`)
- 목표: admin 앱을 react/next와 동일한 `@jinni/ui` 디자인시스템으로 통일

## 배경 / 현황

- `apps/admin/src/main.tsx`는 이미 `@jinni/ui/styles`를 import 하지만, 바로 뒤에 import 되는
  `index.css`(Vite 스캐폴드: 다크 `#242424`, 링크 `#646cff`, 전역 `button`/`h1` 규칙)가 토큰을 덮어써 무력화 상태.
- 페이지별 손수 작성한 글로벌 `.css` 11개(총 ~5,700줄). 마크업은 거의 동일한 CRUD 패턴 반복:
  `헤더(h1+subtitle) → 에러배너 → 로딩 스피너 → 섹션헤더+추가버튼 → dnd-kit 드래그 카드 리스트(handle/edit/delete) → 모달 폼(form-group/form-row/actions)`.
- `vite.config.ts`엔 이미 `@jinni/ui` SCSS `loadPaths` 연결됨. `sass@1.92.1` 사용 가능. admin 테스트 없음.
- 재사용 가능 자산: `@jinni/ui` Button(primary/ghost/outline · sm/md/lg), Modal(portal·ESC·overlay click),
  Card, 토큰(Pretendard · iOS 팔레트 · spacing · shadow), `data-theme` 기반 light/dark CSS 변수.

## 결정사항 (확정)

- **접근법 A**: 기반 우선 + 페이지 점진적 마이그레이션.
- admin **로컬 프리미티브**를 `@jinni/ui` 위에 얹는다. (`@jinni/ui`엔 새 컴포넌트 추가하지 않음.)
- **Light** 기본 테마, 깨끗한 관리자 면 (portfolio의 장식 배경 Theme 래퍼 미사용).
- 스타일은 **CSS Modules** (`*.module.scss`) — `@jinni/ui` 컨벤션과 일치.

## 성공 기준

- admin이 `@jinni/ui` 토큰·테마·컴포넌트를 사용하고 Vite 스캐폴드 CSS가 완전히 제거된다.
- 반복 CRUD 패턴이 admin 로컬 프리미티브로 흡수되어 페이지 코드/CSS가 크게 감소한다.
- 각 단계마다 `pnpm --filter @jinni/admin lint` 및 `build`(`tsc -b && vite build`) 통과 + dev 서버 육안 확인.

## 아키텍처

### 1. 전역 기반 (`apps/admin/src/`)

- `index.css` 삭제 → `index.scss` 신설. `@jinni/ui/styles` 유지 + admin 전역(Pretendard, `body` 배경 `var(--color-bg)`,
  스크롤바, MDEditor 보정만 토큰화). Vite 스캐폴드 규칙 전부 제거.
- `index.html`의 `<html>`에 `data-theme="light"` 고정.
- `App.css` → `app.module.scss`로 셸 레이아웃 이관.

### 2. 셸

- **Nav**: 손수 짠 `.main-nav`를 토큰 기반 `app.module.scss`로 재작성(밝은 면, active = `--color-accent`).
  링크 배열을 데이터화해 중복 제거.
- **Home 대시보드**: 이모지 카드 그리드를 토큰 기반 카드 스타일로 정비, 메뉴 항목 데이터 배열화.

### 3. admin 로컬 프리미티브 (`apps/admin/src/components/`, 각 `*.module.scss`)

| 컴포넌트 | 역할 | 대체 대상 |
|---|---|---|
| `PageHeader` | h1 + subtitle + (옵션)액션 | `*-header` 반복 |
| `Toolbar` | 섹션 제목 + 추가 버튼 | `section-header` |
| `FormField` / `FormRow` | label + input/textarea 래퍼 | `form-group` / `form-row` |
| `EmptyState` | 빈 목록 안내 + 버튼 | `empty-state` |
| `ErrorBanner` | 에러 표시 | `error-banner` |
| `Spinner` | 로딩 | `loading` / `spinner` |
| `SortableCard` | dnd-kit handle + edit/delete 카드 셸 | `*-card` 반복 |

- 버튼은 전부 `@jinni/ui` `Button`으로, 모달은 `@jinni/ui` `Modal`로 교체.

### 4. 페이지 마이그레이션 패턴 (페이지당 반복)

각 CRUD 페이지를 →
`PageHeader` + `ErrorBanner` + (`Spinner` | `EmptyState` | `SortableCard` 리스트) + `Modal`(`FormField`/`FormRow`)
조합으로 치환. 페이지별 `*.module.scss`엔 고유 레이아웃만 남긴다.

## 단계 (커밋 분리)

1. **기반 + 셸**: 전역 SCSS, light 테마, Nav, Home → 빌드/육안 확인.
2. **프리미티브 세트** + 레퍼런스 페이지 1개(`Educations`, 가장 작은 CRUD)로 패턴 확립.
3. **나머지 페이지 이관**: Resumes·Portfolios·Files → Skills·Careers·Certifications → Projects·ProjectDetail(가장 큼 마지막).
   각 페이지 커밋 1개.

## 비목표 (Non-goals)

- portfolio 장식 배경(블롭/커서) 미적용.
- 다크 토글 미추가(토큰엔 존재, 추후 가능).
- API/기능/라우팅 로직 변경 없음 — 순수 스타일/구조.
- `@jinni/ui`에 새 컴포넌트 추가 없음.
