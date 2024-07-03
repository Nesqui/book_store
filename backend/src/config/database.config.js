require('dotenv').config()
require('fs');

const config = {
  username: process.env.DB_USERNAME || 'user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  dialect: process.env.DB_DIALECT || 'postgres',
  models: [__dirname + '/../**/*.model.ts'],
  port: +process.env.DB_PORT || 5432,
};

module.exports = config;