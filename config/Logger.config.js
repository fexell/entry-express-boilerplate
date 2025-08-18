import winston from 'winston'

import ConnectToDatabase from './Mongoose.config.js'

import { MONGO_URI } from './Environment.config.js'

import 'winston-mongodb'

const Logger                                = winston.createLogger({
  level                                     : 'info',
  format                                    : winston.format.json(),
  transports                                : [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
})

const transportOptions                      = {
  db                                        : MONGO_URI,
  collection                                : 'winston-logs',
}

Logger.add(new winston.transports.MongoDB(transportOptions))

export {
  Logger as default,
}
