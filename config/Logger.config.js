import winston from 'winston'

import 'winston-mongodb'

import { MONGO_URI } from './Environment.config.js'

/**
 * Logger configuration
 */
const Logger                                = winston.createLogger({
  level                                     : 'info',
  format                                    : winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports                                : [
    new winston.transports.Console({
      format                                : winston.format.simple(),
    }),
    new winston.transports.File({
      filename                              : 'logs/error.log',
      level                                 : 'error',
    }),
    new winston.transports.File({
      filename                              : 'logs/combined.log',
    }),
    new winston.transports.MongoDB({
      db                                    : MONGO_URI,
      collection                            : 'logs',
      level                                 : 'info',
      tryReconnect                          : true,
    }),
  ],
})

export {
  Logger as default,
}
