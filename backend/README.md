## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
$ add .env file or make env by own desition
$ APP_VERSION=1.0.1
$ APP_PORT=3000 # default values
$ DB_DIALECT='postgres' # default values
$ DB_HOST='localhost' # default values
$ DB_PORT=5432 # default values
$ DB_USERNAME='user' # default values
$ DB_PASSWORD='password' # default values
$ DB_DATABASE='postgres' # default values
$ EMAIL_SERVICE='gmail | other'
$ EMAIL_USERNAME=''
$ EMAIL_PASSWORD=''
$ APP_URL='http://127.0.0.1:3000'
$ JWT_SECRET='secret jwt'
$ JWT_EXPIRES_IN='20d' # for example
```

## Migrations

```bash
# make migration file
$ npx sequelize-cli migration:generate --name create-user

# run migrations (no needed if used one of npm run [start, build] commands)
$ npx sequelize-cli db:migrate
```

## Running the app

```bash
# Database
$ docker compose up (or you can use your own posgresql db)

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
