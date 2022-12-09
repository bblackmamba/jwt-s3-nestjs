# Nest JS University Project

## 1. Требования к системе

**Docker**, **Windows (WSL) / Unix**

## 2. Инициализация Docker-контейнеров

`$ cp .env.example .env`

`$ docker-compose build`

`$ docker-compose up -d`

Для выполнения команд внутри Docker-контейнера, выполнить в консоли:<br>
`$ docker exec -it jwt-s3-nestjs_app_1 sh`

## 3. Миграции

Внутри контейнера: <br>
`$ npm run migrate` - накатить <br>
`$ npm run migrate:down` - откатить
