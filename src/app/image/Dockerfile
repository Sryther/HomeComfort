FROM node:14-slim AS build

WORKDIR /usr/src/app
COPY . .
RUN npm install && \
    npm run build

FROM nginx

COPY --from=build /usr/src/app/build /usr/share/nginx/html
