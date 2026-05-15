# syntax=docker/dockerfile:1
# ---- Base ----
FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# ---- Builder ----
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS=--no-deprecation
# Real PAYLOAD_SECRET / DATABASE_URL are injected at runtime by Dokploy.
ENV PAYLOAD_SECRET=build-time-placeholder
# Regenerate the admin import map so the multi-tenant plugin UI registers.
RUN npm run generate:importmap
RUN npm run build

# ---- Runner ----
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS=--no-deprecation
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
COPY --from=builder /app ./
EXPOSE 3000
CMD ["npm", "start"]
