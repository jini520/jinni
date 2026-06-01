# UI/Common 구조 분해 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 모놀리식 `packages/ui/Theme.tsx`를 순수 wrapper로 축소하고, 포트폴리오 종속 섹션/상세를 신규 `@jinni/common`으로 분리해 react/next가 공유한다.

**Architecture:** `@jinni/ui`=범용 컴포넌트 + 순수 `Theme`/`ThemeProvider` + 디자인 토큰. `@jinni/common`=포트폴리오 섹션/`ProjectDetail`/`PortfolioNav`/종속 데이터. 앱=fetch 후 `<Theme>`에 common 섹션 조합. 단계별로 진행하며 각 단계 종료 시 빌드 그린 + 렌더 대조로 검증한다.

**Tech Stack:** pnpm workspace, React 19, Vite(react), Next 15(next), SCSS Modules, Storybook.

**검증 게이트(공통):**
- `pnpm build:react` → 통과 (Vite + tsc, scss 컴파일 포함)
- `pnpm build:next` → 통과 (Next + tsc)
- 렌더 대조: `pnpm dev:react` / `pnpm dev:next`로 분해 전후 화면 동일 확인

> 테스트 프레임워크가 없으므로 "failing test" 대신 **빌드 그린 + 렌더 1:1 대조**가 검증 수단이다. 각 Phase 끝에서 커밋한다.

---

## Phase 1: `@jinni/common` 스캐폴딩

**Files:**
- Create: `packages/common/package.json`
- Create: `packages/common/tsconfig.json`
- Create: `packages/common/src/index.ts`

- [ ] **Step 1: package.json 생성**

```json
{
  "name": "@jinni/common",
  "version": "0.0.1",
  "private": true,
  "exports": {
    ".": "./src/index.ts"
  },
  "types": "./src/index.ts",
  "dependencies": {
    "@jinni/types": "workspace:*",
    "@jinni/ui": "workspace:*"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "sass": "^1.92.1",
    "typescript": "^5"
  }
}
```

