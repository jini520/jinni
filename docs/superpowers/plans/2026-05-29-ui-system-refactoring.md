# UI System Refactoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** packages/ui를 Atomic Design 기반 단일 진실의 원천으로 리팩터링하고, Aurora 네이밍을 제거하며 react/next/admin이 공통 컴포넌트를 공유하도록 구조화한다.

**Architecture:** Option C — 새 구조를 먼저 만들고 점진적으로 마이그레이션. 기존 앱 기능은 각 Phase가 끝날 때마다 동작 상태를 유지. CSS 토큰은 3-Layer (Primitive → Semantic → Component), 컴포넌트는 atoms → molecules → organisms 계층.

**Tech Stack:** React 19, TypeScript 5, SCSS (CSS Modules), Storybook 8 (Vite builder), pnpm workspaces, Next.js 15 (Turbopack), Vite 7

---

## File Map

### 신규 생성
```
packages/ui/src/styles/tokens/_colors.scss
packages/ui/src/styles/tokens/_typography.scss
packages/ui/src/styles/tokens/_breakpoints.scss
packages/ui/src/styles/tokens/_spacing.scss
packages/ui/src/styles/tokens/_shadows.scss
packages/ui/src/styles/mixins/_spread-map.scss
packages/ui/src/styles/mixins/_responsive.scss
packages/ui/src/styles/theme/_light.scss
packages/ui/src/styles/theme/_dark.scss
packages/ui/src/styles/theme/index.scss
packages/ui/src/styles/global/_reset.scss
packages/ui/src/styles/global/_base.scss
packages/ui/src/styles/global/_typography.scss
packages/ui/src/styles/index.scss
packages/ui/src/atoms/Button/Button.tsx
packages/ui/src/atoms/Button/button.module.scss
packages/ui/src/atoms/Button/Button.stories.tsx
packages/ui/src/atoms/Button/index.ts
packages/ui/src/atoms/Tag/Tag.tsx
packages/ui/src/atoms/Tag/tag.module.scss
packages/ui/src/atoms/Tag/Tag.stories.tsx
packages/ui/src/atoms/Tag/index.ts
packages/ui/src/atoms/Badge/Badge.tsx
packages/ui/src/atoms/Badge/badge.module.scss
packages/ui/src/atoms/Badge/Badge.stories.tsx
packages/ui/src/atoms/Badge/index.ts
packages/ui/src/atoms/Icon/Icon.tsx
packages/ui/src/atoms/Icon/icon.module.scss
packages/ui/src/atoms/Icon/Icon.stories.tsx
packages/ui/src/atoms/Icon/index.ts
packages/ui/src/atoms/Pill/Pill.tsx
packages/ui/src/atoms/Pill/pill.module.scss
packages/ui/src/atoms/Pill/Pill.stories.tsx
packages/ui/src/atoms/Pill/index.ts
packages/ui/src/molecules/Chip/Chip.tsx
packages/ui/src/molecules/Chip/chip.module.scss
packages/ui/src/molecules/Chip/Chip.stories.tsx
packages/ui/src/molecules/Chip/index.ts
packages/ui/src/molecules/Accordion/Accordion.tsx
packages/ui/src/molecules/Accordion/accordion.module.scss
packages/ui/src/molecules/Accordion/Accordion.stories.tsx
packages/ui/src/molecules/Accordion/index.ts
packages/ui/src/organisms/ProgressBar/ProgressBar.tsx
packages/ui/src/organisms/ProgressBar/progress-bar.module.scss
packages/ui/src/organisms/ProgressBar/ProgressBar.stories.tsx
packages/ui/src/organisms/ProgressBar/index.ts
packages/ui/src/organisms/Nav/Nav.tsx
packages/ui/src/organisms/Nav/nav.module.scss
packages/ui/src/organisms/Nav/Nav.stories.tsx
packages/ui/src/organisms/Nav/index.ts
packages/ui/src/organisms/Card/Card.tsx
packages/ui/src/organisms/Card/card.module.scss
packages/ui/src/organisms/Card/Card.stories.tsx
packages/ui/src/organisms/Card/index.ts
packages/ui/src/organisms/Modal/Modal.tsx
packages/ui/src/organisms/Modal/modal.module.scss
packages/ui/src/organisms/Modal/Modal.stories.tsx
packages/ui/src/organisms/Modal/index.ts
packages/ui/src/organisms/IconGrid/IconGrid.tsx
packages/ui/src/organisms/IconGrid/icon-grid.module.scss
packages/ui/src/organisms/IconGrid/IconGrid.stories.tsx
packages/ui/src/organisms/IconGrid/index.ts
packages/ui/src/theme/Theme.tsx
packages/ui/src/theme/theme.module.scss
packages/ui/src/theme/index.ts
packages/ui/.storybook/main.ts
packages/ui/.storybook/preview.tsx
```

### 수정
```
packages/ui/src/index.ts
packages/ui/package.json
apps/next/next.config.ts
apps/next/src/styles/main.scss
apps/react/vite.config.ts
apps/react/src/main.tsx
apps/react/src/styles/global.scss
```

### 삭제 (Phase별 단계적)
```
packages/ui/src/styles/variables/    (Phase 1 완료 후)
packages/ui/src/variants/aurora/     (Phase 4 완료 후)
apps/next/src/styles/variables/      (Phase 1 완료 후)
apps/react/src/styles/variables.scss (Phase 1 완료 후)
```

---

## Phase 1 — 스타일 시스템 통합

### Task 1: Primitive 색상 토큰 생성

**Files:**
- Create: `packages/ui/src/styles/tokens/_colors.scss`

- [ ] **Step 1: 토큰 파일 생성**

```bash
mkdir -p packages/ui/src/styles/tokens
```

`packages/ui/src/styles/tokens/_colors.scss`:
```scss
// ── Primitive Color Tokens ────────────────────────────────────────────────
// hex 리터럴은 이 파일에만 존재. 모든 상위 레이어는 이 변수를 참조.

// System colors (iOS-inspired)
$color-red-400:    #FF453A;
$color-red-500:    #FF3B30;
$color-orange-400: #FF9F0A;
$color-orange-500: #FF9500;
$color-yellow-400: #FFD60A;
$color-yellow-500: #FFCC00;
$color-green-400:  #30D158;
$color-green-500:  #34C759;
$color-mint-400:   #63E6E2;
$color-mint-500:   #00C7BE;
$color-teal-400:   #40CBE0;
$color-teal-500:   #30B0C7;
$color-cyan-400:   #64D2FF;
$color-cyan-500:   #32ADE6;
$color-blue-400:   #0A84FF;
$color-blue-500:   #007AFF;
$color-indigo-400: #5E5CE6;
$color-indigo-500: #5856D6;
$color-purple-400: #BF5AF2;
$color-purple-500: #AF52DE;
$color-pink-400:   #FF375F;
$color-pink-500:   #FF2D55;
$color-brown-400:  #AC8E68;
$color-brown-500:  #A2845E;

// Aurora accent
$color-aurora-a1-light: #e0277e;
$color-aurora-a1-dark:  #ff3d9a;
$color-aurora-a2-light: #6a37d8;
$color-aurora-a2-dark:  #9b5cff;

// Neutrals
$color-white: #ffffff;
$color-black: #000000;

// Gray scale (light → dark)
$color-gray-50:  #F2F2F7;
$color-gray-100: #E5E5EA;
$color-gray-200: #D1D1D6;
$color-gray-300: #C7C7CC;
$color-gray-400: #AEAEB2;
$color-gray-500: #8E8E93;
$color-gray-600: #636366;
$color-gray-700: #48484A;
$color-gray-800: #3A3A3C;
$color-gray-900: #2C2C2E;
$color-gray-950: #1C1C1E;

// Background
$color-bg-dark:  #0F182A;
$color-bg-light: #FFFFFF;
```

- [ ] **Step 2: 커밋**

```bash
git add packages/ui/src/styles/tokens/_colors.scss
git commit -m "feat(ui): add primitive color tokens"
```

---

### Task 2: 나머지 Primitive 토큰 생성 (typography, breakpoints, spacing, shadows)

**Files:**
- Create: `packages/ui/src/styles/tokens/_typography.scss`
- Create: `packages/ui/src/styles/tokens/_breakpoints.scss`
- Create: `packages/ui/src/styles/tokens/_spacing.scss`
- Create: `packages/ui/src/styles/tokens/_shadows.scss`

- [ ] **Step 1: typography 토큰 생성**

`packages/ui/src/styles/tokens/_typography.scss`:
```scss
// ── Typography Tokens ─────────────────────────────────────────────────────
$font-sans:  'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
$font-serif: 'Instrument Serif', 'Pretendard', serif;
$font-mono:  'JetBrains Mono', ui-monospace, monospace;
$font-inter: 'Inter', system-ui, sans-serif;

// Size scale
$text-xs:   11px;
$text-sm:   12.5px;
$text-base: 14px;
$text-md:   15px;
$text-lg:   17px;
$text-xl:   20px;
$text-2xl:  24px;
$text-3xl:  30px;
$text-4xl:  36px;
$text-5xl:  48px;

// Weight
$weight-thin:      100;
$weight-light:     300;
$weight-normal:    400;
$weight-medium:    500;
$weight-semibold:  600;
$weight-bold:      700;
$weight-extrabold: 800;
$weight-black:     900;

// Line height
$leading-none:    1;
$leading-tight:   1.1;
$leading-snug:    1.3;
$leading-normal:  1.5;
$leading-relaxed: 1.6;
$leading-loose:   1.7;
```

