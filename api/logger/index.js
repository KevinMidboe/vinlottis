const winston = require('winston');
const httpContext = require("express-http-context");

const logLevel = 'trace';

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    debug: 4,
    trace: 5
  },
  colors: {
    trace: 'blue',
    debug: 'white',
    info: 'green',
    warning: 'yellow',
    error: 'red',
    fatal: 'red'
  }
};

const appendSessionId = winston.format(info => {
  info.sessionId = httpContext.get("sessionId");
  return info
});


const logger = winston.createLogger({
  level: logLevel,
  levels: customLevels.levels,
  transports: [
    new winston.transports.File({
      filename: `${__base}/logs/all-logs.log`,
      format: winston.format.combine(
        appendSessionId(),
        winston.format.json()
      )
    })
  ]
});

winston.addColors(customLevels.colors);

if (process.env.NODE_ENV !== 'production') {

  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
};

module.exports = logger;