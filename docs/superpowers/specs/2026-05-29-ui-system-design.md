# UI System Refactoring Design
**Date:** 2026-05-29  
**Approach:** Option C — 새 구조 먼저 만들고 점진적 마이그레이션  
**Goal:** Atomic Design 기반 Component Driven Development, packages/ui를 단일 진실의 원천으로

---

## 1. 배경 및 현황

### 현재 문제점
- `packages/ui`의 Aurora variant가 1,243줄 단일 SCSS 파일로 관리됨
- `apps/next/src/styles/variables/`가 `packages/ui/src/styles/variables/`를 **중복** 정의
- Atomic design 구조 없음 — 컴포넌트가 도메인 이름에 종속 (ProjectCard, SkillChip 등)
- `apps/admin`은 디자인 시스템과 완전히 분리된 plain CSS 사용
- "Aurora" 테마 이름이 코드베이스 전반에 산재

### 목표
- `packages/ui`에 Atomic Design 구조 (atoms → molecules → organisms) 구축
- 모든 CSS 토큰/글로벌 스타일을 `packages/ui`로 집중
- `apps/react`, `apps/next`에서 동일한 컴포넌트 공유
- `apps/admin`도 atoms/molecules 공유
- "Aurora" 네이밍 제거 → 단순 "Theme" (light/dark 모드)
- Storybook으로 CDD 플로우 확립

---

## 2. packages/ui 폴더 구조

```
packages/ui/src/
├── styles/
│   ├── tokens/
│   │   ├── _colors.scss           # Primitive 색상 변수 (hex 리터럴 유일한 위치)
│   │   ├── _typography.scss       # font-family, size scale, weight, line-height
│   │   ├── _breakpoints.scss      # bp 변수 + min/max-width mixin
│   │   ├── _spacing.scss          # spacing scale
│   │   └── _shadows.scss          # elevation 토큰
│   ├── mixins/
│   │   ├── _spread-map.scss       # CSS 변수 주입 유틸 (spread-map mixin)
│   │   └── _responsive.scss       # min-width / max-width shorthand
│   ├── theme/
│   │   ├── _light.scss            # [data-theme='light'] semantic 변수
│   │   ├── _dark.scss             # [data-theme='dark'] semantic 변수
│   │   └── index.scss             # :root 기본값 포함 진입점
│   ├── global/
│   │   ├── _reset.scss
│   │   ├── _base.scss             # html, body, scrollbar
│   │   └── _typography.scss       # h1~h6, p, code 기본 스타일
│   └── index.scss                 # 전체 스타일 진입점
│
├── atoms/
│   ├── Button/
│   ├── Tag/
│   ├── Badge/
│   ├── Icon/
│   └── Pill/
│
├── molecules/
│   ├── Chip/                      # Icon + 텍스트 라벨 조합
│   └── Accordion/                 # 접기/펼치기
│
├── organisms/
│   ├── Nav/
│   ├── Card/
│   ├── Modal/
│   ├── IconGrid/
│   └── ProgressBar/
│
├── theme/
│   ├── Theme.tsx                  # AuroraVariant → Theme (전체 레이아웃 래퍼)
│   └── theme.module.scss
│
├── hooks/                         # 기존 유지
├── utils/                         # 기존 유지
└── index.ts
```

### 기존 파일 매핑
| 기존 위치 | 이동 위치 |
|---|---|
| `variants/aurora/Aurora.tsx` | `theme/Theme.tsx` |
| `variants/aurora/aurora.scss` | 각 atom/molecule/organism `.module.scss`으로 분해 |
| `variants/aurora/ProjectModal.tsx` | `organisms/Modal/` |
| `variants/aurora/SkillIcons.tsx` | `organisms/IconGrid/` |
| `apps/next/src/styles/variables/` | **삭제** → `packages/ui/src/styles/tokens/` 사용 |

---

## 3. 스타일 시스템

### 색상 계층 (3-Layer)

**원칙: hex 리터럴은 `tokens/_colors.scss`에만 존재. 상위 레이어는 반드시 SCSS 변수 또는 CSS 변수를 경유.**

```
Layer 1: Primitive Tokens   tokens/_colors.scss     hex 리터럴 정의
Layer 2: Semantic Tokens    theme/index.scss        CSS 변수, Layer 1 참조만 허용
Layer 3: Component Tokens   *.module.scss           컴포넌트 스코프 변수, Layer 2 참조
```

**Layer 1 예시:**
```scss
// tokens/_colors.scss
$color-blue-500:   #007AFF;
$color-blue-600:   #0A84FF;
$color-gray-50:    #F2F2F7;
$color-gray-800:   #1C1C1E;
$color-gray-900:   #0F182A;
$color-white:      #ffffff;
$color-pink-500:   #ff3d9a;
$color-purple-500: #9b5cff;
```

**Layer 2 예시:**
```scss
// theme/index.scss
:root {
  --color-bg:           #{$color-white};
  --color-bg-secondary: #{$color-gray-50};
  --color-text:         #{$color-gray-800};
  --color-text-subtle:  #{$color-gray-100};
  --color-border:       #{$color-gray-200};
  --color-accent:       #{$color-blue-500};
}
[data-theme='dark'] {
  --color-bg:           #{$color-gray-900};
  --color-bg-secondary: #{$color-gray-800};
  --color-text:         #{$color-white};
  --color-accent:       #{$color-blue-600};
}
```

**Aurora(Theme) 전용 토큰** (`.theme` 클래스 스코프):
```scss
.theme {
  --a1: #{$color-pink-500};
  --a2: #{$color-purple-500};
  &[data-theme='light'] { ... }
}
```

### 타이포그래피

