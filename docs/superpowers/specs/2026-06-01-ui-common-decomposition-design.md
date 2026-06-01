# UI/Common 구조 분해 설계

- 날짜: 2026-06-01
- 대상: `packages/ui`, 신규 `packages/common`, `apps/react`, `apps/next`

## 배경 / 문제

현재 `packages/ui/src/theme/Theme.tsx`(367줄)가 포트폴리오 전체 페이지를 렌더링한다.
Hero 텍스트, QA 한국어 하드코딩, Stack/Projects/Career/Writing/Contact 렌더링 로직이
전부 들어 있어 "범용 UI 라이브러리"가 아니라 "앱"이 되어 있다.

추가로 사실상 포트폴리오 구현이 2벌 공존한다.

1. **홈(라이브)**: `apps/react/App.tsx` + `apps/next/page.tsx` → `@jinni/ui`의 모놀리식 `Theme`
2. **상세/모달(next 전용, 구버전)**: `apps/next/src/app/(sections)/ProjectsSection/ProjectDetail` + `_components/*`
   - `(sections)`의 Hero/Careers/Skills/Blog/Cert/Edu는 어떤 페이지도 import하지 않는 **죽은 코드**
3. **react의 상세**는 `@jinni/ui`의 `ProjectModal`(별도 구현)

## 목표

- `packages/ui` = 프로젝트 무관 범용 라이브러리 + 순수 `Theme` wrapper + 디자인 토큰으로 한정
- `packages/common`(신규) = 포트폴리오 종속 UI를 react/next가 공유
- 모놀리식 `Theme.tsx`를 섹션 단위로 분해 (원본 = 현재 라이브 디자인)
- react/next의 상세 화면을 단일 컴포넌트로 통합
- CSS import 경로 정리 (내부 모노레포 전용 기준)

## 비목표 (YAGNI)

- CSS-in-JS 전환 안 함
- `@jinni/ui` npm 배포용 빌드 파이프라인 안 만듦 (내부 워크스페이스 전용)
- 무관한 리팩토링 안 함

## 패키지 경계

| 패키지 | 역할 | 포함 |
|---|---|---|
| `packages/ui` | 범용 라이브러리 | atoms/molecules/organisms(Button, Tag, Badge, Nav, Card, Modal, ProgressBar, IconGrid, MarkdownRenderer), 범용 hooks(useReveal/useMouse/useScrollProgress), **순수 `Theme` wrapper + `ThemeProvider`/`useTheme`**, 디자인 토큰 scss(tokens/mixins/global/theme) |
| `packages/common` (신규, `@jinni/common`) | 포트폴리오 종속 UI | `sections/*`, `ProjectDetail`(단일화), `PortfolioNav`, 종속 데이터(PROFILE/LINKS/QA_BLOCKS/CARD_ACCENTS/TECH_GROUPS_KO), SkillIcons, 섹션 scss |
| `apps/react`, `apps/next` | 데이터 패칭 + 조합 | 각자 fetch → `<Theme>` 안에 common 섹션 조합 |

의존: `@jinni/common` → `@jinni/ui`(컴포넌트 + 컴파일타임 scss). 앱 → `@jinni/common` + `@jinni/ui`.

## Theme wrapper / Provider 설계 (결정: 모드 상태를 Theme가 소유)

```tsx
// packages/ui/src/theme/Theme.tsx
export function Theme({ children }: { children: React.ReactNode }) {
  const { dark } = useTheme();   // Provider 내부 상태
  const m = useMouse();          // 커서 글로우
  return (
    <div className={styles.theme} data-theme={dark ? 'dark' : 'light'} data-density="regular">
      <div className={styles.bg}>{/* blob b1/b2 */}</div>
      <div className={styles.grid} />
      <div className={styles.noise} />
      <div className={styles.cursor} style={{ left: `${m.x*100}%`, top: `${m.y*100}%` }} />
      {children}
    </div>
  );
}
```

- `ThemeProvider` + `useTheme()`가 dark/light 상태 + 토글 + localStorage 지속을 소유.
- localStorage 키 **통일**: `jinni-theme` (기존 react `theme`, next `portfolio-theme` 폐기).
- `data-theme` 속성 주입은 wrapper가 담당. 앱의 `PortfolioClient`/`App.tsx`에서 dark 상태 로직 제거.
- 배경 blob/grid/noise/cursor glow는 wrapper에 유지.
- `Nav`/`ProgressBar`는 wrapper가 아니라 content → `packages/common`으로 (`PortfolioNav`).

## 섹션 분해 (`packages/common/src/sections/`)

데이터는 props로 주입. 정적/하드코딩 콘텐츠는 common 데이터 모듈로 이동.

