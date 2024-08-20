const { header, query, body, param, validationResult, oneOf } = require("express-validator");
const resposne = require('../middlewares/response');
const { StatusCodes } = require("http-status-codes");
const responseMessage = require("../metadata/responseMessage");

const validatorErrorChecker = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let path = errors.array()[0].path;
    return res.status(StatusCodes.BAD_REQUEST).send(resposne.CustomError(`${path} ${responseMessage.NOT_FOUND}`));
  }
  next();
}

// 둘중에 하나 이상 값이 있을 경우
// 둘다 null 일경우
const oneValueExists = (keys) => (req, res, next) => {
  let count = 0;
  for (const key of keys) {
      if (req.body[key]) {
          count++;
      }
  }
  if (count >= 1) {
      return next();
  }
  return res.status(StatusCodes.BAD_REQUEST).send(resposne.CustomError(responseMessage.BAD_REQUEST));
};
module.exports = {
  header,
  query,
  body,
  param,
  oneOf,
  validatorErrorChecker,
  oneValueExists,
}