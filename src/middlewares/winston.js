const fs = require("fs");
const winston = require("winston");
require('winston-daily-rotate-file');
require('date-utils');

const logDir = '../logs';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

const logger_inner = winston.createLogger({
  level: 'info',
  transports: [
      new winston.transports.DailyRotateFile({
          filename : '../logs/info.log',
          zippedArchive: true,
          format: winston.format.printf(
              info => `${new Date().toFormat('YYYY-MM-DD HH24:MI:SS')} [${JSON.stringify(info.message)}`)
      }),
      new winston.transports.Console({
        format: winston.format.printf(
          info => `${new Date().toFormat('YYYY-MM-DD HH24:MI:SS')} [${JSON.stringify(info.message)}`)
      })
  ]
})

const logger = winston.createLogger({
  level: 'debug',
  transports: [
      new winston.transports.DailyRotateFile({
          filename : '../logs/error.log',
          zippedArchive: true,
          format: winston.format.printf(
              info => `${new Date().toFormat('YYYY-MM-DD HH24:MI:SS')} [${info.level.toUpperCase()}] - ${info.message}`)
      }),
      new winston.transports.Console({
          format: winston.format.printf(
              info => `${new Date().toFormat('YYYY-MM-DD HH24:MI:SS')} [${info.level.toUpperCase()}] - ${info.message}`)
      })
  ]
});

const stream = {
  write: message => {
    logger_inner.info(message)
  }
}

module.exports = { logger, stream };