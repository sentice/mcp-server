# Користиме Node 20 LTS
FROM node:20-alpine

# Работен директориум
WORKDIR /usr/src/app

# Инсталирај curl за healthcheck
RUN apk add --no-cache curl

# Инсталација на зависности
COPY package*.json ./
RUN npm install

# Копирање на TypeScript фајловите и TS конфиг
COPY tsconfig.json ./
COPY src ./src

# Build во dist/
RUN npm run build

# MCP серверот ќе слуша на 3000
EXPOSE 3000

# Старт на компајлираниот MCP server
CMD ["npm", "run", "start"]
