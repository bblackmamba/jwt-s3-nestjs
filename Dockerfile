FROM node:16-alpine AS base

WORKDIR /app
COPY ["package.json", "yarn.lock", "./"]

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]
