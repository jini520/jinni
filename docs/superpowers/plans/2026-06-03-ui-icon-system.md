# UI 아이콘 시스템 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 원본 SVG를 `@jinni/ui`로 단일화하고 svgr 사전생성으로 React 컴포넌트 아이콘을 제공한다. 레거시(iconRegistry, public 자산, 미사용 Icon/IconGrid)를 정리한다.

**Architecture:** `.svg` 원본을 `packages/ui/src/icons/_svg/{logos,ui}`에 두고 `@svgr/cli`로 `.tsx`를 생성·커밋한다(번들러 무관). 스킬 아이콘 조회(`getSkillIcon`/`SKILL_ICONS`)는 common에서 ui로 이식한다. 소비처(common StackSection, next api types)를 ui로 재배선하고 레거시를 삭제한다.

**Tech Stack:** TypeScript, React 19, `@svgr/cli`(신규 devDep, ui), pnpm 워크스페이스. 테스트 러너가 없으므로 검증은 패키지별 `tsc --noEmit` + next 빌드 스모크 + `git grep`로 수행한다.

**Branch:** `feat/ui-icon-system` (이미 생성됨, develop 기준).

**참고 — 이식 대상 사실(현재 코드 기준):**
- `SKILL_ICONS` 맵 키(정규화됨, 31개): `javascript, typescript, java, react, reactnative, nextjs, next, zustand, redux, tanstackquery, recoil, tailwind, tailwindcss, sass, styledcomponents, jest, storybook, vite, docker, github, gitlab, jira, figma, notion, linux, oracle, solidity, electron, springboot, nginx, postgresql`.
- 로고 svg 파일(28개): `docker, electron, figma, github, gitlab, java, javascript, jest, jira, linux, next, nginx, notion, oracle, postgresql, react, recoil, redux, sass, solidity, springboot, storybook, styled-components, tailwind, tanstack-query, typescript, vite, zustand`.
- UI 글리프 svg(12개): `arrow, astar, award, certifications, download, hamburger, jieut, logos, mieum, star-burst, threedots, x` (logos.svg만 멀티컬러, 나머지는 이미 currentColor).
- `getSkillIcon` 정규화 규칙: `name.toLowerCase().replace(/[\s\-_]/g, '')`.

---

## Task 1: svg 원본 이동 + svgr 설정 및 생성

**Files:**
- Move: `apps/next/public/logos/*.svg` → `packages/ui/src/icons/_svg/logos/`
- Move: `apps/next/public/icons/*.svg` → `packages/ui/src/icons/_svg/ui/`
- Create: `packages/ui/src/icons/svgr-index.cjs`
- Modify: `packages/ui/package.json` (devDep `@svgr/cli`, script `icons:gen`)
- Generated (commit): `packages/ui/src/icons/logos/*.tsx` + `index.ts`, `packages/ui/src/icons/ui/*.tsx` + `index.ts`

- [ ] **Step 1: 원본 svg를 ui로 이동(git mv로 히스토리 보존)**

```bash
cd /Users/jinni/Developments/jejinni-client
mkdir -p packages/ui/src/icons/_svg/logos packages/ui/src/icons/_svg/ui
git mv apps/next/public/logos/*.svg packages/ui/src/icons/_svg/logos/
git mv apps/next/public/icons/*.svg  packages/ui/src/icons/_svg/ui/
# 빈 디렉토리 정리
rmdir apps/next/public/logos apps/next/public/icons 2>/dev/null || true
```

- [ ] **Step 2: 이동 결과 확인**

Run: `ls packages/ui/src/icons/_svg/logos | wc -l; ls packages/ui/src/icons/_svg/ui | wc -l; ls apps/next/public/logos 2>&1`
Expected: `28`, 그리고 `12`, 그리고 `apps/next/public/logos` 없음(No such file).

- [ ] **Step 3: svgr index 템플릿 작성**

Create `packages/ui/src/icons/svgr-index.cjs`:

