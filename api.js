import express from 'express'
import fs from 'fs'
import morgan from 'morgan'

import CorsMiddleware from './config/Cors.config.js'
import {
  NODE_ENV,
  PORT,
  JWT_SECRET,
  SESSION_SECRET,
  COOKIE_SECRET,
  CSRF_SECRET,
  MONGO_URI,
} from './config/Environment.config.js'
import ConnectToDatabase from './config/Mongoose.config.js'
import SecurityMiddlewares, {
  CookieParserMiddleware,
  CsrfProtection,
  Limiter,
  SlowDownLimiter,
} from './config/Security.config.js'
import i18nMiddleware from './config/i18n.config.js'
import Logger from './config/Logger.config.js'
import SessionMiddleware from './config/Session.config.js'
import ServerConfig from './config/Server.config.js'

import ErrorMiddleware from './middlewares/Error.middleware.js'

import CookiesHelper from './helpers/Cookies.helper.js'
import IpHelper from './helpers/Ip.helper.js'

const app                                   = express()

const PRIVATE_KEY                           = fs.readFileSync('jwt.key', 'utf8')
const PUBLIC_KEY                            = fs.readFileSync('jwt.key.pub', 'utf8')

const LogLevels                             = (statusCode) => {
  if(statusCode >= 400)
    return 'error'

  else if(statusCode >= 300)
    return 'warn'

  else if(statusCode >= 200)
    return 'info'

  else
    return 'debug'
}

app.set('PRIVATE_KEY', PRIVATE_KEY)
app.set('PUBLIC_KEY', PUBLIC_KEY)

app.set('trust proxy', ServerConfig.trustProxy)
app.disable('x-powered-by')

morgan.token('ipAddressOrUserId', (req) => CookiesHelper.GetUserIdCookie(req) || IpHelper.GetClientIp(req))
morgan.token('status', (req, res) => res.statusCode)

app.use(morgan(':method :url :status :ipAddressOrUserId :user-agent :response-time', {
  stream                                    : {
    write                                   : (message) => {
      // Extract status code from the message
      const statusMatch                     = message.match(/ (\d{3}) /)
      const statusCode                      = statusMatch ? parseInt(statusMatch[ 1 ], 10) : 200
      const levels                          = LogLevels(statusCode)
      
      Logger.log(levels, message.trim())
    }
  }
}))

app.use(CorsMiddleware)
app.use(CookieParserMiddleware)
app.use(i18nMiddleware)
app.use(Limiter)
app.use(SecurityMiddlewares())
app.use(SessionMiddleware)
app.use(SlowDownLimiter)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

import IndexRouter from './routes/index.route.js'

app.use('/api', [ CsrfProtection.csrfSynchronisedProtection ], IndexRouter)
app.use((req, res) => res.status(404).send('Route not found.'))

app.use(ErrorMiddleware.ErrorHandler)

app.listen(ServerConfig.port, async () => {
  console.log(`Server running in ${ NODE_ENV } mode on port ${ PORT }`)

  await ConnectToDatabase()
})

export {
  app as default,
}