- [ ] **Step 2: breakpoints 토큰 생성**

`packages/ui/src/styles/tokens/_breakpoints.scss`:
```scss
// ── Breakpoint Tokens ─────────────────────────────────────────────────────
$bp-xs:  0px;
$bp-sm:  480px;
$bp-md:  768px;
$bp-lg:  1024px;
$bp-xl:  1280px;
$bp-2xl: 1536px;
```

- [ ] **Step 3: spacing 토큰 생성**

`packages/ui/src/styles/tokens/_spacing.scss`:
```scss
// ── Spacing Tokens ────────────────────────────────────────────────────────
$space-1:  4px;
$space-2:  8px;
$space-3:  12px;
$space-4:  16px;
$space-5:  20px;
$space-6:  24px;
$space-8:  32px;
$space-10: 40px;
$space-12: 48px;
$space-16: 64px;
$space-20: 80px;
$space-24: 96px;
```

- [ ] **Step 4: shadows 토큰 생성**

`packages/ui/src/styles/tokens/_shadows.scss`:
```scss
// ── Shadow Tokens ─────────────────────────────────────────────────────────
@use 'colors' as c;

$shadow-sm: 0 1px 4px rgba(c.$color-black, 0.08);
$shadow-md: 0 4px 16px rgba(c.$color-black, 0.12);
$shadow-lg: 0 8px 32px rgba(c.$color-black, 0.16);
$shadow-xl: 0 20px 60px rgba(c.$color-black, 0.24);
```

- [ ] **Step 5: 커밋**

```bash
git add packages/ui/src/styles/tokens/
git commit -m "feat(ui): add primitive tokens (typography, breakpoints, spacing, shadows)"
```

---

### Task 3: Mixins 생성

**Files:**
- Create: `packages/ui/src/styles/mixins/_spread-map.scss`
- Create: `packages/ui/src/styles/mixins/_responsive.scss`

- [ ] **Step 1: spread-map mixin 생성**

```bash
mkdir -p packages/ui/src/styles/mixins
```

`packages/ui/src/styles/mixins/_spread-map.scss`:
```scss
@use 'sass:map';

// CSS 변수 맵을 현재 스코프에 주입
@mixin spread-map($map) {
  @each $key, $value in $map {
    #{$key}: #{$value};
  }
}
```

- [ ] **Step 2: responsive mixin 생성**

`packages/ui/src/styles/mixins/_responsive.scss`:
```scss
@use '../tokens/breakpoints' as bp;

@mixin min-width($size) {
  @if      $size == xs  { @media (min-width: bp.$bp-xs)  { @content; } }
  @else if $size == sm  { @media (min-width: bp.$bp-sm)  { @content; } }
  @else if $size == md  { @media (min-width: bp.$bp-md)  { @content; } }
  @else if $size == lg  { @media (min-width: bp.$bp-lg)  { @content; } }
  @else if $size == xl  { @media (min-width: bp.$bp-xl)  { @content; } }
  @else if $size == 2xl { @media (min-width: bp.$bp-2xl) { @content; } }
  @else                 { @media (min-width: $size)       { @content; } }
}

@mixin max-width($size) {
  @if      $size == sm  { @media (max-width: calc(bp.$bp-sm  - 1px)) { @content; } }
  @else if $size == md  { @media (max-width: calc(bp.$bp-md  - 1px)) { @content; } }
  @else if $size == lg  { @media (max-width: calc(bp.$bp-lg  - 1px)) { @content; } }
  @else if $size == xl  { @media (max-width: calc(bp.$bp-xl  - 1px)) { @content; } }
  @else                 { @media (max-width: $size)                   { @content; } }
}
```

- [ ] **Step 3: 커밋**

```bash
git add packages/ui/src/styles/mixins/
git commit -m "feat(ui): add SCSS mixins (spread-map, responsive)"
```

---

### Task 4: Semantic 테마 (light/dark) 생성

**Files:**
- Create: `packages/ui/src/styles/theme/_light.scss`
- Create: `packages/ui/src/styles/theme/_dark.scss`
- Create: `packages/ui/src/styles/theme/index.scss`

- [ ] **Step 1: light/dark semantic 변수 생성**

```bash
mkdir -p packages/ui/src/styles/theme
```

`packages/ui/src/styles/theme/_light.scss`:
```scss
@use '../tokens/colors' as c;
@use '../tokens/typography' as t;

// :root.light 또는 [data-theme='light'] 에서 사용
// 직접 사용 금지 — theme/index.scss 경유

$theme-light: (
  // Background
  --color-bg:               #{c.$color-bg-light},
  --color-bg-secondary:     #{c.$color-gray-50},

  // Text
  --color-text:             #{c.$color-gray-950},
  --color-text-subtle:      #{c.$color-gray-500},
  --color-text-faint:       #{c.$color-gray-400},

  // Border
  --color-border:           #{c.$color-gray-300},
  --color-border-strong:    #{c.$color-gray-200},

  // Accent
  --color-accent:           #{c.$color-blue-500},

  // System colors
  --color-red:              #{c.$color-red-500},
  --color-orange:           #{c.$color-orange-500},
  --color-yellow:           #{c.$color-yellow-500},
  --color-green:            #{c.$color-green-500},
  --color-mint:             #{c.$color-mint-500},
  --color-teal:             #{c.$color-teal-500},
  --color-cyan:             #{c.$color-cyan-500},
  --color-blue:             #{c.$color-blue-500},
  --color-indigo:           #{c.$color-indigo-500},
  --color-purple:           #{c.$color-purple-500},
  --color-pink:             #{c.$color-pink-500},
  --color-brown:            #{c.$color-brown-500},
);
```

`packages/ui/src/styles/theme/_dark.scss`:
```scss
@use '../tokens/colors' as c;

$theme-dark: (
  // Background
  --color-bg:               #{c.$color-bg-dark},
  --color-bg-secondary:     #{c.$color-gray-900},

  // Text
  --color-text:             #{c.$color-white},
  --color-text-subtle:      #{c.$color-gray-400},
  --color-text-faint:       #{c.$color-gray-600},

  // Border
  --color-border:           #{c.$color-gray-800},
  --color-border-strong:    #{c.$color-gray-700},

  // Accent
  --color-accent:           #{c.$color-blue-400},

  // System colors
  --color-red:              #{c.$color-red-400},
  --color-orange:           #{c.$color-orange-400},
  --color-yellow:           #{c.$color-yellow-400},
  --color-green:            #{c.$color-green-400},
  --color-mint:             #{c.$color-mint-400},
  --color-teal:             #{c.$color-teal-400},
  --color-cyan:             #{c.$color-cyan-400},
  --color-blue:             #{c.$color-blue-400},
  --color-indigo:           #{c.$color-indigo-400},
  --color-purple:           #{c.$color-purple-400},
  --color-pink:             #{c.$color-pink-400},
  --color-brown:            #{c.$color-brown-400},
);
```

`packages/ui/src/styles/theme/index.scss`:
```scss
@use '../mixins/spread-map' as mx;
@use 'light' as l;
@use 'dark' as d;
@use '../tokens/typography' as t;

:root {
  // 기본값: light 테마
  @include mx.spread-map(l.$theme-light);

  // Typography CSS 변수 노출
  --font-sans:  #{t.$font-sans};
  --font-serif: #{t.$font-serif};
  --font-mono:  #{t.$font-mono};

  --text-xs:   #{t.$text-xs};
  --text-sm:   #{t.$text-sm};
  --text-base: #{t.$text-base};
  --text-md:   #{t.$text-md};
  --text-lg:   #{t.$text-lg};
  --text-xl:   #{t.$text-xl};
  --text-2xl:  #{t.$text-2xl};
  --text-3xl:  #{t.$text-3xl};
  --text-4xl:  #{t.$text-4xl};
  --text-5xl:  #{t.$text-5xl};

  --weight-normal:   #{t.$weight-normal};
  --weight-medium:   #{t.$weight-medium};
  --weight-semibold: #{t.$weight-semibold};
  --weight-bold:     #{t.$weight-bold};

  --leading-tight:   #{t.$leading-tight};
  --leading-normal:  #{t.$leading-normal};
  --leading-relaxed: #{t.$leading-relaxed};
  --leading-loose:   #{t.$leading-loose};
}

:root.light,
[data-theme='light'] {
  @include mx.spread-map(l.$theme-light);
}

:root.dark,
[data-theme='dark'] {
  @include mx.spread-map(d.$theme-dark);
}
```

- [ ] **Step 2: 커밋**

```bash
git add packages/ui/src/styles/theme/
git commit -m "feat(ui): add semantic theme tokens (light/dark)"
```

---

### Task 5: Global 스타일 생성

**Files:**
- Create: `packages/ui/src/styles/global/_reset.scss`
- Create: `packages/ui/src/styles/global/_base.scss`
- Create: `packages/ui/src/styles/global/_typography.scss`

- [ ] **Step 1: reset 생성**

```bash
mkdir -p packages/ui/src/styles/global
```

`packages/ui/src/styles/global/_reset.scss`:
```scss
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
```

- [ ] **Step 2: base 생성**

`packages/ui/src/styles/global/_base.scss`:
```scss
@use '../tokens/breakpoints' as bp;

html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 13px;
  scrollbar-gutter: stable;

  @media (min-width: bp.$bp-sm) { font-size: 14px; }
  @media (min-width: bp.$bp-md) { font-size: 15px; }
  @media (min-width: bp.$bp-lg) { font-size: 16px; }
}

body {
  background:   var(--color-bg);
  color:        var(--color-text);
  font-family:  var(--font-sans);
  line-height:  var(--leading-normal);
  min-height:   100dvh;
  overflow-x:   hidden;
  padding-top:    env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left:   env(safe-area-inset-left);
  padding-right:  env(safe-area-inset-right);
}

button { font-family: inherit; cursor: pointer; }
a      { color: inherit; }
```

