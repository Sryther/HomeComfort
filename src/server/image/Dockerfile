FROM arm32v7/node:22-slim AS tsc-builder
WORKDIR /usr/src/app

COPY . .
RUN apt-get update && apt-get install python3 build-essential -y && \
    yarn install && yarn run tsc && \
    rm -rf /var/cache/apk/*

FROM arm32v7/node:22-slim AS runtime-container
WORKDIR /usr/src/app

COPY --from=tsc-builder /usr/src/app/dist ./build
COPY --from=tsc-builder ["/usr/src/app/package.json", "/usr/src/app/yarn.lock", "./"]

RUN apt update && apt install python3 build-essential inetutils-ping -y && \
    rm -rf /var/cache/apk/* && \
    yarn install --prod && \
    apt remove python3 build-essential -y

EXPOSE 3000

CMD ["node", "./build/index"]
