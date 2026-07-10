# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=22.11.0
FROM arm32v7/node:${NODE_VERSION}-slim AS deps
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS build
COPY . .
RUN npm run build

FROM nginx:1.27-alpine-slim AS runtime
COPY --from=build /usr/src/app/build /usr/share/nginx/html


EXPOSE 80
