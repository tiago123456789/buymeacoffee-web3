FROM node:alpine

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./

RUN npm install && npm i -g @nestjs/cli

COPY . . 

RUN npm run build

CMD ["node", "/app/dist/src/main"]
