# syntax=docker.io/docker/dockerfile:1

# Generate database and export geojson
# ARG GENERATOR_IMAGE=13_potentiel_solaire_mock_data
ARG GENERATOR_IMAGE=ghcr.io/dataforgoodfr/13_potentiel_solaire_db:0.1.0.20250629
FROM ${GENERATOR_IMAGE} AS generator

FROM node:18-slim AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
	if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
	elif [ -f package-lock.json ]; then npm ci; \
	elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
	else echo "Lockfile not found." && exit 1; \
	fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Copy generated files from first stage - necessary for the build
COPY --from=generator /app/output/db /app/database
COPY --from=generator /app/output/geojson /app/public/data

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

ARG DATABASE_PATH=/app/database/data.duckdb
ENV DATABASE_PATH=${DATABASE_PATH}

# ERROR
RUN \
	if [ -f yarn.lock ]; then yarn run build; \
	elif [ -f package-lock.json ]; then npm run build; \
	elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
	else echo "Lockfile not found." && exit 1; \
	fi

# Production image, copy all the files and run next
FROM node:18-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1
# Temporary fixes the "Can't find the home directory at '/nonexistent'" error for duckdb extension installation @see https://github.com/duckdb/duckdb/issues/3855
ENV HOME=/tmp

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
# Copy generated files from first stage
COPY --from=generator /app/output/db /app/database
COPY --from=generator /app/output/geojson /app/public/data

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV DATABASE_PATH=/app/database/data.duckdb
ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
