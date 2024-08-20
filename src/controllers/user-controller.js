const { StatusCodes } = require('http-status-codes');
const response = require(`../middlewares/response`);
const { logger } = require(`../middlewares/winston`);


const userService = require(`../services/user`);

const login = async (req, res, next) => {
  try {
    let result = await userService.login(req);
    return res.status(StatusCodes.OK).json(response.Success('page_info', result));
  } catch (e) {
    console.error(e);
    logger.error("testApi error");
    return res.status(StatusCodes.BAD_REQUEST).json(response.CustomError(e));
  }
}


module.exports = {
  login,
}