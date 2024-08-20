const path = require("path");
const Sequelize = require("sequelize");
const MyBatisMapper = require('mybatis-mapper');


const { logger } = require(`../middlewares/winston`);

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  pool: {
      max: 10, // 최대 커넥션 수
      min: 0, // 최소 커넥션 수
      acquire: 30000, // 커넥션 풀이 커넥션을 가져오기 위해 대기하는 시간 (밀리초)
      idle: 10000 // 커넥션 풀이 커넥션을 유지할 수 있는 최대 시간 (밀리초)
  },
  define: {
    freezeTableName: true,
    timestamps: false,
    dialectOptions: {
      charset: process.env.DB_CHARSET,
      collate: process.env.DB_COLLATE,
    },
  },
  // 쿼리 로그 사용 유무
  logging: console.log,
  // logging: false,
});



let db = async function(req, res, next) {
  req.envType = envType;
  req.sequelize = sequelize;
  next();
};

async function Transaction() {
  try {
      // 트랜잭션 시작
      const transaction = await sequelize.transaction();
      return transaction;
  } catch (e) {
    console.error(e);
    logger.error("Transaction error");
    throw e;
  }
}

module.exports = {
  db,
  sequelize,
  MyBatisMapper,
  Transaction,
};