- [ ] **Step 2: tsconfig.json 생성** (`packages/ui/tsconfig.json` 복제 + paths 추가)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@jinni/types": ["../types/src/index.ts"],
      "@jinni/ui": ["../ui/src/index.ts"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: 빈 진입점 생성**

`packages/common/src/index.ts`:
```ts
export {};
```

- [ ] **Step 4: 워크스페이스 설치 & 인식 확인**

Run: `pnpm install`
Expected: `@jinni/common` 링크됨, 에러 없음

- [ ] **Step 5: 커밋**

```bash
git add packages/common
git commit -m "chore: scaffold @jinni/common package"
```

---

## Phase 2: 종속 자산을 common으로 이동

`packages/ui`의 포트폴리오 종속 자산(데이터/아이콘/정적 콘텐츠)을 common으로 옮긴다.

**Files:**
- Move: `packages/ui/src/data/profile.ts` → `packages/common/src/data/profile.ts`
- Move: `packages/ui/src/theme/SkillIcons.tsx` → `packages/common/src/data/SkillIcons.tsx`
- Create: `packages/common/src/data/content.ts` (QA_BLOCKS, CARD_ACCENTS, TECH_GROUPS_KO)
- Modify: `packages/ui/src/index.ts` (profile export 제거)
- Modify: `packages/common/src/index.ts`

- [ ] **Step 1: profile.ts / SkillIcons.tsx 파일 이동** (내용 그대로)

```bash
git mv packages/ui/src/data/profile.ts packages/common/src/data/profile.ts
git mv packages/ui/src/theme/SkillIcons.tsx packages/common/src/data/SkillIcons.tsx
```

- [ ] **Step 2: 정적 콘텐츠 추출** — `Theme.tsx:15-41`의 `CARD_ACCENTS`, `TECH_GROUPS_KO`, `QA_BLOCKS`를 `packages/common/src/data/content.ts`로 그대로 이동(타입 그대로, `import React` 필요 시 추가).

- [ ] **Step 3: common index에서 재노출**

`packages/common/src/index.ts`:
```ts
export { PROFILE, LINKS } from './data/profile';
export type { ContactLink } from './data/profile';
export { getSkillIcon } from './data/SkillIcons';
export { QA_BLOCKS, CARD_ACCENTS, TECH_GROUPS_KO } from './data/content';
```
> `SkillIcons.tsx`의 export 이름이 `getSkillIcon`인지 확인 후 일치시킬 것.

- [ ] **Step 4: ui index에서 profile export 제거**

`packages/ui/src/index.ts`에서 다음 줄 삭제:
```ts
export { PROFILE, LINKS } from './data/profile';
export type { ContactLink } from './data/profile';
```

- [ ] **Step 5: 빌드 검증**

Run: `pnpm build:react && pnpm build:next`
Expected: 통과. (이 시점에 `Theme.tsx`가 아직 profile/SkillIcons/content를 ui 내부 경로로 참조하면 깨짐 → Step 6에서 정리)

- [ ] **Step 6: `Theme.tsx`의 import 경로를 common으로 임시 연결**

`Theme.tsx` 상단 import를 `@jinni/common`에서 가져오도록 수정(`PROFILE`, `LINKS`, `getSkillIcon`, `QA_BLOCKS`, `CARD_ACCENTS`, `TECH_GROUPS_KO`). 단 ui→common 의존은 순환이므로 **임시**다 — Phase 4에서 Theme 분해 시 해소된다.
> 순환 의존을 피하려면 Phase 2~4를 한 흐름으로 처리하고, Phase 4 완료 전까지 `Theme.tsx`는 상수들을 자체 보관해도 된다. 실행자는 순환이 생기면 Step 6 대신 상수를 Theme.tsx에 잠시 남겨둘 것.

- [ ] **Step 7: 커밋**

```bash
git add -A
git commit -m "refactor: move portfolio-specific assets to @jinni/common"
```

---

## Phase 3: `Theme` → 순수 wrapper + `ThemeProvider`

**Files:**
- Create: `packages/ui/src/theme/ThemeProvider.tsx`
- Modify: `packages/ui/src/theme/Theme.tsx` (전체 교체, wrapper만)
- Modify: `packages/ui/src/theme/index.ts`
- Modify: `packages/ui/src/index.ts`
- Modify: `apps/react/src/App.tsx`, `apps/next/src/app/_components/PortfolioClient.tsx`

- [ ] **Step 1: `ThemeProvider` 작성**

`packages/ui/src/theme/ThemeProvider.tsx`:
```tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextValue {
  dark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = 'jinni-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === 'light') setDark(false);
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light'); } catch {}
  }, [dark]);

  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark((d) => !d) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
```

- [ ] **Step 2: `Theme.tsx`를 순수 wrapper로 전체 교체**

```tsx
'use client';

import { useMouse } from '../hooks/useMouse';
import { useTheme } from './ThemeProvider';
import styles from './theme.module.scss';

export function Theme({ children }: { children: React.ReactNode }) {
  const { dark } = useTheme();
  const m = useMouse();

  return (
    <div className={styles.theme} data-theme={dark ? 'dark' : 'light'} data-density="regular">
      <div className={styles.bg}>
        <div className={`${styles.blob} ${styles.b1}`} />
        <div className={`${styles.blob} ${styles.b2}`} />
      </div>
      <div className={styles.grid} />
      <div className={styles.noise} />
      <div className={styles.cursor} style={{ left: `${m.x * 100}%`, top: `${m.y * 100}%` }} />
      {children}
    </div>
  );
}
```
> 기존 `ThemeProps`(data/dark/onToggleTheme/onProjectClick/renderLink) 제거.

- [ ] **Step 3: theme/index.ts 갱신**

```ts
export { Theme } from './Theme';
export { ThemeProvider, useTheme } from './ThemeProvider';
```
> 기존 `export type { ThemeProps }` 삭제.

- [ ] **Step 4: 앱 진입점 갱신 (react)**

`apps/react/src/App.tsx`의 `AppContent`에서 `dark`/`setDark`/localStorage useEffect 제거, `<ThemeProvider>`로 감싸고 `<Theme>`에 children(섹션)을 넣는 구조로 변경. 모달의 `dark`는 `useTheme()`로 대체.
> 이 단계에서 섹션이 아직 common에 없으므로, 일시적으로 화면이 비어도 빌드만 통과하면 된다. Phase 5에서 섹션 조합 완성.

- [ ] **Step 5: 앱 진입점 갱신 (next)**

`PortfolioClient.tsx`에서 dark 상태/localStorage 제거, `<ThemeProvider><Theme>...</Theme></ThemeProvider>` 구조로 변경.

- [ ] **Step 6: ui index.ts 갱신** — `ThemeProvider`/`useTheme` 추가 노출 확인(`export * from './theme'`로 자동).

- [ ] **Step 7: 빌드 검증**

Run: `pnpm build:react && pnpm build:next`
Expected: 통과. 화면은 비어 있을 수 있음(Phase 5에서 채움).

- [ ] **Step 8: 커밋**

```bash
git add -A
git commit -m "refactor: reduce Theme to pure wrapper, add ThemeProvider"
```

---

## Phase 4: 섹션 9개 분해 → common

`Theme.tsx` 구버전(`git show HEAD~N:.../Theme.tsx` 또는 reflog로 원본 확보)의 각 `<section>`을 common 섹션 컴포넌트로 이동. scss는 `theme.module.scss`에서 해당 블록을 떼어 섹션별 모듈로 분리.

**Files (each):**
- Create: `packages/common/src/sections/<Name>/<Name>.tsx`
- Create: `packages/common/src/sections/<Name>/<name>.module.scss`
- Modify: `packages/common/src/index.ts`

대상: `HeroSection`, `AboutSection`, `StackSection`, `ProjectsSection`, `CareerSection`, `WritingSection`, `ContactSection`, `Footer`, `PortfolioNav`.

- [ ] **Step 1: 섹션별 컴포넌트 작성** — 원본 모놀리식 JSX에서 해당 섹션 블록을 옮기고 props 시그니처를 spec대로 부여:
  - `HeroSection()` / `AboutSection()` / `ContactSection()` / `Footer()` — props 없음, common 데이터 사용
  - `StackSection({ skills })`, `ProjectsSection({ projects, onProjectClick })`, `CareerSection({ careers })`, `WritingSection({ posts })`
  - `PortfolioNav({ links, renderLink, onToggle })` — `@jinni/ui`의 `Nav` 래핑, brand/cta 콘텐츠 포함. `onToggle`은 `useTheme().toggle` 연결.
  - 각 컴포넌트 내부에서 `useReveal`는 섹션 단위가 아니라 페이지 단위 1회 호출이 적절 → `PortfolioPage` 조합부(Phase 5)에서 호출하거나 Hero에서 1회 호출. 실행자는 원본처럼 최상위 1회만 호출되도록 둘 것.

- [ ] **Step 2: scss 블록 분리** — `packages/ui/src/theme/theme.module.scss`에서 각 섹션 관련 클래스(`.hero/.section/.shead/.qaBlock/.tech/.projects/.career/.posts/.contact/.foot/.nav` 등)를 해당 섹션 모듈로 이동. `@use '@jinni/ui/styles/...'` 토큰 참조로 연결(Phase 7에서 `/scss/*` 경로로 정리 전까지는 상대경로 `@use` 가능하나, common에서는 패키지 경로 필요 → 임시로 `@use '../../../../ui/src/styles/tokens/colors'`는 금지. 대신 Phase 7의 `exports`를 먼저 적용해도 됨).
  > **순서 주의:** common scss가 ui 토큰을 `@use`하려면 Phase 7의 `@jinni/ui/styles` exports 정리가 선행되어야 한다. 실행자는 Phase 7 Step 1(exports 추가)을 Phase 4보다 먼저 적용할 것.

- [ ] **Step 3: common index에 섹션 export 추가**

```ts
export { HeroSection } from './sections/Hero/HeroSection';
export { AboutSection } from './sections/About/AboutSection';
export { StackSection } from './sections/Stack/StackSection';
export { ProjectsSection } from './sections/Projects/ProjectsSection';
export { CareerSection } from './sections/Career/CareerSection';
export { WritingSection } from './sections/Writing/WritingSection';
export { ContactSection } from './sections/Contact/ContactSection';
export { Footer } from './sections/Footer/Footer';
export { PortfolioNav } from './sections/Nav/PortfolioNav';
```

- [ ] **Step 4: 빌드 검증** — `pnpm build:react && pnpm build:next` 통과(아직 앱이 섹션을 조합 안 하면 화면은 비어 있음).

- [ ] **Step 5: 커밋**

```bash
git add -A
git commit -m "refactor: decompose monolithic Theme into @jinni/common sections"
```

---

## Phase 5: 앱에서 섹션 조합

**Files:**
- Modify: `apps/react/src/App.tsx`
- Modify: `apps/next/src/app/_components/PortfolioClient.tsx`

- [ ] **Step 1: react 조합** — `<ThemeProvider><Theme>` 안에 `PortfolioNav`, `ProgressBar`(@jinni/ui), 섹션들을 원본 순서대로 배치. `data`는 기존 fetch 결과를 각 섹션 props로 분배. `onProjectClick`은 기존 navigate 로직 유지.

- [ ] **Step 2: next 조합** — 동일 구조. `renderLink`는 next용 `<a>` 그대로.

- [ ] **Step 3: 렌더 대조 검증** — `pnpm dev:react`, `pnpm dev:next` 실행 후 분해 전 홈 화면과 1:1 비교(Hero/About/Stack/Projects/Career/Writing/Contact/Footer/Nav/ProgressBar/배경). 다크·라이트 토글 동작 확인.

- [ ] **Step 4: 빌드 검증** — `pnpm build:react && pnpm build:next` 통과.

- [ ] **Step 5: 커밋**

```bash
git add -A
git commit -m "refactor: compose @jinni/common sections in react/next apps"
```

---

## Phase 6: `ProjectDetail` 단일화 + className 정리

react의 `proj-*` 디자인을 채택하되 CSS Module + 의미명으로 전환, presentational 컴포넌트로 common 이동.

**Files:**
- Create: `packages/common/src/project/ProjectDetail.tsx`
- Create: `packages/common/src/project/project-detail.module.scss`
- Modify: `packages/common/src/index.ts`
- Modify: `apps/react/src/App.tsx` (모달 라우트)
- Modify: `apps/next/src/app/@modal/(.)projects/[id]/page.tsx`, `apps/next/src/app/projects/[id]/page.tsx`
- Delete (Phase 8에서): `packages/ui/src/organisms/ProjectModal.tsx`

- [ ] **Step 1: presentational `ProjectDetail` 작성** — 기존 `ProjectModal.tsx`의 본문 JSX를 가져오되:
  - props: `{ project: ProjectDetail; accent: string; idx: string }` (모달 껍데기/포털/onClose는 제외 — 각 앱이 감쌈)
  - 전역 클래스 `proj-overlay/proj-modal/proj-modal-head/...` → CSS Module 의미명 `styles.detail/.head/.title/.sub/.meta/.metaCell/.block/.blockLabel/.features/.feature/.stack/.stackChip/.foot/.link`로 치환.
  - `MarkdownRenderer`는 `@jinni/ui`에서 import.

- [ ] **Step 2: scss 작성** — 기존 `ProjectModal` 전역 scss(위치 확인: `theme.module.scss` 또는 별도)를 `project-detail.module.scss`로 옮기고 클래스명을 Step 1 의미명에 맞춤. 토큰은 `@use '@jinni/ui/scss/...'`.

- [ ] **Step 3: common index export 추가**

```ts
export { ProjectDetail } from './project/ProjectDetail';
```
> `@jinni/types`의 `ProjectDetail` 타입과 컴포넌트 이름 충돌 주의 → 컴포넌트는 `ProjectDetailView`로 명명하는 것을 고려. 실행자는 충돌 시 `ProjectDetailView`로 export.

- [ ] **Step 4: react 모달 연결** — `ProjectModalRoute`에서 `ProjectModal`(@jinni/ui) 대신, 포털/오버레이 껍데기 + `<ProjectDetailView project={...} accent idx />`로 교체. fetch는 기존 `fetchProjectDetail` 유지.

- [ ] **Step 5: next 상세/모달 연결** — `@modal/(.)projects/[id]/page.tsx`와 `projects/[id]/page.tsx`에서 구버전 `(sections)/ProjectsSection/ProjectDetail` 대신, 서버에서 fetch 후 `<ProjectDetailView>`에 주입. `accent`/`idx`는 프로젝트 데이터로 산출.

- [ ] **Step 6: 렌더 대조 검증** — react 모달, next 상세페이지·intercepting 모달 모두 동작/디자인 확인.

- [ ] **Step 7: 빌드 검증** — `pnpm build:react && pnpm build:next` 통과.

- [ ] **Step 8: 커밋**

```bash
git add -A
git commit -m "refactor: unify ProjectDetail into @jinni/common with CSS Modules"
```

---

## Phase 7: CSS import 경로 / exports 정리

**Files:**
- Modify: `packages/ui/package.json` (exports)
- Modify: `apps/react/src/main.tsx`, `apps/next/src/styles/main.scss` (import 경로)
- Modify: common 섹션 scss의 `@use` 경로

- [ ] **Step 1: ui exports에 명확한 경로 추가**

`packages/ui/package.json` exports:
```json
"exports": {
  ".": "./src/index.ts",
  "./styles": "./src/styles/index.scss",
  "./scss/*": "./src/styles/*"
}
```
> 기존 `"./styles/*": "./src/styles/*"`는 `"./scss/*"`로 대체. 런타임 전역 진입점은 `"./styles"` 하나로.

- [ ] **Step 2: 앱 전역 import 경로 변경** — `import '@jinni/ui/styles/index.scss'` → `import '@jinni/ui/styles'` (react `main.tsx`, next `main.scss`의 `@use`/`@import`도 동일 정리).

- [ ] **Step 3: common scss `@use` 경로 통일** — 모든 섹션/상세 scss의 토큰 참조를 `@use '@jinni/ui/scss/tokens/colors'` 형태로 통일.

- [ ] **Step 4: 빌드 검증** — `pnpm build:react && pnpm build:next` 통과. scss 해석 에러 없음 확인.

- [ ] **Step 5: 커밋**

```bash
git add -A
git commit -m "chore: clean up @jinni/ui style exports and import paths"
```

---

## Phase 8: 죽은 코드 삭제

**Files:**
- Delete: `apps/next/src/app/(sections)/` 중 미사용분 (Hero/Careers/Skills/Blog/Cert/Edu Section 및 하위)
- Delete: 통합 후 미사용 `apps/next/src/app/_components/*` (Shape/SkillIcon/MarkdownContent 등)
- Delete: `packages/ui/src/organisms/ProjectModal.tsx` 및 관련 전역 scss
- Modify: `packages/ui/src/index.ts` (`ProjectModal` export 제거)

- [ ] **Step 1: 미사용 검증** — 삭제 대상별로 `grep -rn '<이름>' apps packages --include='*.ts' --include='*.tsx'`로 잔여 참조 0건 확인.

- [ ] **Step 2: 삭제 실행** — 참조 0건인 파일만 `git rm`.

- [ ] **Step 3: ui index 정리** — `export { ProjectModal } from './organisms/ProjectModal';` 삭제. `theme.module.scss`에서 이동 완료된 섹션/상세 클래스 잔여분 제거(wrapper 클래스만 잔류).

- [ ] **Step 4: 최종 빌드 검증** — `pnpm build:react && pnpm build:next` 통과. `pnpm --filter @jinni/admin build`도 영향 없는지 확인.

- [ ] **Step 5: 렌더 최종 대조** — react/next 홈 + 상세/모달 전부 동작 확인.

- [ ] **Step 6: 커밋**

```bash
git add -A
git commit -m "chore: remove dead sections, _components, and ProjectModal"
```

---

## Self-Review 메모 (실행자 주의)

- **순환 의존(Phase 2↔4):** ui→common 역참조가 생기지 않도록, Theme 분해(Phase 4) 완료 전까지 상수는 Theme.tsx에 남겨두거나 Phase 4를 Phase 2와 한 흐름으로 처리. ui는 common을 import하지 않는다(단방향 common→ui 유지).
- **scss 토큰 경로 선행:** common scss의 `@use '@jinni/ui/scss/*'`가 동작하려면 Phase 7 Step 1(exports)을 Phase 4보다 먼저 적용.
- **타입/컴포넌트 이름 충돌:** `@jinni/types`의 `ProjectDetail` 타입과 겹치므로 컴포넌트는 `ProjectDetailView`로.
- **`getSkillIcon` export 이름:** `SkillIcons.tsx` 실제 export와 일치 확인.
- **렌더 대조는 자동화 불가:** 각 Phase의 dev 서버 육안 확인이 실질 게이트.
