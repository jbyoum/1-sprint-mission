# 빌드 스테이지
ARG NODE_VERSION=22.13.0
FROM node:${NODE_VERSION} AS build-stage
WORKDIR /build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build


# 실행 스테이지
FROM node:${NODE_VERSION}-slim
RUN apt-get update && apt-get install -y libssl3 && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build-stage /build/dist ./dist
COPY --from=build-stage /build/package*.json ./
COPY --from=build-stage /build/.env ./
COPY --from=build-stage /build/node_modules ./node_modules
COPY --from=build-stage /build/prisma ./prisma
COPY --from=build-stage /build/public ./public

RUN npm ci --omit=dev
ENV SERVER_PORT=3000

VOLUME /public

ENTRYPOINT sh -c "npx prisma migrate deploy && npm run start"