| 섹션 | props | 비고 |
|---|---|---|
| `HeroSection` | — | PROFILE 사용 |
| `AboutSection` | — | QA_BLOCKS(하드코딩 한국어) → common 데이터 |
| `StackSection` | `skills` | SkillIcons |
| `ProjectsSection` | `projects`, `onProjectClick` | CARD_ACCENTS |
| `CareerSection` | `careers` | |
| `WritingSection` | `posts` | 0개면 미렌더 |
| `ContactSection` | — | LINKS |
| `Footer` | — | PROFILE |
| `PortfolioNav` | `links`, `renderLink`, `onToggle` | ui의 `Nav` 래핑 + nav 콘텐츠 |

각 섹션 scss는 908줄 `theme.module.scss`에서 해당 블록만 떼어 섹션 옆 모듈로 이동.
wrapper 스타일(`.theme/.bg/.blob/.grid/.noise/.cursor`)만 ui에 잔류.

## ProjectDetail 단일화 (결정: react `proj-*` 디자인 채택 + className 정리)

- common에 **presentational `ProjectDetail`** (데이터를 `project` prop으로 받음, 패칭 없음).
- 기준 디자인 = react가 쓰던 `@jinni/ui` `ProjectModal`의 `proj-*`.
- **className 정리**: 전역 문자열 `proj-*` → **CSS Module** + 의미있는 이름
  (`.detail/.head/.title/.sub/.meta/.block/.features/.stack/.foot/.link`).
- 패칭은 각 앱이 담당:
  - react: 라우터 모달이 fetch 후 `<ProjectDetail project={...}/>`
  - next: intercepting route(서버)가 fetch 후 동일 컴포넌트에 주입
- next의 구버전 `pd-*` `ProjectDetail` 및 전용 `_components`(Shape/SkillIcon/MarkdownContent)는 폐기(필요분만 common 흡수).

## 스타일 / CSS import 전략 (결정: B — 내부 모노레포 전용, 빌드 스텝 없음)

- **import 경로 정리**: `@jinni/ui/styles/index.scss` → `@jinni/ui/styles` (package.json `exports`로 매핑).
- **역할 분리**:
  - 런타임 전역 CSS(reset + typography + theme 토큰 custom properties) = 앱이 1회 import.
  - 컴파일타임 scss(tokens/mixins `@use` 대상) = `@jinni/ui/scss/*` 별도 export → common이 소비.
- **전역 CSS 최소화**: `proj-*` 등 전역 클래스 컴포넌트를 CSS Module로 전환해 앱이 import할 전역 분량을 reset/typography/토큰만으로 축소.
- 컴파일된 dist css 산출/빌드 오케스트레이션은 도입하지 않음 (앱 Vite/Next가 소스 scss 컴파일).

## 죽은 코드 정리

- `apps/next/src/app/(sections)/` 미사용분(Hero/Careers/Skills/Blog/Cert/Edu) 삭제.
- 상세/모달 전용 `_components` 중 통합 후 미사용분 삭제.
- `packages/ui`에서 `data/profile.ts`, `theme/SkillIcons.tsx`, 섹션 scss → common 이동 후 `index.ts` export 정리.

## 마이그레이션 순서 (단계별 검증)

1. `packages/common` 스캐폴딩(`@jinni/common`, package.json/tsconfig) → 검증: 워크스페이스 인식, 타입 통과
2. 종속 자산 이동(profile/SkillIcons/QA/accents) → 검증: ui 참조 제거, 타입 통과
3. `Theme` → 순수 wrapper + `ThemeProvider`/`useTheme` 분리, localStorage 키 통일 → 검증: 토글 동작
4. 섹션 9개 + scss를 common으로 분해 → 검증: 분해 전후 렌더 1:1 일치
5. 앱 `page.tsx`/`App.tsx`를 `<Theme>` + 섹션 조합으로 교체 → 검증: 홈 양쪽 동일 렌더
6. `ProjectDetail` 단일화(CSS Module 전환) + 상세/모달 경로 연결 → 검증: react 모달 & next route 동작
7. CSS import 경로/`exports` 정리(`@jinni/ui/styles`, `/scss/*`) → 검증: 앱 빌드 통과
8. 죽은 `(sections)`/`_components` 삭제 → 검증: 타입체크 + 양 앱 빌드 통과

## 확정된 결정

1. 섹션 원본 = 모놀리식 `Theme.tsx` 분해 (구버전 `(sections)` 삭제)
2. 상세/모달 = common 단일화, react `proj-*` 디자인 채택 + CSS Module/의미명으로 정리
3. 종속 자산 전부 common
4. 모드 상태를 `Theme`(Provider)가 소유, localStorage 키 `jinni-theme`로 통일
5. `PortfolioNav`/`ProgressBar` → common content
6. CSS = B안(내부 모노레포 전용): import 경로 정리 + 전역 CSS 최소화, 빌드 스텝 없음