```scss
// tokens/_typography.scss — SCSS 변수
$font-sans:  'Pretendard', system-ui, sans-serif;
$font-serif: 'Instrument Serif', serif;
$font-mono:  'JetBrains Mono', ui-monospace, monospace;

$text-xs: 11px;  $text-sm: 12.5px;  $text-base: 14px;
$text-md: 15px;  $text-lg: 17px;    $text-xl: 20px;

// global/_typography.scss — CSS 변수로 노출
:root {
  --font-sans:  #{$font-sans};
  --font-mono:  #{$font-mono};
  --text-base:  #{$text-base};
}
```

### 반응형

```scss
// tokens/_breakpoints.scss
$bp-sm: 480px; $bp-md: 768px; $bp-lg: 1024px; $bp-xl: 1280px;

// 사용 (각 .module.scss에서)
@use '@jinni/ui/styles/tokens/breakpoints' as bp;
.card { @include bp.max-width(md) { flex-direction: column; } }
```

### apps/next 변경

```scss
// apps/next/src/styles/main.scss
@use '@jinni/ui/styles/index';   // 글로벌 + 테마 + 타이포그래피 (중복 삭제)

@theme inline {
  // Tailwind v4 브리지는 Next 앱에서만 유지
  --color-bg: var(--color-bg);
  --color-text: var(--color-text);
}
```

---

## 4. 컴포넌트 계층

### 설계 원칙
- Atoms: 외부 의존성 없음, 순수 프레젠테이션, `'use client'` 불필요
- Molecules: Atoms 조합, 상태가 필요한 경우에만 `'use client'`
- Organisms: 복잡한 UI, 대부분 `'use client'`
- 라우팅 의존성: **renderLink prop 패턴** — packages/ui는 `<a>` fallback, 각 앱이 Link 주입

### Atoms
```tsx
Button  — variant: 'primary' | 'ghost' | 'outline', size: 'sm' | 'md' | 'lg'
Tag     — label, color (accent 주입용)
Badge   — label, variant: 'default' | 'current' | 'outline'
Icon    — src, size, alt
Pill    — label, dot (상태 dot 표시)
```

### Molecules
```tsx
Chip        — icon + label 조합, accent 주입 가능
Accordion   — 'use client', title + children, defaultOpen
```

### Organisms
```tsx
Nav         — 'use client', links[], renderLink?, onToggleTheme?, theme?
Card        — accent?, onClick?, children
Modal       — 'use client', open, onClose, children
IconGrid    — rows[]: { label, items[]: { name, icon?, accent? } }
ProgressBar — 'use client', scroll event 기반, accent?
```

### renderLink 패턴
```tsx
// apps/react (react-router)
<Nav renderLink={(href, children) => <Link to={href}>{children}</Link>} />

// apps/next (next/link)
<Nav renderLink={(href, children) => <NextLink href={href}>{children}</NextLink>} />

// packages/ui 내부 fallback
const link = renderLink ?? ((href, children) => <a href={href}>{children}</a>);
```

---

## 5. Storybook

`packages/ui`에 독립 Storybook 인스턴스.

```
packages/ui/
├── .storybook/
│   ├── main.ts       # SCSS, path alias 설정
│   └── preview.ts    # 글로벌 스타일 import, theme decorator
```

```ts
// preview.ts
import '@jinni/ui/styles/index.scss';

const withTheme = (Story, context) => (
  <div data-theme={context.globals.theme ?? 'dark'}><Story /></div>
);
export const decorators = [withTheme];
export const globalTypes = {
  theme: { toolbar: { items: ['light', 'dark'], dynamicTitle: true } },
};
```

Story 파일은 컴포넌트와 같은 폴더에 위치 (`Button.stories.tsx`).

---

## 6. 마이그레이션 전략 (Phase별)

### Phase 1 — 스타일 시스템 통합
- `packages/ui/styles/` 완성 (tokens, theme, global)
- `apps/next/src/styles/variables/` 삭제 → `@jinni/ui/styles` 참조
- `apps/react/src/styles/global.scss`, `variables.scss` 삭제 → `@jinni/ui/styles` 참조
- **결과:** 색상/타이포 중복 제거, 앱 동작 유지

### Phase 2 — Atoms + Storybook
- Button, Tag, Badge, Icon, Pill 구현 (CSS Modules + SCSS)
- 각 atom마다 Story 작성
- `apps/next`의 Tag, SkillIcon 등 atom으로 교체
- **결과:** Storybook 가동, atom 레벨 공유 시작

### Phase 3 — Molecules + Organisms
- Chip, Accordion 구현
- Nav, Card, Modal, IconGrid, ProgressBar 구현
- `aurora.scss` 분해 → 각 `*.module.scss`으로 이전
- **결과:** 중복 컴포넌트 제거, `apps/next` organisms 교체

### Phase 4 — Theme 정리 + Aurora 제거
- `variants/aurora/` 전체 제거
- `theme/Theme.tsx`로 교체
- `apps/admin`에 atoms/molecules 적용
- **결과:** Aurora 네이밍 완전 제거

### Backward Compatibility
```ts
// Phase 4 전까지 alias 유지
/** @deprecated use Theme instead */
export { Theme as AuroraVariant } from './theme/Theme';
```

---

## 7. 결정 사항 요약

| 항목 | 결정 |
|---|---|
| admin 참여 범위 | Atoms/Molecules 공유 |
| 라우팅 의존성 | renderLink prop 패턴 |
| CSS 방식 | CSS Modules + SCSS |
| Next.js 'use client' | packages/ui에 직접 선언 |
| Storybook | 이번 스코프 포함 |
| hex 리터럴 위치 | tokens/_colors.scss에만 허용 |
