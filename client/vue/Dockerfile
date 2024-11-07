FROM node:20-alpine

WORKDIR /

COPY ./tsconfig.base.json .
COPY ./public ./public
COPY ./client/vue/package*.json ./client/vue/

RUN npm ci --legacy-peer-deps --prefix ./client/vue

COPY ./client/vue ./client/vue

EXPOSE 5174

CMD ["npm", "--prefix", "client/vue", "run", "dev"]