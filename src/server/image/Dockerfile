# syntax=docker/dockerfile:1.6

FROM arm32v7/node:22-slim AS deps
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && yarn install --frozen-lockfile \
  && rm -rf /var/lib/apt/lists/*

FROM deps AS build
WORKDIR /usr/src/app

COPY . .
RUN yarn run tsc

RUN yarn install --frozen-lockfile --production=true --ignore-scripts \
  && yarn cache clean

FROM arm32v7/node:22-slim AS runtime
WORKDIR /usr/src/app
ENV NODE_ENV=production

RUN useradd -m -u 10001 nodeuser && \
    usermod -aG dialout nodeuser && \
    apt update && \
    apt install -y iputils-ping && \
    rm -rf /var/lib/apt/lists/*

USER nodeuser

COPY --from=build /usr/src/app/dist ./build
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json

EXPOSE 3000
CMD ["node", "./build/index"]
