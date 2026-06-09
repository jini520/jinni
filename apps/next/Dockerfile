# Client (Next.js SSR) 프로덕션 Dockerfile
# 빌드 컨텍스트: 모노레포 루트 (docker build -f apps/next/Dockerfile .)
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

WORKDIR /app

# 의존성 메타 먼저 복사 (캐시 활용)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/types/package.json ./packages/types/
COPY packages/ui/package.json ./packages/ui/
COPY packages/common/package.json ./packages/common/
COPY apps/next/package.json ./apps/next/

RUN pnpm install --frozen-lockfile

# 소스 복사
COPY packages/types ./packages/types
COPY packages/ui ./packages/ui
COPY packages/common ./packages/common
COPY apps/next ./apps/next

# 빌드 (해당 앱만)
RUN pnpm --filter @jinni/next build

# ── 실행 단계 (next start, SSR) ──
FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

WORKDIR /app/apps/next

# standalone 미사용이라 node_modules/.next/public/설정/워크스페이스가 모두 필요 → /app 통째로 복사
COPY --from=builder /app /app

EXPOSE 3000

CMD ["pnpm", "start"]
