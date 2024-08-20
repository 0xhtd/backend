const { Client: PGClient } = require("pg");
require("dotenv").config();

const dbClient = new PGClient({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DB_PORT || 5432, // 포트는 환경 변수로 설정, 기본값은 5432
});

module.exports = dbClient;
