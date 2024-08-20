const { Sequelize } = require("sequelize");
const { MyBatisMapper, sequelize } = require(`../modules/sequelize`);
const { logger } = require(`../middlewares/winston`);
const { HTD } = require(`../models`);

async function login(req) {
  try {

    console.log('테스트 중')

    return 'success';
  } catch (e) {
    logger.error("testApi error");
    throw e;
  }
}



module.exports = {
  login,
}