FROM node:14-alpine AS builder

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

RUN npm run build:production

FROM nginx:alpine AS server

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /home/node/app/dist .

ARG PORT

EXPOSE $PORT

ENTRYPOINT ["nginx", "-g", "daemon off;"]
