FROM node:20-alpine

WORKDIR /

COPY ./tsconfig.base.json .
COPY ./public ./public
COPY ./client/react/package*.json ./client/react/

RUN npm ci --legacy-peer-deps --prefix ./client/react

COPY ./client/react ./client/react

EXPOSE 5173

CMD ["npm", "--prefix", "client/react", "run", "dev"]