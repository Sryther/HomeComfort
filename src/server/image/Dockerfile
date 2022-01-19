FROM node:14-slim as tsc-builder
WORKDIR /usr/src/app

COPY . .
RUN apt-get update || : && apt-get install python build-essential -y && \
    yarn install && yarn run tsc && \
    rm -rf /var/cache/apk/*

FROM node:14-slim as runtime-container
WORKDIR /usr/src/app

COPY --from=tsc-builder /usr/src/app/dist ./build
COPY --from=tsc-builder ["/usr/src/app/package.json", "/usr/src/app/yarn.lock", "./"]

RUN apt update || : && apt install python build-essential -y && \
    rm -rf /var/cache/apk/* && \
    yarn install --prod && \
    apt remove python build-essential -y

EXPOSE 3000

CMD ["node", "./build/index"]
