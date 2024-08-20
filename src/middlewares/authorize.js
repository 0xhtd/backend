const jwt = require('./jwt');
const { StatusCodes } = require('http-status-codes');
const response = require('../middlewares/response');
const responseMessage = require('../metadata/responseMessage')

const authorizationUser = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(StatusCodes.UNAUTHORIZED).send(response.CustomError(responseMessage.EMPTY_TOKEN));
  }

  const token = authorization;
  const jwtToken = await jwt.verify({ token });

  if (jwtToken === jwt.TOKEN_EXPIRED)
    return res.status(StatusCodes.UNAUTHORIZED).send(response.CustomError(responseMessage.EXPIRED_TOKEN));
  if (jwtToken === jwt.TOKEN_INVALID)
    return res.status(StatusCodes.UNAUTHORIZED).send(response.CustomError(responseMessage.INVALID_TOKEN));
  if (jwtToken.id === undefined)
    return res.status(StatusCodes.UNAUTHORIZED).send(response.CustomError(responseMessage.INVALID_TOKEN));
  if (jwtToken.type !== '01')
    return res.status(StatusCodes.NOT_ACCEPTABLE).send(response.CustomError(responseMessage.NOT_USER));

  req.jwt = jwtToken

  next();
}

const authorizationOper = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(StatusCodes.UNAUTHORIZED).send(response.CustomError(responseMessage.EMPTY_TOKEN));
  }

  const token = authorization;
  const jwtToken = await jwt.verify({ token });

  if (jwtToken === jwt.TOKEN_EXPIRED)
    return res.status(StatusCodes.UNAUTHORIZED).send(response.CustomError(responseMessage.EXPIRED_TOKEN));
  if (jwtToken === jwt.TOKEN_INVALID)
    return res.status(StatusCodes.UNAUTHORIZED).send(response.CustomError(responseMessage.INVALID_TOKEN));
  if (jwtToken.id === undefined)
    return res.status(StatusCodes.UNAUTHORIZED).send(response.CustomError(responseMessage.INVALID_TOKEN));
  if (jwtToken.type !== '02')
    return res.status(StatusCodes.NOT_ACCEPTABLE).send(response.CustomError(responseMessage.NOT_OPER));

  req.jwt = jwtToken

  next();
}

const authorizationSys = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(StatusCodes.UNAUTHORIZED).send(response.CustomError(responseMessage.EMPTY_TOKEN));
  }

  const token = authorization;
  const jwtToken = await jwt.verify({ token });

  if (jwtToken === jwt.TOKEN_EXPIRED)
    return res.status(StatusCodes.UNAUTHORIZED).send(response.CustomError(responseMessage.EXPIRED_TOKEN));
  if (jwtToken === jwt.TOKEN_INVALID)
    return res.status(StatusCodes.UNAUTHORIZED).send(response.CustomError(responseMessage.INVALID_TOKEN));
  if (jwtToken.id === undefined)
    return res.status(StatusCodes.UNAUTHORIZED).send(response.CustomError(responseMessage.INVALID_TOKEN));
  if (jwtToken.type !== '03')
    return res.status(StatusCodes.NOT_ACCEPTABLE).send(response.CustomError(responseMessage.NOT_SYS));

  req.jwt = jwtToken

  next();
}

const checkAuthorization = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(StatusCodes.UNAUTHORIZED).send(response.CustomError(responseMessage.EMPTY_TOKEN));
  }

  const token = authorization;
  const jwtToken = await jwt.verify({ token });

  // 유효기간 만료
  if (jwtToken === jwt.TOKEN_EXPIRED)
    return res.status(StatusCodes.UNAUTHORIZED).send(response.CustomError(responseMessage.EXPIRED_TOKEN));
  // 유효하지 않는 토큰
  if (jwtToken === jwt.TOKEN_INVALID)
    return res.status(StatusCodes.UNAUTHORIZED).send(response.CustomError(responseMessage.INVALID_TOKEN));
  if (jwtToken.id === undefined)
    return res.status(StatusCodes.UNAUTHORIZED).send(response.CustomError(responseMessage.INVALID_TOKEN));

  req.jwt = jwtToken

  next();
}

module.exports = {
  authorizationUser,
  authorizationOper,
  authorizationSys,
  checkAuthorization,
}