- [ ] **Step 3: typography 글로벌 스타일 생성**

`packages/ui/src/styles/global/_typography.scss`:
```scss
h1, h2, h3, h4, h5, h6 {
  font-weight: var(--weight-semibold);
  line-height: var(--leading-tight);
  letter-spacing: -0.02em;
}

code, kbd, samp, pre {
  font-family: var(--font-mono);
}
```

- [ ] **Step 4: 커밋**

```bash
git add packages/ui/src/styles/global/
git commit -m "feat(ui): add global styles (reset, base, typography)"
```

---

### Task 6: styles/index.scss 진입점 생성

**Files:**
- Create: `packages/ui/src/styles/index.scss`

- [ ] **Step 1: 진입점 생성**

`packages/ui/src/styles/index.scss`:
```scss
// @jinni/ui 스타일 진입점
// 앱에서 `import '@jinni/ui/styles/index.scss'` 로 임포트

@use 'global/reset';
@use 'global/base';
@use 'global/typography';
@use 'theme/index';
```

- [ ] **Step 2: 커밋**

```bash
git add packages/ui/src/styles/index.scss
git commit -m "feat(ui): add styles entry point (index.scss)"
```

---

### Task 7: apps/next 스타일 마이그레이션

**Files:**
- Modify: `apps/next/next.config.ts`
- Modify: `apps/next/src/styles/main.scss`
- Delete: `apps/next/src/styles/variables/` (4개 파일)
- Modify: `apps/next/src/app/layout.tsx` (스타일 import 확인)

- [ ] **Step 1: next.config.ts에 sassOptions 추가**

`apps/next/next.config.ts` 전체:
```ts
import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@jinni/ui', '@jinni/types'],
  eslint: {
    ignoreDuringBuilds: false,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, '../../packages/ui/src/styles')],
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
```

- [ ] **Step 2: apps/next/src/styles/main.scss 교체**

`apps/next/src/styles/main.scss`:
```scss
// Next.js 앱 스타일 진입점
@use 'tailwindcss';

// packages/ui 글로벌 스타일 (reset, base, theme, typography)
@use 'node_modules/@jinni/ui/src/styles/index';

// Tailwind v4 — CSS 변수를 Tailwind 클래스로 브리징 (Next 앱 전용)
@theme inline {
  --color-bg:           var(--color-bg);
  --color-bg-secondary: var(--color-bg-secondary);
  --color-text:         var(--color-text);
  --color-text-subtle:  var(--color-text-subtle);
  --color-border:       var(--color-border);
  --color-accent:       var(--color-accent);

  --color-red:    var(--color-red);
  --color-orange: var(--color-orange);
  --color-yellow: var(--color-yellow);
  --color-green:  var(--color-green);
  --color-blue:   var(--color-blue);
  --color-purple: var(--color-purple);
  --color-pink:   var(--color-pink);
}
```

- [ ] **Step 3: 기존 variables/ 폴더 삭제**

```bash
rm -rf apps/next/src/styles/variables
```

- [ ] **Step 4: apps/next 빌드 확인**

```bash
cd apps/next && pnpm dev
```

브라우저에서 `http://localhost:3000` 열어 스타일이 기존과 동일하게 보이는지 확인. 오류 없이 렌더링되면 통과.

- [ ] **Step 5: 커밋**

```bash
git add apps/next/next.config.ts apps/next/src/styles/main.scss
git commit -m "feat(next): migrate styles to @jinni/ui tokens — remove duplicate variables"
```

---

### Task 8: apps/react 스타일 마이그레이션

**Files:**
- Modify: `apps/react/vite.config.ts`
- Modify: `apps/react/src/main.tsx`
- Modify: `apps/react/src/styles/global.scss`
- Delete: `apps/react/src/styles/variables.scss`

- [ ] **Step 1: vite.config.ts 업데이트**

`apps/react/vite.config.ts` 전체:
```ts
import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr({ svgrOptions: { exportType: 'default' } }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [path.resolve(__dirname, '../../packages/ui/src/styles')],
      },
    },
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'https://jejinni.site',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

- [ ] **Step 2: main.tsx — @jinni/ui 글로벌 스타일 import 추가**

`apps/react/src/main.tsx`:
```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@jinni/ui/styles/index.scss';
import './styles/global.scss';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Step 3: global.scss 정리 — 앱 고유 스타일만 남김**

`apps/react/src/styles/global.scss`:
```scss
// apps/react 고유 스타일 (리셋/베이스/테마는 @jinni/ui/styles/index.scss에서)

// 포트폴리오 로딩 상태
.portfolio-loading {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);

  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-accent);
    box-shadow: 0 0 8px var(--color-accent);
    margin-right: 16px;
    flex-shrink: 0;
    animation: loading-pulse 1.2s ease-in-out infinite;
  }

  @keyframes loading-pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.15; }
  }

  &::after {
    content: 'JEJINNI.SITE / LOADING';
    color: var(--color-text-faint);
    font-family: var(--font-mono);
    font-size: 13px;
    letter-spacing: 0.16em;
  }
}
```

- [ ] **Step 4: variables.scss 삭제**

```bash
rm apps/react/src/styles/variables.scss
```

- [ ] **Step 5: apps/react 빌드 확인**

```bash
cd apps/react && pnpm dev
```

브라우저에서 `http://localhost:5173` 열어 스타일이 기존과 동일하게 보이는지 확인.

- [ ] **Step 6: packages/ui 구버전 variables 폴더 삭제**

```bash
rm -rf packages/ui/src/styles/variables
```

- [ ] **Step 7: 커밋**

```bash
git add apps/react/vite.config.ts apps/react/src/main.tsx apps/react/src/styles/global.scss
git commit -m "feat(react): migrate styles to @jinni/ui tokens — remove duplicate variables"
```

---

## Phase 2 — Storybook + Atoms

### Task 9: Storybook 설정

**Files:**
- Modify: `packages/ui/package.json`
- Create: `packages/ui/.storybook/main.ts`
- Create: `packages/ui/.storybook/preview.tsx`

- [ ] **Step 1: Storybook 의존성 추가**

```bash
cd packages/ui && pnpm add -D \
  storybook@^8 \
  @storybook/react@^8 \
  @storybook/react-vite@^8 \
  @storybook/addon-essentials@^8 \
  vite@^6
```

`packages/ui/package.json` scripts에 추가:
```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

- [ ] **Step 2: .storybook/main.ts 생성**

```bash
mkdir -p packages/ui/.storybook
```

`packages/ui/.storybook/main.ts`:
```ts
import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(tsx|ts)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: (config) => {
    config.css ??= {};
    config.css.preprocessorOptions ??= {};
    config.css.preprocessorOptions.scss ??= {};
    config.css.preprocessorOptions.scss.loadPaths = [
      path.resolve(__dirname, '../src/styles'),
    ];
    return config;
  },
};

