FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/ui/package.json packages/ui/package.json

RUN pnpm install --frozen-lockfile

COPY apps/web apps/web
COPY packages packages

RUN pnpm --filter @invoice/db db:generate
RUN pnpm --filter web build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable

COPY --from=base /app/apps/web/.next apps/web/.next
COPY --from=base /app/apps/web/public apps/web/public
COPY --from=base /app/apps/web/package.json apps/web/package.json
COPY --from=base /app/node_modules node_modules
COPY --from=base /app/packages packages
COPY --from=base /app/pnpm-lock.yaml pnpm-lock.yaml
COPY --from=base /app/pnpm-workspace.yaml pnpm-workspace.yaml

EXPOSE 3000

CMD ["pnpm", "--filter", "web", "start"]