```js
const path = require('path');

// svgr가 생성한 파일 경로 목록을 받아, kebab 파일명을 PascalCase + "Icon" 접미사로
// default export 재노출하는 배럴(index.ts)을 만든다.
// (@svgr/cli 버전에 따라 문자열/객체 배열 모두 올 수 있어 방어적으로 처리)
module.exports = (filePaths) =>
  filePaths
    .map((entry) => (typeof entry === 'string' ? entry : entry.path))
    .map((fp) => {
      const base = path.basename(fp, path.extname(fp)); // "styled-components"
      const pascal = base.replace(/(^|[-_])(\w)/g, (_m, _s, c) => c.toUpperCase()); // "StyledComponents"
      return `export { default as ${pascal}Icon } from './${base}';`;
    })
    .join('\n') + '\n';
```

- [ ] **Step 4: ui package.json에 devDep과 스크립트 추가**

Modify `packages/ui/package.json` — `scripts`에 추가:

```json
    "icons:gen": "svgr --typescript --no-dimensions --filename-case kebab --index-template ./src/icons/svgr-index.cjs --out-dir ./src/icons/logos ./src/icons/_svg/logos && svgr --typescript --no-dimensions --filename-case kebab --index-template ./src/icons/svgr-index.cjs --out-dir ./src/icons/ui ./src/icons/_svg/ui"
```

`devDependencies`에 추가:

```json
    "@svgr/cli": "^8.1.0",
```

- [ ] **Step 5: 의존성 설치**

Run: `pnpm install`
Expected: `@svgr/cli` 설치 완료, `node_modules/.bin/svgr` 존재.

- [ ] **Step 6: 아이콘 생성**

Run: `pnpm --filter @jinni/ui icons:gen`
Expected: 에러 없이 완료. `packages/ui/src/icons/logos/`에 28개 `.tsx` + `index.ts`, `packages/ui/src/icons/ui/`에 12개 `.tsx` + `index.ts` 생성.

- [ ] **Step 7: 생성물 검증(export 이름 확인)**

Run: `cat packages/ui/src/icons/logos/index.ts | head; echo '---'; grep -c 'export' packages/ui/src/icons/logos/index.ts; grep -c 'export' packages/ui/src/icons/ui/index.ts`
Expected: `logos/index.ts`에 `export { default as DockerIcon } from './docker';` 형태 28줄, `ui/index.ts`에 `XIcon`/`StarBurstIcon`/`ArrowIcon` 등 12줄.

- [ ] **Step 8: 커밋**

```bash
git add packages/ui/src/icons packages/ui/package.json pnpm-lock.yaml
git add -A apps/next/public
git commit -m "feat(ui): svg 원본 이동 + svgr 사전생성으로 아이콘 컴포넌트 생성

apps/next/public/{logos,icons} → packages/ui/src/icons/_svg/{logos,ui} 이동.
@svgr/cli 추가, icons:gen 스크립트로 .tsx 생성(커밋)."
```

---

## Task 2: skillMap + 배럴 + ui index export

**Files:**
- Create: `packages/ui/src/icons/skillMap.ts`
- Create: `packages/ui/src/icons/index.ts`
- Modify: `packages/ui/src/index.ts`

- [ ] **Step 1: skillMap 작성(현재 common 구현 이식)**

Create `packages/ui/src/icons/skillMap.ts`:

```ts
import type { ComponentType, SVGProps } from 'react';
import {
  JavascriptIcon, TypescriptIcon, JavaIcon, ReactIcon, NextIcon, ZustandIcon,
  ReduxIcon, TanstackQueryIcon, RecoilIcon, TailwindIcon, SassIcon,
  StyledComponentsIcon, JestIcon, StorybookIcon, ViteIcon, DockerIcon,
  GithubIcon, GitlabIcon, JiraIcon, FigmaIcon, NotionIcon, LinuxIcon,
  OracleIcon, SolidityIcon, ElectronIcon, SpringbootIcon, NginxIcon,
  PostgresqlIcon,
} from './logos';

export type SvgIcon = ComponentType<SVGProps<SVGSVGElement>>;

// 키는 정규화된 형태(소문자, 구분자 제거). 일부 이름은 같은 아이콘을 가리키는 별칭.
export const SKILL_ICONS = {
  javascript: JavascriptIcon,
  typescript: TypescriptIcon,
  java: JavaIcon,
  react: ReactIcon,
  reactnative: ReactIcon,
  nextjs: NextIcon,
  next: NextIcon,
  zustand: ZustandIcon,
  redux: ReduxIcon,
  tanstackquery: TanstackQueryIcon,
  recoil: RecoilIcon,
  tailwind: TailwindIcon,
  tailwindcss: TailwindIcon,
  sass: SassIcon,
  styledcomponents: StyledComponentsIcon,
  jest: JestIcon,
  storybook: StorybookIcon,
  vite: ViteIcon,
  docker: DockerIcon,
  github: GithubIcon,
  gitlab: GitlabIcon,
  jira: JiraIcon,
  figma: FigmaIcon,
  notion: NotionIcon,
  linux: LinuxIcon,
  oracle: OracleIcon,
  solidity: SolidityIcon,
  electron: ElectronIcon,
  springboot: SpringbootIcon,
  nginx: NginxIcon,
  postgresql: PostgresqlIcon,
} satisfies Record<string, SvgIcon>;

export type SkillName = keyof typeof SKILL_ICONS;

export const getSkillIcon = (name: string): SvgIcon | undefined =>
  (SKILL_ICONS as Record<string, SvgIcon>)[name.toLowerCase().replace(/[\s\-_]/g, '')];
```

- [ ] **Step 2: icons 배럴 작성**

Create `packages/ui/src/icons/index.ts`:

```ts
export * from './logos';
export * from './ui';
export { SKILL_ICONS, getSkillIcon } from './skillMap';
export type { SvgIcon, SkillName } from './skillMap';
```

- [ ] **Step 3: ui 메인 index에 icons export 추가**

Modify `packages/ui/src/index.ts` — `// ── Atoms ──` 섹션 위 또는 적절한 위치에 추가:

```ts
// ── Icons ─────────────────────────────────────────────────────────────────────
export * from './icons';
```

- [ ] **Step 4: ui 타입체크**

Run: `cd packages/ui && npx tsc --noEmit; echo "exit: $?"`
Expected: `exit: 0`

- [ ] **Step 5: 커밋**

```bash
cd /Users/jinni/Developments/jejinni-client
git add packages/ui/src/icons/skillMap.ts packages/ui/src/icons/index.ts packages/ui/src/index.ts
git commit -m "feat(ui): 아이콘 배럴 + getSkillIcon/SKILL_ICONS/SkillName 제공"
```

---

## Task 3: common을 @jinni/ui로 재배선, SkillIcons 삭제

**Files:**
- Modify: `packages/common/src/sections/Stack/StackSection.tsx:2`
- Modify: `packages/common/src/index.ts:4`
- Delete: `packages/common/src/data/SkillIcons.tsx`

- [ ] **Step 1: StackSection import 교체**

Modify `packages/common/src/sections/Stack/StackSection.tsx` 2번째 줄:

```ts
import { getSkillIcon } from '@jinni/ui';
```

(기존 `import { getSkillIcon } from '../../data/SkillIcons';` 대체)

- [ ] **Step 2: common index의 SkillIcons 재노출 제거**

Modify `packages/common/src/index.ts` — 다음 줄 **삭제**:

```ts
export { getSkillIcon } from './data/SkillIcons';
```

(외부 소비처 없음 확인됨. `getSkillIcon`이 필요하면 `@jinni/ui`에서 직접 import.)

- [ ] **Step 3: SkillIcons.tsx 삭제**

```bash
git rm packages/common/src/data/SkillIcons.tsx
```