export default config;
```

- [ ] **Step 3: .storybook/preview.tsx 생성**

`packages/ui/.storybook/preview.tsx`:
```tsx
import type { Preview } from '@storybook/react';
import '../src/styles/index.scss';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Theme',
      toolbar: {
        title: 'Theme',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'dark',
  },
  decorators: [
    (Story, context) => (
      <div
        data-theme={context.globals.theme ?? 'dark'}
        style={{ padding: '2rem', minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text)' }}
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;
```

- [ ] **Step 4: Storybook 실행 확인**

```bash
cd packages/ui && pnpm storybook
```

`http://localhost:6006` 열어 Storybook이 실행되는지 확인. (아직 story 없어 빈 화면 정상)

- [ ] **Step 5: 커밋**

```bash
git add packages/ui/.storybook packages/ui/package.json
git commit -m "feat(ui): add Storybook with theme decorator"
```

---

### Task 10: Button atom

**Files:**
- Create: `packages/ui/src/atoms/Button/Button.tsx`
- Create: `packages/ui/src/atoms/Button/button.module.scss`
- Create: `packages/ui/src/atoms/Button/Button.stories.tsx`
- Create: `packages/ui/src/atoms/Button/index.ts`

- [ ] **Step 1: Story 먼저 작성 (계약 정의)**

```bash
mkdir -p packages/ui/src/atoms/Button
```

`packages/ui/src/atoms/Button/Button.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story   = { args: { variant: 'primary', children: 'Click me' } };
export const Ghost: Story     = { args: { variant: 'ghost',   children: 'Cancel' } };
export const Outline: Story   = { args: { variant: 'outline', children: 'Outline' } };
export const Small: Story     = { args: { size: 'sm', children: 'Small' } };
export const Large: Story     = { args: { size: 'lg', children: 'Large' } };
export const Disabled: Story  = { args: { variant: 'primary', disabled: true, children: 'Disabled' } };
```

- [ ] **Step 2: Button 구현**

`packages/ui/src/atoms/Button/Button.tsx`:
```tsx
import styles from './button.module.scss';

export type ButtonVariant = 'primary' | 'ghost' | 'outline';
export type ButtonSize    = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={[styles.button, styles[variant], styles[size], className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
}
```

`packages/ui/src/atoms/Button/button.module.scss`:
```scss
@use '../../styles/tokens/typography' as t;

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-family: var(--font-sans);
  font-weight: #{t.$weight-medium};
  cursor: pointer;
  transition: transform 0.25s, background 0.25s, border-color 0.25s, color 0.25s, box-shadow 0.25s;

  &:disabled { opacity: 0.45; pointer-events: none; }
  &:hover    { transform: translateY(-1px); }
}

// Variants
.primary {
  background: var(--color-accent);
  color: var(--color-bg);
  &:hover { box-shadow: 0 8px 24px color-mix(in oklch, var(--color-accent), transparent 60%); }
}
.ghost {
  background: transparent;
  color: var(--color-text-subtle);
  &:hover { background: var(--color-bg-secondary); color: var(--color-text); }
}
.outline {
  background: transparent;
  border-color: var(--color-border);
  color: var(--color-text);
  &:hover { border-color: var(--color-accent); color: var(--color-accent); }
}

// Sizes
.sm { font-size: var(--text-xs); padding: 5px 12px; }
.md { font-size: var(--text-sm); padding: 8px 16px; }
.lg { font-size: var(--text-base); padding: 10px 20px; }
```

`packages/ui/src/atoms/Button/index.ts`:
```ts
export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';
```

- [ ] **Step 3: Storybook에서 확인**

```bash
cd packages/ui && pnpm storybook
```

`http://localhost:6006` → Atoms/Button 스토리 확인. light/dark 테마 전환 확인.

- [ ] **Step 4: 커밋**

```bash
git add packages/ui/src/atoms/Button/
git commit -m "feat(ui): add Button atom"
```

---

### Task 11: Tag atom

**Files:**
- Create: `packages/ui/src/atoms/Tag/Tag.tsx`
- Create: `packages/ui/src/atoms/Tag/tag.module.scss`
- Create: `packages/ui/src/atoms/Tag/Tag.stories.tsx`
- Create: `packages/ui/src/atoms/Tag/index.ts`

- [ ] **Step 1: Story 작성**

```bash
mkdir -p packages/ui/src/atoms/Tag
```

`packages/ui/src/atoms/Tag/Tag.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './Tag';

const meta: Meta<typeof Tag> = { title: 'Atoms/Tag', component: Tag, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = { args: { label: 'TypeScript' } };
export const Colored: Story = { args: { label: 'React', color: 'var(--color-blue)' } };
```

- [ ] **Step 2: Tag 구현**

`packages/ui/src/atoms/Tag/Tag.tsx`:
```tsx
import styles from './tag.module.scss';

export interface TagProps {
  label: string;
  color?: string;
  className?: string;
}

export function Tag({ label, color, className }: TagProps) {
  return (
    <span
      className={[styles.tag, className].filter(Boolean).join(' ')}
      style={color ? ({ '--tag-color': color } as React.CSSProperties) : undefined}
    >
      {label}
    </span>
  );
}
```

`packages/ui/src/atoms/Tag/tag.module.scss`:
```scss
.tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--tag-color, var(--color-text-subtle));
  letter-spacing: 0.04em;
  white-space: nowrap;
}
```

`packages/ui/src/atoms/Tag/index.ts`:
```ts
export { Tag } from './Tag';
export type { TagProps } from './Tag';
```

- [ ] **Step 3: Storybook 확인 후 커밋**

```bash
cd packages/ui && pnpm storybook
# Atoms/Tag 확인
git add packages/ui/src/atoms/Tag/
git commit -m "feat(ui): add Tag atom"
```

---

### Task 12: Badge atom

**Files:**
- Create: `packages/ui/src/atoms/Badge/Badge.tsx`
- Create: `packages/ui/src/atoms/Badge/badge.module.scss`
- Create: `packages/ui/src/atoms/Badge/Badge.stories.tsx`
- Create: `packages/ui/src/atoms/Badge/index.ts`

- [ ] **Step 1: Story 작성**

```bash
mkdir -p packages/ui/src/atoms/Badge
```

`packages/ui/src/atoms/Badge/Badge.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = { title: 'Atoms/Badge', component: Badge, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = { args: { label: 'internship' } };
export const Current: Story = { args: { label: 'current', variant: 'current' } };
export const Outline: Story = { args: { label: 'closed', variant: 'outline' } };
```

- [ ] **Step 2: Badge 구현**

`packages/ui/src/atoms/Badge/Badge.tsx`:
```tsx
import styles from './badge.module.scss';

export type BadgeVariant = 'default' | 'current' | 'outline';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ label, variant = 'default', className }: BadgeProps) {
  return (
    <span className={[styles.badge, styles[variant], className].filter(Boolean).join(' ')}>
      {label}
    </span>
  );
}
```

`packages/ui/src/atoms/Badge/badge.module.scss`:
```scss
.badge {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 999px;
  white-space: nowrap;
}

.default {
  border: 1px solid var(--color-border);
  color: var(--color-text-subtle);
  background: transparent;
}

.current {
  background: var(--color-accent);
  color: var(--color-bg);
  border-color: transparent;
}

.outline {
  border: 1px solid var(--color-border);
  color: var(--color-text-faint);
  background: transparent;
}
```

`packages/ui/src/atoms/Badge/index.ts`:
```ts
export { Badge } from './Badge';
export type { BadgeProps, BadgeVariant } from './Badge';
```

- [ ] **Step 3: 커밋**

```bash
git add packages/ui/src/atoms/Badge/
git commit -m "feat(ui): add Badge atom"
```

---

### Task 13: Icon atom

**Files:**
- Create: `packages/ui/src/atoms/Icon/Icon.tsx`
- Create: `packages/ui/src/atoms/Icon/icon.module.scss`
- Create: `packages/ui/src/atoms/Icon/Icon.stories.tsx`
- Create: `packages/ui/src/atoms/Icon/index.ts`

- [ ] **Step 1: Story 작성**

```bash
mkdir -p packages/ui/src/atoms/Icon
```

`packages/ui/src/atoms/Icon/Icon.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';

const meta: Meta<typeof Icon> = { title: 'Atoms/Icon', component: Icon, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: { src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23007AFF"/></svg>', alt: 'circle', size: 32 },
};
export const Small: Story = { args: { ...Default.args, size: 16 } };
export const Large: Story = { args: { ...Default.args, size: 48 } };
```

- [ ] **Step 2: Icon 구현**

`packages/ui/src/atoms/Icon/Icon.tsx`:
```tsx
import styles from './icon.module.scss';

export interface IconProps {
  src: string;
  alt?: string;
  size?: number;
  className?: string;
}

export function Icon({ src, alt = '', size = 24, className }: IconProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={[styles.icon, className].filter(Boolean).join(' ')}
    />
  );
}
```

`packages/ui/src/atoms/Icon/icon.module.scss`:
```scss
.icon {
  display: block;
  flex-shrink: 0;
  object-fit: contain;
}
```

`packages/ui/src/atoms/Icon/index.ts`:
```ts
export { Icon } from './Icon';
export type { IconProps } from './Icon';
```

- [ ] **Step 3: 커밋**

```bash
git add packages/ui/src/atoms/Icon/
git commit -m "feat(ui): add Icon atom"
```

---

### Task 14: Pill atom

**Files:**
- Create: `packages/ui/src/atoms/Pill/Pill.tsx`
- Create: `packages/ui/src/atoms/Pill/pill.module.scss`
- Create: `packages/ui/src/atoms/Pill/Pill.stories.tsx`
- Create: `packages/ui/src/atoms/Pill/index.ts`

- [ ] **Step 1: Story 작성**

```bash
mkdir -p packages/ui/src/atoms/Pill
```

`packages/ui/src/atoms/Pill/Pill.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Pill } from './Pill';

const meta: Meta<typeof Pill> = { title: 'Atoms/Pill', component: Pill, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Pill>;

export const Default: Story  = { args: { label: 'AVAILABLE' } };
export const WithDot: Story  = { args: { label: 'OPEN TO WORK', dot: true } };
```

- [ ] **Step 2: Pill 구현**

`packages/ui/src/atoms/Pill/Pill.tsx`:
```tsx
import styles from './pill.module.scss';

export interface PillProps {
  label: string;
  dot?: boolean;
  className?: string;
}

export function Pill({ label, dot = false, className }: PillProps) {
  return (
    <span className={[styles.pill, className].filter(Boolean).join(' ')}>
      {dot && <span className={styles.dot} />}
      {label}
    </span>
  );
}
```

`packages/ui/src/atoms/Pill/pill.module.scss`:
```scss
.pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 999px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-subtle);
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-green);
  box-shadow: 0 0 8px var(--color-green);
  animation: pulse 2s infinite;
  flex-shrink: 0;
}

@keyframes pulse {
  50% { opacity: 0.4; }
}
```

`packages/ui/src/atoms/Pill/index.ts`:
```ts
export { Pill } from './Pill';
export type { PillProps } from './Pill';
```

- [ ] **Step 3: 커밋**

```bash
git add packages/ui/src/atoms/Pill/
git commit -m "feat(ui): add Pill atom"
```

---

### Task 15: index.ts atoms export 추가

**Files:**
- Modify: `packages/ui/src/index.ts`

- [ ] **Step 1: atoms export 추가**

`packages/ui/src/index.ts` (전체):
```ts
// ── Atoms ────────────────────────────────────────────────────────────────────
export * from './atoms/Button';
export * from './atoms/Tag';
export * from './atoms/Badge';
export * from './atoms/Icon';
export * from './atoms/Pill';

// ── Hooks ────────────────────────────────────────────────────────────────────
export { useReveal }         from './hooks/useReveal';
export { useMouse }          from './hooks/useMouse';
export { useScrollProgress } from './hooks/useScrollProgress';

// ── Utils ────────────────────────────────────────────────────────────────────
export { formatPeriod, calcMonths, STATUS_LABELS } from './utils/project';

// ── Data ─────────────────────────────────────────────────────────────────────
export { PROFILE, LINKS } from './data/profile';
export type { ContactLink } from './data/profile';

// ── Legacy (deprecated) ──────────────────────────────────────────────────────
/** @deprecated use organisms/ProgressBar instead */
export { ScrollProgress } from './components/ScrollProgress';
/** @deprecated use organisms/Modal instead */
export { ProjectModal } from './variants/aurora/ProjectModal';
/** @deprecated use Theme instead */
export { AuroraVariant } from './variants/aurora/Aurora';
export { MarkdownRenderer } from './components/MarkdownRenderer';
```

- [ ] **Step 2: TypeScript 오류 없는지 확인**

```bash
cd packages/ui && npx tsc --noEmit
```

Expected: 오류 없음.

- [ ] **Step 3: 커밋**

```bash
git add packages/ui/src/index.ts
git commit -m "feat(ui): export atoms from index.ts"
```

---

## Phase 3 — Molecules + Organisms

### Task 16: Chip molecule

**Files:**
- Create: `packages/ui/src/molecules/Chip/Chip.tsx`
- Create: `packages/ui/src/molecules/Chip/chip.module.scss`
- Create: `packages/ui/src/molecules/Chip/Chip.stories.tsx`
- Create: `packages/ui/src/molecules/Chip/index.ts`

- [ ] **Step 1: Story 작성**

```bash
mkdir -p packages/ui/src/molecules/Chip
```

`packages/ui/src/molecules/Chip/Chip.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from './Chip';

const meta: Meta<typeof Chip> = { title: 'Molecules/Chip', component: Chip, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Chip>;

export const WithIcon: Story = {
  args: {
    label: 'React',
    icon: <img src="https://api.iconify.design/logos:react.svg" width={26} height={26} alt="React" />,
    accent: '#61DAFB',
  },
};
export const TextOnly: Story = { args: { label: 'TypeScript' } };
```

- [ ] **Step 2: Chip 구현**

`packages/ui/src/molecules/Chip/Chip.tsx`:
```tsx
import styles from './chip.module.scss';

export interface ChipProps {
  label: string;
  icon?: React.ReactNode;
  accent?: string;
  className?: string;
}

export function Chip({ label, icon, accent, className }: ChipProps) {
  return (
    <span
      className={[styles.chip, className].filter(Boolean).join(' ')}
      style={accent ? ({ '--chip-accent': accent } as React.CSSProperties) : undefined}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {label}
    </span>
  );
}
```

`packages/ui/src/molecules/Chip/chip.module.scss`:
```scss
.chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 13px 7px 7px;
  border-radius: 10px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  font-size: var(--text-sm);
  letter-spacing: -0.003em;
  color: var(--color-text);
  transition: transform 0.25s, border-color 0.25s, background 0.25s, box-shadow 0.25s;

  &:hover {
    transform: translateY(-2px);
    border-color: var(--chip-accent, var(--color-accent));
    box-shadow: 0 8px 24px color-mix(in oklch, var(--chip-accent, var(--color-accent)), transparent 72%);
  }
}

.icon {
  width: 26px;
  height: 26px;
  border-radius: 5px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
```

`packages/ui/src/molecules/Chip/index.ts`:
```ts
export { Chip } from './Chip';
export type { ChipProps } from './Chip';
```

- [ ] **Step 3: 커밋**

```bash
git add packages/ui/src/molecules/Chip/
git commit -m "feat(ui): add Chip molecule"
```

---

### Task 17: Accordion molecule

**Files:**
- Create: `packages/ui/src/molecules/Accordion/Accordion.tsx`
- Create: `packages/ui/src/molecules/Accordion/accordion.module.scss`
- Create: `packages/ui/src/molecules/Accordion/Accordion.stories.tsx`
- Create: `packages/ui/src/molecules/Accordion/index.ts`

- [ ] **Step 1: Story 작성**

```bash
mkdir -p packages/ui/src/molecules/Accordion
```

`packages/ui/src/molecules/Accordion/Accordion.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from './Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Molecules/Accordion',
  component: Accordion,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Accordion>;

export const Closed: Story = {
  args: { title: '주요 업무', children: '서비스 개발 및 유지보수' },
};
export const Open: Story = {
  args: { title: '주요 업무', children: '서비스 개발 및 유지보수', defaultOpen: true },
};
```

- [ ] **Step 2: Accordion 구현**

`packages/ui/src/molecules/Accordion/Accordion.tsx`:
```tsx
'use client';

import { useState } from 'react';
import styles from './accordion.module.scss';

export interface AccordionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function Accordion({ title, children, defaultOpen = false, className }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={[styles.accordion, open && styles.open, className].filter(Boolean).join(' ')}>
      <button className={styles.trigger} onClick={() => setOpen((v) => !v)}>
        <span>{title}</span>
        <span className={styles.arrow} aria-hidden>›</span>
      </button>
      {open && <div className={styles.body}>{children}</div>}
    </div>
  );
}
```

`packages/ui/src/molecules/Accordion/accordion.module.scss`:
```scss
.accordion {
  border-bottom: 1px solid var(--color-border);
}

.trigger {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  background: transparent;
  border: none;
  color: var(--color-text);
  font-size: var(--text-base);
  font-family: var(--font-sans);
  cursor: pointer;
  text-align: left;
  gap: 12px;
}

.arrow {
  font-size: var(--text-lg);
  color: var(--color-text-subtle);
  transition: transform 0.25s;
  flex-shrink: 0;

  .open & {
    transform: rotate(90deg);
  }
}

.body {
  padding: 0 0 16px;
  color: var(--color-text-subtle);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
}
```

`packages/ui/src/molecules/Accordion/index.ts`:
```ts
export { Accordion } from './Accordion';
export type { AccordionProps } from './Accordion';
```

- [ ] **Step 3: 커밋**

```bash
git add packages/ui/src/molecules/Accordion/
git commit -m "feat(ui): add Accordion molecule"
```

---

### Task 18: ProgressBar organism

**Files:**
- Create: `packages/ui/src/organisms/ProgressBar/ProgressBar.tsx`
- Create: `packages/ui/src/organisms/ProgressBar/progress-bar.module.scss`
- Create: `packages/ui/src/organisms/ProgressBar/ProgressBar.stories.tsx`
- Create: `packages/ui/src/organisms/ProgressBar/index.ts`

- [ ] **Step 1: Story 작성**

```bash
mkdir -p packages/ui/src/organisms/ProgressBar
```

`packages/ui/src/organisms/ProgressBar/ProgressBar.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Organisms/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = { args: {} };
export const CustomAccent: Story = {
  args: { accent: 'linear-gradient(90deg, var(--color-pink), var(--color-purple))' },
};
```

- [ ] **Step 2: ProgressBar 구현**

기존 `packages/ui/src/components/ScrollProgress.tsx`를 참고해 이전.

`packages/ui/src/organisms/ProgressBar/ProgressBar.tsx`:
```tsx
'use client';

import { useScrollProgress } from '../../hooks/useScrollProgress';
import styles from './progress-bar.module.scss';

export interface ProgressBarProps {
  accent?: string;
  className?: string;
}

export function ProgressBar({ accent, className }: ProgressBarProps) {
  const progress = useScrollProgress();

  return (
    <div
      className={[styles.bar, className].filter(Boolean).join(' ')}
      style={{
        background: accent ?? 'var(--color-accent)',
        transform: `scaleX(${progress})`,
      }}
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
}
```

`packages/ui/src/organisms/ProgressBar/progress-bar.module.scss`:
```scss
.bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 9999;
  transform-origin: left;
  transition: transform 0.1s linear;
  pointer-events: none;
}
```

`packages/ui/src/organisms/ProgressBar/index.ts`:
```ts
export { ProgressBar } from './ProgressBar';
export type { ProgressBarProps } from './ProgressBar';
```

- [ ] **Step 3: 커밋**

```bash
git add packages/ui/src/organisms/ProgressBar/
git commit -m "feat(ui): add ProgressBar organism"
```

---

### Task 19: Nav organism

**Files:**
- Create: `packages/ui/src/organisms/Nav/Nav.tsx`
- Create: `packages/ui/src/organisms/Nav/nav.module.scss`
- Create: `packages/ui/src/organisms/Nav/Nav.stories.tsx`
- Create: `packages/ui/src/organisms/Nav/index.ts`

- [ ] **Step 1: Story 작성**

```bash
mkdir -p packages/ui/src/organisms/Nav
```

`packages/ui/src/organisms/Nav/Nav.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Nav } from './Nav';

const meta: Meta<typeof Nav> = { title: 'Organisms/Nav', component: Nav, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Nav>;

const links = [
  { label: 'About',    href: '#about' },
  { label: 'Skills',   href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Career',   href: '#career' },
];

export const Dark: Story  = { args: { links, theme: 'dark' } };
export const Light: Story = { args: { links, theme: 'light' } };
export const WithToggle: Story = {
  args: { links, theme: 'dark', onToggleTheme: () => alert('toggle') },
};
```

- [ ] **Step 2: Nav 구현**

기존 `packages/ui/src/variants/aurora/Aurora.tsx`의 nav 부분 참고.

`packages/ui/src/organisms/Nav/Nav.tsx`:
```tsx
'use client';

import styles from './nav.module.scss';

export interface NavLink {
  label: string;
  href: string;
}

export interface NavProps {
  links: NavLink[];
  brand?: React.ReactNode;
  cta?: React.ReactNode;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  renderLink?: (href: string, children: React.ReactNode) => React.ReactNode;
  className?: string;
}

export function Nav({ links, brand, cta, theme = 'dark', onToggleTheme, renderLink, className }: NavProps) {
  const linkEl = (href: string, children: React.ReactNode) =>
    renderLink ? renderLink(href, children) : <a href={href}>{children}</a>;

  return (
    <div className={[styles.wrap, className].filter(Boolean).join(' ')}>
      <nav className={styles.nav}>
        {brand && <div className={styles.brand}>{brand}</div>}

        <ul className={styles.links}>
          {links.map((l) => (
            <li key={l.href}>
              {linkEl(l.href, <span className={styles.link}>{l.label}</span>)}
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          {cta}
          {onToggleTheme && (
            <button className={styles.themeToggle} onClick={onToggleTheme} aria-label="테마 전환">
              {theme === 'dark' ? '☀︎' : '◑'}
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}
```

`packages/ui/src/organisms/Nav/nav.module.scss`:
```scss
@use '../../styles/mixins/responsive' as rsp;

.wrap {
  position: sticky;
  top: 14px;
  z-index: 50;
  max-width: 1280px;
  margin: 14px auto 0;
  padding: 0 32px;

  @include rsp.max-width(md) { padding: 0 20px; }
}

.nav {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 10px 16px;
  background: color-mix(in oklch, var(--color-bg), transparent 55%);
  border: 1px solid var(--color-border);
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  border-radius: 999px;
  font-size: var(--text-sm);

  @include rsp.max-width(md) {
    display: flex;
    justify-content: space-between;
    padding: 8px 14px;
  }
}

.brand { display: flex; align-items: center; gap: 10px; font-weight: 600; }

.links {
  display: flex;
  gap: 2px;
  justify-self: center;
  list-style: none;
  padding: 0;
  margin: 0;

  @include rsp.max-width(md) { display: none; }
}

.link {
  display: block;
  font-size: var(--text-sm);
  color: var(--color-text-subtle);
  padding: 7px 12px;
  border-radius: 999px;
  cursor: pointer;
  text-decoration: none;

  &:hover { color: var(--color-text); background: var(--color-bg-secondary); }
}

.actions {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-self: end;
}

.themeToggle {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-base);
  transition: background 0.25s, border-color 0.25s, transform 0.35s;

  &:hover {
    border-color: var(--color-accent);
    transform: rotate(-15deg);
  }
}
```

`packages/ui/src/organisms/Nav/index.ts`:
```ts
export { Nav } from './Nav';
export type { NavProps, NavLink } from './Nav';
```

- [ ] **Step 3: 커밋**

```bash
git add packages/ui/src/organisms/Nav/
git commit -m "feat(ui): add Nav organism with renderLink pattern"
```

---

### Task 20: Card organism

**Files:**
- Create: `packages/ui/src/organisms/Card/Card.tsx`
- Create: `packages/ui/src/organisms/Card/card.module.scss`
- Create: `packages/ui/src/organisms/Card/Card.stories.tsx`
- Create: `packages/ui/src/organisms/Card/index.ts`

- [ ] **Step 1: Story 작성**

```bash
mkdir -p packages/ui/src/organisms/Card
```

`packages/ui/src/organisms/Card/Card.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = { title: 'Organisms/Card', component: Card, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    accent: 'var(--color-pink)',
    onClick: () => alert('clicked'),
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: 200, justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', color: 'var(--color-pink)' }}>01</span>
        <div>
          <div style={{ fontSize: '1.6rem', fontWeight: 600 }}>Project Title</div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-subtle)', marginTop: 8 }}>Description goes here</div>
        </div>
      </div>
    ),
  },
};
```

- [ ] **Step 2: Card 구현**

`packages/ui/src/organisms/Card/Card.tsx`:
```tsx
import styles from './card.module.scss';

export interface CardProps {
  accent?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Card({ accent, onClick, children, className }: CardProps) {
  return (
    <div
      className={[styles.card, onClick && styles.clickable, className].filter(Boolean).join(' ')}
      style={accent ? ({ '--card-accent': accent } as React.CSSProperties) : undefined}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <div className={styles.topLine} />
      {children}
    </div>
  );
}
```

`packages/ui/src/organisms/Card/card.module.scss`:
```scss
@use '../../styles/mixins/responsive' as rsp;

.card {
  position: relative;
  border-radius: 20px;
  padding: 28px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.4s, box-shadow 0.4s;
}

.clickable {
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    border-color: var(--card-accent, var(--color-accent));
    box-shadow: 0 20px 60px color-mix(in oklch, var(--card-accent, var(--color-accent)), transparent 80%);
  }
}

.topLine {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--card-accent, var(--color-accent)), transparent);
  opacity: 0.6;
}
```

`packages/ui/src/organisms/Card/index.ts`:
```ts
export { Card } from './Card';
export type { CardProps } from './Card';
```

- [ ] **Step 3: 커밋**

```bash
git add packages/ui/src/organisms/Card/
git commit -m "feat(ui): add Card organism"
```

---

### Task 21: Modal organism

**Files:**
- Create: `packages/ui/src/organisms/Modal/Modal.tsx`
- Create: `packages/ui/src/organisms/Modal/modal.module.scss`
- Create: `packages/ui/src/organisms/Modal/Modal.stories.tsx`
- Create: `packages/ui/src/organisms/Modal/index.ts`

- [ ] **Step 1: Story 작성**

```bash
mkdir -p packages/ui/src/organisms/Modal
```

`packages/ui/src/organisms/Modal/Modal.stories.tsx`:
```tsx
'use client';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal } from './Modal';

const meta: Meta<typeof Modal> = { title: 'Organisms/Modal', component: Modal, tags: ['autodocs'] };
export default meta;

export const Default = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>Open Modal</button>
        <Modal open={open} onClose={() => setOpen(false)}>
          <div style={{ padding: 32, color: 'var(--color-text)' }}>
            <h2>Modal Content</h2>
            <p style={{ marginTop: 12, color: 'var(--color-text-subtle)' }}>Modal body goes here.</p>
          </div>
        </Modal>
      </>
    );
  },
};
```

- [ ] **Step 2: Modal 구현**

`packages/ui/src/organisms/Modal/Modal.tsx`:
```tsx
'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './modal.module.scss';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, children, className }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={[styles.modal, className].filter(Boolean).join(' ')}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal
      >
        <div className={styles.closeRow}>
          <button className={styles.close} onClick={onClose} aria-label="닫기">✕</button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
```

`packages/ui/src/organisms/Modal/modal.module.scss`:
```scss
@use '../../styles/mixins/responsive' as rsp;

.overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  overflow-y: auto;
  background: transparent;
  animation: overlayIn 0.3s ease;

  @include rsp.min-width(md) {
    background: color-mix(in oklch, var(--color-bg), transparent 28%);
    backdrop-filter: blur(20px) saturate(140%);
  }
}

@keyframes overlayIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.modal {
  position: relative;
  width: 100%;
  max-width: 920px;
  background: var(--color-bg);
  display: flex;
  flex-direction: column;
  border: none;
  border-radius: 0;
  min-height: 100vh;
  margin: 0 auto;
  animation: modalIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);

  @include rsp.min-width(md) {
    border: 1px solid var(--color-border);
    border-radius: 22px;
    min-height: auto;
    margin: clamp(16px, 3vw, 40px) auto;
    box-shadow: 0 30px 80px color-mix(in oklch, var(--color-bg), transparent 50%);
  }
}

@keyframes modalIn {
  from { opacity: 0; transform: scale(0.97) translateY(12px); }
  to   { opacity: 1; transform: none; }
}

.closeRow {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: flex-end;
  padding: 16px 16px 0;
  background: var(--color-bg);
}

.close {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  cursor: pointer;
  font-size: var(--text-base);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.25s, transform 0.25s;

  &:hover { transform: rotate(90deg); background: var(--color-accent); color: var(--color-bg); border-color: var(--color-accent); }
}
```

`packages/ui/src/organisms/Modal/index.ts`:
```ts
export { Modal } from './Modal';
export type { ModalProps } from './Modal';
```

- [ ] **Step 3: 커밋**

```bash
git add packages/ui/src/organisms/Modal/
git commit -m "feat(ui): add Modal organism"
```

---

### Task 22: IconGrid organism

**Files:**
- Create: `packages/ui/src/organisms/IconGrid/IconGrid.tsx`
- Create: `packages/ui/src/organisms/IconGrid/icon-grid.module.scss`
- Create: `packages/ui/src/organisms/IconGrid/IconGrid.stories.tsx`
- Create: `packages/ui/src/organisms/IconGrid/index.ts`

- [ ] **Step 1: Story 작성**

```bash
mkdir -p packages/ui/src/organisms/IconGrid
```

`packages/ui/src/organisms/IconGrid/IconGrid.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { IconGrid } from './IconGrid';

const meta: Meta<typeof IconGrid> = { title: 'Organisms/IconGrid', component: IconGrid, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof IconGrid>;

export const Default: Story = {
  args: {
    rows: [
      {
        label: 'Frontend',
        items: [
          { name: 'React',      accent: '#61DAFB' },
          { name: 'TypeScript', accent: '#3178C6' },
          { name: 'Next.js',    accent: '#ffffff' },
        ],
      },
    ],
  },
};
```

- [ ] **Step 2: IconGrid 구현**

`packages/ui/src/organisms/IconGrid/IconGrid.tsx`:
```tsx
import { Chip } from '../../molecules/Chip';
import styles from './icon-grid.module.scss';

export interface IconGridItem {
  name: string;
  icon?: React.ReactNode;
  accent?: string;
}

export interface IconGridRow {
  label: string;
  subLabel?: string;
  items: IconGridItem[];
}

export interface IconGridProps {
  rows: IconGridRow[];
  className?: string;
}

export function IconGrid({ rows, className }: IconGridProps) {
  return (
    <div className={[styles.grid, className].filter(Boolean).join(' ')}>
      {rows.map((row) => (
        <div key={row.label} className={styles.row}>
          <div className={styles.rowLabel}>
            <span className={styles.ko}>{row.label}</span>
            {row.subLabel && <span className={styles.en}>{row.subLabel}</span>}
          </div>
          <div className={styles.chips}>
            {row.items.map((item) => (
              <Chip key={item.name} label={item.name} icon={item.icon} accent={item.accent} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

`packages/ui/src/organisms/IconGrid/icon-grid.module.scss`:
```scss
@use '../../styles/mixins/responsive' as rsp;

.grid {
  display: flex;
  flex-direction: column;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 18px;
  overflow: hidden;
}

.row {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 20px;
  align-items: center;
  padding: 22px 28px;

  & + & { border-top: 1px solid var(--color-border); }

  @include rsp.max-width(md) {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 20px;
  }
}

.rowLabel {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.ko {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: -0.01em;
}

.en {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-faint);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
```

`packages/ui/src/organisms/IconGrid/index.ts`:
```ts
export { IconGrid } from './IconGrid';
export type { IconGridProps, IconGridRow, IconGridItem } from './IconGrid';
```

- [ ] **Step 3: 커밋**

```bash
git add packages/ui/src/organisms/IconGrid/
git commit -m "feat(ui): add IconGrid organism"
```

---

### Task 23: index.ts molecules/organisms export 추가

**Files:**
- Modify: `packages/ui/src/index.ts`

- [ ] **Step 1: index.ts 전체 업데이트**

`packages/ui/src/index.ts`:
```ts
// ── Atoms ────────────────────────────────────────────────────────────────────
export * from './atoms/Button';
export * from './atoms/Tag';
export * from './atoms/Badge';
export * from './atoms/Icon';
export * from './atoms/Pill';

// ── Molecules ────────────────────────────────────────────────────────────────
export * from './molecules/Chip';
export * from './molecules/Accordion';

// ── Organisms ────────────────────────────────────────────────────────────────
export * from './organisms/Nav';
export * from './organisms/Card';
export * from './organisms/Modal';
export * from './organisms/IconGrid';
export * from './organisms/ProgressBar';

// ── Hooks ────────────────────────────────────────────────────────────────────
export { useReveal }         from './hooks/useReveal';
export { useMouse }          from './hooks/useMouse';
export { useScrollProgress } from './hooks/useScrollProgress';

// ── Utils ────────────────────────────────────────────────────────────────────
export { formatPeriod, calcMonths, STATUS_LABELS } from './utils/project';

// ── Data ─────────────────────────────────────────────────────────────────────
export { PROFILE, LINKS } from './data/profile';
export type { ContactLink } from './data/profile';

// ── Legacy (deprecated) ──────────────────────────────────────────────────────
/** @deprecated use ProgressBar instead */
export { ScrollProgress } from './components/ScrollProgress';
/** @deprecated use Modal instead */
export { ProjectModal } from './variants/aurora/ProjectModal';
/** @deprecated use Theme instead */
export { AuroraVariant } from './variants/aurora/Aurora';
export { MarkdownRenderer } from './components/MarkdownRenderer';
```

- [ ] **Step 2: TypeScript 오류 확인**

```bash
cd packages/ui && npx tsc --noEmit
```

Expected: 오류 없음.

- [ ] **Step 3: 커밋**

```bash
git add packages/ui/src/index.ts
git commit -m "feat(ui): export molecules and organisms from index.ts"
```

---

## Phase 4 — Theme 정리 + Aurora 제거

### Task 24: Theme.tsx 생성 (AuroraVariant 대체)

**Files:**
- Create: `packages/ui/src/theme/Theme.tsx`
- Create: `packages/ui/src/theme/theme.module.scss`
- Create: `packages/ui/src/theme/index.ts`

- [ ] **Step 1: 기존 Aurora.tsx 확인**

```bash
cat packages/ui/src/variants/aurora/Aurora.tsx
```

Aurora.tsx의 props, 내부 구조, 섹션 구성을 파악한다. Theme.tsx는 동일 props를 받아야 한다.

- [ ] **Step 2: Theme.tsx 생성**

`packages/ui/src/theme/Theme.tsx`:
```tsx
'use client';

import { useEffect } from 'react';
import { useMouse } from '../hooks/useMouse';
import { Nav } from '../organisms/Nav';
import { ProgressBar } from '../organisms/ProgressBar';
import styles from './theme.module.scss';
import type { PortfolioData } from '@jinni/types';

const PROGRESS_ACCENT = 'linear-gradient(90deg, oklch(78% 0.16 320), oklch(82% 0.14 200), oklch(82% 0.13 38))';

export interface ThemeProps {
  data: PortfolioData;
  dark: boolean;
  onToggleTheme: () => void;
  onProjectClick: (id: string, accent: string, idx: string) => void;
  renderLink?: (href: string, children: React.ReactNode) => React.ReactNode;
}

export function Theme({ data, dark, onToggleTheme, onProjectClick, renderLink }: ThemeProps) {
  const mouse = useMouse();

  // 테마 클래스 동기화
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const navLinks = [
    { label: 'About',    href: '#about' },
    { label: 'Skills',   href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Career',   href: '#career' },
    { label: 'Blog',     href: '#blog' },
  ];

  return (
    <div className={styles.theme} data-theme={dark ? 'dark' : 'light'}>
      <ProgressBar accent={PROGRESS_ACCENT} />

      {/* 배경 */}
      <div className={styles.bg}>
        <div className={`${styles.blob} ${styles.b1}`} />
        <div className={`${styles.blob} ${styles.b2}`} />
      </div>
      <div className={styles.grid} />

      {/* 커서 글로우 */}
      <div
        className={styles.cursor}
        style={{ left: mouse.x, top: mouse.y }}
      />

      {/* 네비게이션 */}
      <Nav
        links={navLinks}
        theme={dark ? 'dark' : 'light'}
        onToggleTheme={onToggleTheme}
        renderLink={renderLink}
      />

      {/* 메인 콘텐츠 */}
      <main className={styles.main}>
        {/* 각 섹션은 기존 Aurora.tsx에서 그대로 이전 */}
      </main>
    </div>
  );
}
```

> **주의:** `<main>` 내부 섹션들은 기존 `Aurora.tsx`의 JSX를 그대로 복사한다. 섹션 컴포넌트(HeroSection, SkillsSection 등)는 각 앱에서 관리하거나, 추후 organisms로 분리한다.

- [ ] **Step 3: theme.module.scss 생성**

`packages/ui/src/theme/theme.module.scss`:

기존 `aurora.scss`에서 `.aurora` → `.theme`, `.aurora-*` → 각 클래스로 rename. 색상 하드코딩 제거, CSS 변수 사용.

```scss
@use '../styles/tokens/colors' as c;
@use '../styles/mixins/responsive' as rsp;

.theme {
  --a1: #{c.$color-aurora-a1-dark};
  --a2: #{c.$color-aurora-a2-dark};
  --surface:   rgba(255, 255, 255, 0.025);
  --surface-2: rgba(255, 255, 255, 0.045);
  --surface-3: rgba(255, 255, 255, 0.075);
  --line:      rgba(255, 255, 255, 0.07);
  --line-2:    rgba(255, 255, 255, 0.13);
  --accent-soft: color-mix(in oklch, var(--a1), transparent 86%);
  --accent-glow: color-mix(in oklch, var(--a1), transparent 65%);

  &[data-theme='light'] {
    --a1: #{c.$color-aurora-a1-light};
    --a2: #{c.$color-aurora-a2-light};
    --surface:   rgba(11, 10, 20, 0.03);
    --surface-2: rgba(11, 10, 20, 0.06);
    --surface-3: rgba(11, 10, 20, 0.09);
    --line:      rgba(11, 10, 20, 0.08);
    --line-2:    rgba(11, 10, 20, 0.16);
  }

  color: var(--color-text);
  background: var(--color-bg);
  font-family: var(--font-sans);
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

// Background blobs
.bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
  filter: blur(70px) saturate(120%);
}

.blob {
  position: absolute;
  border-radius: 50%;
  mix-blend-mode: screen;
  opacity: 0.4;

  [data-theme='light'] & { mix-blend-mode: multiply; opacity: 0.32; }
}

.b1 {
  width: 55vw; height: 55vw;
  right: -8vw; top: -10vh;
  background: radial-gradient(circle, var(--a1) 0%, transparent 60%);
  animation: float1 30s ease-in-out infinite alternate;
}

.b2 {
  width: 50vw; height: 50vw;
  left: -12vw; bottom: -15vh;
  background: radial-gradient(circle, var(--a2) 0%, transparent 60%);
  animation: float2 36s ease-in-out infinite alternate;
}

@keyframes float1 { to { transform: translate(-6vw, 10vh) scale(1.08); } }
@keyframes float2 { to { transform: translate(8vw, -8vh) scale(0.92); } }

.grid {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  opacity: 0.35;
  background-image:
    linear-gradient(to right, var(--line) 1px, transparent 1px),
    linear-gradient(to bottom, var(--line) 1px, transparent 1px);
  background-size: 88px 88px;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, rgba(0,0,0,0.8), transparent 100%);
}

.cursor {
  position: fixed;
  pointer-events: none;
  z-index: 3;
  width: 460px;
  height: 460px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--accent-glow) 0%, transparent 60%);
  transform: translate(-50%, -50%);
  mix-blend-mode: screen;
  filter: blur(16px);
  opacity: 0.4;

  [data-theme='light'] & { mix-blend-mode: multiply; opacity: 0.22; }
}

.main {
  position: relative;
  z-index: 5;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px;

  @include rsp.max-width(sm) { padding: 0 20px; }
}
```

`packages/ui/src/theme/index.ts`:
```ts
export { Theme } from './Theme';
export type { ThemeProps } from './Theme';
```

- [ ] **Step 4: 커밋**

```bash
git add packages/ui/src/theme/
git commit -m "feat(ui): add Theme (replaces AuroraVariant)"
```

---

### Task 25: apps/react에서 Theme 사용 + localStorage key 변경

**Files:**
- Modify: `apps/react/src/App.tsx`

- [ ] **Step 1: App.tsx 업데이트**

`apps/react/src/App.tsx`에서:
- `AuroraVariant` → `Theme` import (ProgressBar는 Theme 내부에 포함됨, 별도 import 제거)
- `ScrollProgress` 제거 (Theme 내부에서 처리)
- `localStorage.getItem('aurora-theme')` → `localStorage.getItem('theme')`
- `localStorage.setItem('aurora-theme', ...)` → `localStorage.setItem('theme', ...)`

```tsx
import { Theme } from '@jinni/ui';  // AuroraVariant, ScrollProgress 제거
// ...

// useEffect 내:
try {
  if (localStorage.getItem('theme') === 'light') setDark(false);  // 'aurora-theme' → 'theme'
} catch {}

// useEffect dark 변경 시:
try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch {}

// JSX:
{data && (
  <Theme                          // AuroraVariant → Theme
    data={data}
    dark={dark}
    onToggleTheme={() => setDark((d) => !d)}
    onProjectClick={(id, accent, idx) =>
      navigate(`/projects/${id}`, { state: { accent, idx } })
    }
    renderLink={(href, children) => (
      <a href={href}>{children}</a>   // 또는 react-router Link
    )}
  />
)}
```

- [ ] **Step 2: apps/react 빌드 확인**

```bash
cd apps/react && pnpm dev
```

기존과 동일하게 렌더링되는지 확인.

- [ ] **Step 3: 커밋**

```bash
git add apps/react/src/App.tsx
git commit -m "feat(react): use Theme instead of AuroraVariant"
```

---

### Task 26: variants/aurora 제거 + packages/ui index.ts 정리

**Files:**
- Delete: `packages/ui/src/variants/aurora/`
- Modify: `packages/ui/src/index.ts`

- [ ] **Step 1: deprecated export 제거 후 aurora 폴더 삭제**

`packages/ui/src/index.ts`에서 legacy 주석 블록 전체 제거:
```ts
// ── Legacy (deprecated) — 아래 라인 모두 삭제
/** @deprecated use ProgressBar instead */
export { ScrollProgress } from './components/ScrollProgress';
/** @deprecated use Modal instead */
export { ProjectModal } from './variants/aurora/ProjectModal';
/** @deprecated use Theme instead */
export { AuroraVariant } from './variants/aurora/Aurora';
export { MarkdownRenderer } from './components/MarkdownRenderer';
```

대신 아래로 교체:
```ts
// ── Theme ────────────────────────────────────────────────────────────────────
export * from './theme';

// ── Misc ─────────────────────────────────────────────────────────────────────
export { MarkdownRenderer } from './components/MarkdownRenderer';  // 유지 (앱에서 사용 중)
```

- [ ] **Step 2: aurora 폴더 및 ScrollProgress 삭제**

```bash
rm -rf packages/ui/src/variants
rm packages/ui/src/components/ScrollProgress.tsx
# MarkdownRenderer는 삭제 금지 (apps/next에서 사용 중)
```

- [ ] **Step 3: TypeScript 오류 확인**

```bash
cd packages/ui && npx tsc --noEmit
```

Expected: 오류 없음. 오류 발생 시 참조 경로 수정.

- [ ] **Step 4: apps/react, apps/next 빌드 확인**

```bash
cd apps/react && pnpm build
cd apps/next && pnpm build
```

Expected: 빌드 성공.

- [ ] **Step 5: 커밋**

```bash
git add -A
git commit -m "feat(ui): remove Aurora variant — Theme is now primary"
```

---

### Task 27: apps/next 로컬 컴포넌트 → packages/ui organisms 교체

**Files:**
- Modify: `apps/next/src/app/_components/Tag/Tag.tsx`
- Modify: `apps/next/src/app/_components/SkillIcon/SkillIcon.tsx`
- Modify: `apps/next/src/app/_components/Nav/Nav.tsx`
- Modify: `apps/next/src/app/(sections)/ProjectsSection/ProjectCard/ProjectCard.tsx`
- Modify: `apps/next/src/app/@modal/(.)projects/[id]/page.tsx`

- [ ] **Step 1: Tag → @jinni/ui Tag 교체**

`apps/next/src/app/_components/Tag/Tag.tsx`:
```tsx
export { Tag } from '@jinni/ui';
export type { TagProps } from '@jinni/ui';
```

- [ ] **Step 2: SkillIcon → @jinni/ui Icon 교체**

`apps/next/src/app/_components/SkillIcon/SkillIcon.tsx`:
기존 SkillIcon의 `<img>` 렌더링을 `@jinni/ui`의 `Icon`으로 교체. 기존 skill-icon.scss는 삭제.

```tsx
import { Icon } from '@jinni/ui';
import type { SkillIcon as SkillIconType } from '@jinni/types';

interface SkillIconProps { skill: SkillIconType; size?: number; }

export function SkillIcon({ skill, size = 32 }: SkillIconProps) {
  return <Icon src={skill.iconUrl} alt={skill.name} size={size} />;
}
```

- [ ] **Step 3: ProjectCard → @jinni/ui Card 래핑**

`apps/next/src/app/(sections)/ProjectsSection/ProjectCard/ProjectCard.tsx`의 카드 컨테이너를 `Card`로 교체. 내부 콘텐츠(title, desc, stack 등)는 그대로 유지, 카드 외부 shell만 교체.

```tsx
import { Card, Tag } from '@jinni/ui';

export function ProjectCard({ project, idx, onOpenModal }: ProjectCardProps) {
  return (
    <Card accent={project.accent} onClick={() => onOpenModal(project.id, project.accent, idx)}>
      {/* 기존 내부 콘텐츠 유지 */}
    </Card>
  );
}
```

- [ ] **Step 4: Modal page → @jinni/ui Modal 래핑**

`apps/next/src/app/@modal/(.)projects/[id]/page.tsx`의 오버레이를 `Modal`로 교체.

- [ ] **Step 5: apps/next dev 서버 확인**

```bash
cd apps/next && pnpm dev
```

기존과 동일하게 렌더링되는지 확인. 스타일 깨짐 없는지 확인.

- [ ] **Step 6: 커밋**

```bash
git add apps/next/src/
git commit -m "feat(next): replace local components with @jinni/ui atoms/organisms"
```

---

### Task 28: apps/admin에 atoms/molecules 적용

**Files:**
- Modify: `apps/admin/package.json`
- Modify: `apps/admin/src/main.tsx` (또는 entry point)
- Modify: `apps/admin/src/App.tsx`

- [ ] **Step 1: @jinni/ui 의존성 추가**

```bash
cd apps/admin && pnpm add @jinni/ui
```

`apps/admin/src/main.tsx` (또는 `index.tsx`) 상단에 추가:
```tsx
import '@jinni/ui/styles/index.scss';
```

- [ ] **Step 2: App.css의 버튼/링크 스타일을 Button atom으로 교체**

`apps/admin/src/App.tsx`에서:
```tsx
import { Button } from '@jinni/ui';

// 기존 <button className="..."> 를 <Button variant="ghost">로 교체
// nav 링크는 그대로 유지 (admin 자체 nav 구조 유지)
```

- [ ] **Step 3: admin dev 서버 확인**

```bash
cd apps/admin && pnpm dev
```

기존과 동일하게 동작하는지 확인.

- [ ] **Step 4: 커밋**

```bash
git add apps/admin/
git commit -m "feat(admin): adopt @jinni/ui atoms (Button)"
```

---

## 완료 기준

- [ ] `pnpm storybook` — Storybook 6006 포트에서 모든 Story 확인 가능
- [ ] `cd apps/react && pnpm dev` — 포트폴리오 정상 렌더링, theme 전환 동작
- [ ] `cd apps/next && pnpm dev` — 포트폴리오 정상 렌더링, theme 전환 동작
- [ ] `cd apps/admin && pnpm dev` — admin 정상 동작
- [ ] `packages/ui/src/variants/` 폴더 없음
- [ ] `apps/next/src/styles/variables/` 폴더 없음
- [ ] `apps/react/src/styles/variables.scss` 파일 없음
- [ ] 코드베이스 어디에도 `aurora-theme` 문자열 없음
- [ ] hex 리터럴이 `packages/ui/src/styles/tokens/_colors.scss` 외에 없음 (그레이박스 특수값, rgba 투명도 제외)
