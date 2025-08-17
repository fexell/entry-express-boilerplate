import winston from 'winston'

const Logger                                = winston.createLogger({
  level                                   : 'error',
  format                                  : winston.format.json(),
  transports                              : [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
})

export {
  Logger as default,
}
