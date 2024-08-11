# Etapa de build
FROM node:20-alpine AS build

# Crie o diretório de trabalho e defina as permissões
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

# Copie os arquivos package*.json e instale as dependências de desenvolvimento
COPY package*.json ./
RUN npm install

# Copie os arquivos da aplicação
COPY . .
COPY --chown=node:node . .

# Transpile o código TypeScript para JavaScript
RUN npm run build

# Etapa de produção
FROM node:20-alpine AS production

WORKDIR /home/node/app

COPY package*.json ./
RUN npm ci --production --ignore-scripts

COPY --from=build /home/node/app/build ./build

USER node