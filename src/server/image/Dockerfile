FROM node:14-slim as tsc-builder
WORKDIR /usr/src/app

COPY . .
RUN apt-get update || : && apt-get install python build-essential -y && \
    yarn install && yarn run tsc


FROM node:14-slim as runtime-container
WORKDIR /usr/src/app

COPY --from=tsc-builder /usr/src/app/dist ./build
COPY --from=tsc-builder ["/usr/src/app/package.json", "/usr/src/app/yarn.lock", "./"]

RUN yarn install --prod

EXPOSE 3000

CMD ["node", "./build/index"]
