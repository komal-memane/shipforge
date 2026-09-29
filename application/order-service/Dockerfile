FROM node:24-alpine

WORKDIR /app

RUN apk upgrade --no-cache

COPY package*.json ./

RUN npm install --omit=dev \
    && rm -rf /usr/local/lib/node_modules/npm \
              /usr/local/lib/node_modules/corepack

COPY src ./src
COPY sql ./sql

EXPOSE 3001

CMD ["node", "src/server.js"]