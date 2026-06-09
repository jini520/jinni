# UI 아이콘 시스템 설계 — svgr 사전생성으로 `@jinni/ui` 이전

작성일: 2026-06-03
상태: 설계 승인 대기

## 배경 / 문제

아이콘 자산이 세 곳에 분산·중복되어 있다.

- `apps/next/public/logos/*.svg` (28개) — 원본 SVG. `apps/next/src/constants/iconRegistry.ts`가 @svgr/webpack으로 import하고 `IconNames` 타입을 export. 이 `iconRegistry`는 데드 체인(라이브 코드 미사용)이며, `IconNames`만 `api/skills.types.ts`·`api/careers.types.ts`에서 사용된다(→ mocks가 타입으로 참조).
- `apps/next/public/icons/*.svg` (12개) — UI 글리프(arrow, hamburger, x 등). 현재 코드에서 참조 0건.
- `packages/common/src/data/SkillIcons.tsx` (157줄) — **라이브** 스킬 아이콘. SVG를 손으로 인라인한 React 컴포넌트 + `SKILL_ICONS` 이름→컴포넌트 맵 + `getSkillIcon(name)`. `StackSection`이 소비.

목표: **원본 `.svg` 파일을 `@jinni/ui`로 단일화하고, svgr로 React 컴포넌트를 생성·제공한다.** 소비처(next/admin/react)는 번들러 설정 없이 평범한 컴포넌트를 import한다.

### 제약

`@jinni/ui`는 빌드 단계가 없고 소스(`exports: "./src/index.ts"`)를 그대로 내보내며, **세 번들러**(next=@svgr/webpack, admin·react=vite-plugin-svgr)가 각각 컴파일한다. 번들러마다 `.svg` import 문법이 달라(`./x.svg?react` vs `ReactComponent`), ui 내부에서 `.svg`를 직접 import하면 소비처 3곳을 일관 설정해야 하는 취약점이 생긴다.

→ **svgr CLI 사전생성** 방식을 채택한다. `.svg`는 source-of-truth로 ui에 두고, `@svgr/cli`로 `.tsx`를 생성·커밋한다. 소비처는 생성된 평범한 `.tsx`만 import하므로 번들러 무관·추가 설정 불필요하다. (이는 현재 `SkillIcons.tsx`의 산출물 형태와 동일하다.)

## 결정 사항 (브레인스토밍 합의)

| 항목 | 결정 |
|------|------|
| 범위 | 스킬 로고 27종 + UI 글리프(public/icons). shape/illustrations 제외 |
| 변환 | svgr CLI 사전생성(.svg 원본 + 생성 .tsx 모두 커밋) |
| 색상 | 로고=브랜드색 유지, UI 글리프=`currentColor`(테마 상속) |
| 레거시 | 완전 이전 — public/logos·icons를 ui로 이동, iconRegistry 삭제, api types의 `IconNames`→`@jinni/ui`의 `SkillName` |
| 미사용 컴포넌트 | `Icon` atom·`IconGrid` organism 제거(미사용 확인됨) |

## 구조

```
packages/ui/src/icons/
  _svg/
    logos/        # 27 브랜드 로고 .svg  (← apps/next/public/logos 이동)
    ui/           # UI 글리프 .svg       (← apps/next/public/icons 이동)
  logos/          # 생성 .tsx + index.ts  (DockerIcon, ReactIcon, ...)
  ui/             # 생성 .tsx + index.ts  (ArrowIcon, HamburgerIcon, XIcon, ...)
  skillMap.ts     # SKILL_ICONS 맵 + getSkillIcon() + SkillName 타입
  index.ts        # logos · ui · skillMap 재노출
```

`_svg/`(원본)와 생성물 모두 커밋한다. `_` 접두로 svgr 스캔·배럴에서 제외한다.

## svgr 생성 설정

- ui 패키지에 `@svgr/cli` devDependency 추가, `"icons:gen"` 스크립트로 svgr를 그룹별 2회 실행.
- **logos**: 브랜드색 유지. `--typescript --no-dimensions`(크기는 props로 — `StackSection`이 `width={16} height={16}` 전달).
- **ui**: `--typescript --no-dimensions` + `--replace-attr-values "#000=currentColor"`(및 소스에 등장하는 흑색 계열)로 fill을 `currentColor`로 치환 → color/다크모드 상속.
- 컴포넌트명은 index 템플릿으로 `Icon` 접미사 부여(`docker.svg → DockerIcon`)해 기존 컨벤션 유지.
- 생성된 `.tsx`는 `(props: SVGProps<SVGSVGElement>) => JSX` 형태의 평범한 React 컴포넌트 → ui의 빌드-없는 소스 export 모델과 충돌 없음.

## 공개 API (`@jinni/ui`)

```ts
import { DockerIcon, ArrowIcon } from '@jinni/ui';   // 개별 (트리셰이킹)
import { getSkillIcon } from '@jinni/ui';             // 데이터 기반 조회
const Icon = getSkillIcon('react');                   // SvgIcon | undefined
import type { SkillName } from '@jinni/ui';           // SKILL_ICONS 키 유니온
```

`getSkillIcon`/`SKILL_ICONS`/이름 정규화(`toLowerCase().replace(/[\s\-_]/g,'')`)는 현재 common 구현을 그대로 이식한다. `SkillName = keyof typeof SKILL_ICONS`.

## 마이그레이션

1. `apps/next/public/{logos,icons}/*.svg` → `packages/ui/src/icons/_svg/{logos,ui}/`로 **이동**.
2. ui에 `@svgr/cli` + svgr 설정 + `icons:gen` 스크립트 추가. 생성 실행 → 생성 `.tsx`·index·skillMap 커밋.
3. `packages/ui/src/index.ts`에 `icons` export 추가. 동시에 `export * from './atoms/Icon';`, `export * from './organisms/IconGrid';` **제거**.
4. **common**: `StackSection.tsx`가 `getSkillIcon`을 `@jinni/ui`에서 import. `packages/common/src/data/SkillIcons.tsx` **삭제**(common index 재노출 있으면 정리).
5. **next**: `apps/next/src/constants/iconRegistry.ts` **삭제**. `api/skills.types.ts`·`careers.types.ts`의 `IconNames` → `@jinni/ui`의 `SkillName`으로 교체.
6. **미사용 컴포넌트 제거**: `packages/ui/src/atoms/Icon/`, `packages/ui/src/organisms/IconGrid/` 디렉토리 삭제.
7. **번들러 정리(확인 후)**: next가 더 이상 `.svg`를 import하지 않으면 `@svgr/webpack` 의존성 + `next.config` svgr 룰 + `src/types/svg.d.ts` 제거. admin/react의 vite-plugin-svgr도 미사용이면 제거 후보(이번 범위는 next까지, 나머지는 확인 결과에 따라).

## 검증 기준

- `tsc --noEmit`: ui / common / next / admin 모두 통과.
- `pnpm --filter @jinni/ui icons:gen` 재현 가능 — 원본 svg 수정 후 재생성 시 결과 일치.
- `StackSection` 스킬 아이콘 정상 렌더(width/height props 동작), 다크모드에서 UI 글리프가 텍스트색 상속.
- `git grep`으로 `SkillIcons`, `iconRegistry`, `IconNames`, `atoms/Icon`, `IconGrid` 잔여 참조 0건.

## 범위 밖

- shape/illustrations 자산.
- admin/react의 vite-plugin-svgr 제거는 사용 여부 확인 후 별도 판단(이번 PR은 next 정리까지 필수).
