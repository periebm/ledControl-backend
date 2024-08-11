FROM node:20-alpine AS build

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

COPY package*.json ./
RUN npm install

COPY . .
COPY --chown=node:node . .

RUN npm run build

# Etapa de produção
FROM node:20-alpine AS production

WORKDIR /home/node/app

COPY package*.json ./
RUN npm ci --production --ignore-scripts

COPY --from=build /home/node/app/build ./build

USER node