- [ ] **Step 4: common 타입체크**

Run: `cd packages/common && npx tsc --noEmit 2>&1 | tail; echo "exit: $?"`
Expected: `exit: 0` (StackSection이 @jinni/ui의 getSkillIcon 사용, 잔여 참조 없음)

- [ ] **Step 5: 커밋**

```bash
cd /Users/jinni/Developments/jejinni-client
git add packages/common/src/sections/Stack/StackSection.tsx packages/common/src/index.ts
git commit -m "refactor(common): getSkillIcon을 @jinni/ui에서 사용, SkillIcons.tsx 제거"
```

---

## Task 4: next — iconRegistry 삭제, api types를 SkillName으로 교체

**Files:**
- Delete: `apps/next/src/constants/iconRegistry.ts`
- Modify: `apps/next/src/api/skills.types.ts:1,14`
- Modify: `apps/next/src/api/careers.types.ts:1,15`

- [ ] **Step 1: skills.types.ts의 IconNames 교체**

Modify `apps/next/src/api/skills.types.ts` — 1번째 줄 import 교체, `iconKey` 타입 교체:

1번째 줄:
```ts
import type { SkillName } from '@jinni/ui';
```
`Skill` 인터페이스의 `iconKey` 필드:
```ts
  iconKey: SkillName;
```

- [ ] **Step 2: careers.types.ts의 IconNames 교체**

Modify `apps/next/src/api/careers.types.ts` — 1번째 줄 import 교체, `skills` 필드 교체:

1번째 줄:
```ts
import type { SkillName } from '@jinni/ui';
```
`Career` 인터페이스의 `skills` 필드:
```ts
  skills: SkillName[];
```

- [ ] **Step 3: iconRegistry 삭제**

```bash
git rm apps/next/src/constants/iconRegistry.ts
```

- [ ] **Step 4: next 타입체크(mock 데이터가 SkillName에 부합하는지 포함)**

Run: `cd apps/next && npx tsc --noEmit 2>&1 | tail -20; echo "exit: $?"`
Expected: `exit: 0`. (careers mock skill 값들이 모두 SkillName 키에 포함됨을 사전 확인했음. 만약 누락 키 에러가 나면, 해당 값이 SKILL_ICONS에 없는 것이므로 Step 보고 후 SKILL_ICONS에 키 추가 또는 mock 값 수정.)

- [ ] **Step 5: 커밋**

```bash
cd /Users/jinni/Developments/jejinni-client
git add apps/next/src/api/skills.types.ts apps/next/src/api/careers.types.ts
git commit -m "refactor(next): api types의 IconNames를 @jinni/ui SkillName으로 교체, iconRegistry 삭제"
```

---

## Task 5: 미사용 Icon atom / IconGrid 제거

**Files:**
- Delete: `packages/ui/src/atoms/Icon/` (Icon.tsx, icon.module.scss, index.ts, Icon.stories.tsx)
- Delete: `packages/ui/src/organisms/IconGrid/` (IconGrid.tsx, icon-grid.module.scss, index.ts, IconGrid.stories.tsx)
- Modify: `packages/ui/src/index.ts` (두 export 줄 제거)

- [ ] **Step 1: 디렉토리 삭제**

```bash
git rm -r packages/ui/src/atoms/Icon packages/ui/src/organisms/IconGrid
```

- [ ] **Step 2: ui index에서 export 제거**

Modify `packages/ui/src/index.ts` — 다음 두 줄 **삭제**:

```ts
export * from './atoms/Icon';
export * from './organisms/IconGrid';
```

- [ ] **Step 3: ui 타입체크 + 잔여 참조 확인**

Run: `cd /Users/jinni/Developments/jejinni-client && git grep -nE "atoms/Icon|IconGrid" -- packages apps ':!*.md'; echo "---"; cd packages/ui && npx tsc --noEmit; echo "exit: $?"`
Expected: grep 결과 없음, `exit: 0`

