FROM node:20.10.0-slim

ENV NODE_ENV development

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

CMD [ "node", "index.js" ]

EXPOSE 5000
