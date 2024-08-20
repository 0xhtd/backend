const jwt = require('jsonwebtoken');
const TOKEN_EXPIRED = -3
const TOKEN_INVALID = -2

const JwtSecretKey = process.env.PRIVATEKEY;
const JwtOption = {
  algorithm: process.env.JWT_OPTION_ALGORITHM,
  expiresIn: process.env.JWT_OPTION_EXPIRESIN,
}

// type은 사용자 유형 sys | oper | user
module.exports = {
  TOKEN_EXPIRED,
  TOKEN_INVALID,
  sign: async ({ id, type }) => {
    const token = jwt.sign(
      {
        id,
        type,
      },
      JwtSecretKey,
      JwtOption
    );
    return token;
  },
  verify: async ({ token }) => {
    let decoded;
    try {
      decoded = jwt.verify(token, JwtSecretKey);
    } catch (err) {
      if (err.message === 'jwt expired') {
        return TOKEN_EXPIRED;
      } else if (err.message === 'invalid token') {
        return TOKEN_INVALID;
      } else {
        return TOKEN_INVALID;
      }
    }
    return decoded;
  }
}