- [ ] **Step 4: 커밋**

```bash
cd /Users/jinni/Developments/jejinni-client
git add packages/ui/src/index.ts
git commit -m "chore(ui): 미사용 Icon atom·IconGrid organism 제거"
```

---

## Task 6: next 번들러 정리(@svgr/webpack, turbopack svg 룰, svg.d.ts)

**Files:**
- Modify: `apps/next/next.config.ts` (turbopack svg 룰 제거)
- Delete: `apps/next/src/types/svg.d.ts`
- Modify: `apps/next/package.json` (`@svgr/webpack` devDep 제거)

- [ ] **Step 1: next가 더 이상 .svg를 import하지 않는지 확인**

Run: `cd /Users/jinni/Developments/jejinni-client && git grep -nE "from ['\"][^'\"]*\.svg['\"]|\.svg['\"]" -- apps/next/src`
Expected: `apps/next/src/types/svg.d.ts`의 `declare module '*.svg'` 외 import 0건. (있으면 Step 보고 후 중단)

- [ ] **Step 2: turbopack svg 룰 제거**

Modify `apps/next/next.config.ts` — 다음 `turbopack` 블록 **삭제**:

```ts
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
```

- [ ] **Step 3: svg.d.ts 삭제 + @svgr/webpack devDep 제거**

```bash
git rm apps/next/src/types/svg.d.ts
```
Modify `apps/next/package.json` — `devDependencies`에서 다음 줄 **삭제**:
```json
    "@svgr/webpack": "^8.1.0",
```

- [ ] **Step 4: 의존성 갱신**

Run: `cd /Users/jinni/Developments/jejinni-client && pnpm install`
Expected: 성공, lockfile 갱신.

- [ ] **Step 5: next 타입체크 + 빌드 스모크**

Run: `cd apps/next && npx tsc --noEmit && echo "tsc ok" && pnpm build 2>&1 | tail -25; echo "exit: ${PIPESTATUS[0]}"`
Expected: 타입체크 통과, next 빌드 성공.

- [ ] **Step 6: 커밋**

```bash
cd /Users/jinni/Developments/jejinni-client
git add apps/next/next.config.ts apps/next/package.json pnpm-lock.yaml
git commit -m "chore(next): 미사용 @svgr/webpack·turbopack svg 룰·svg.d.ts 제거"
```

---

## Task 7: 전체 검증

**Files:** (없음 — 검증 전용)

- [ ] **Step 1: 전 패키지 타입체크**

Run:
```bash
cd /Users/jinni/Developments/jejinni-client
for d in packages/ui packages/common apps/next apps/admin apps/react; do echo "== $d =="; (cd "$d" && npx tsc --noEmit && echo OK || echo FAIL); done
```
Expected: 모두 `OK`.

- [ ] **Step 2: 레거시 잔여 참조 0건 확인**

Run: `git grep -nE "SkillIcons|iconRegistry|IconNames|atoms/Icon|IconGrid" -- packages apps ':!*.md'`
Expected: 출력 없음.

- [ ] **Step 3: 아이콘 재생성 재현성 확인**

Run: `pnpm --filter @jinni/ui icons:gen && git status --short packages/ui/src/icons`
Expected: `git status`에 변경 없음(생성물이 커밋된 것과 동일).

- [ ] **Step 4: next 빌드 스모크(최종)**

Run: `cd apps/next && pnpm build 2>&1 | tail -15; echo "exit: ${PIPESTATUS[0]}"`
Expected: 빌드 성공.

---

## 범위 밖 / 후속

- `apps/react`, `apps/admin`의 `vite-plugin-svgr`는 현재 `.svg` 직접 import가 없어 미사용이지만, 이번 계획에서는 건드리지 않는다(별도 정리).
- shape/illustrations 자산은 대상 아님.
- `apps/next/src/api/skills.types.ts`의 `Skill`은 `@jinni/types`의 `Skill`과 중복이나, 디듀프는 범위 밖.
