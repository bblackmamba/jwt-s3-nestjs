FROM node:16-alpine

USER node

RUN mkdir /home/node/app
WORKDIR /home/node/app
COPY . /home/node/app

RUN npm install

RUN npm run migrate

COPY . .

COPY ./dist ./dist

CMD ["npm", "run", "start:dev"]
