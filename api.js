import bodyParser from 'body-parser'
import express from 'express'
import fs from 'fs'
import { t } from 'i18next'
import morgan from 'morgan'
import useragent from 'express-useragent'

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

import LogModel from './models/Log.model.js'

import CookiesHelper from './helpers/Cookies.helper.js'
import IpHelper from './helpers/Ip.helper.js'

// The express instance
const app                                   = express()

// Private and public key for jwt
const PRIVATE_KEY                           = fs.readFileSync('jwt.key', 'utf8')
const PUBLIC_KEY                            = fs.readFileSync('jwt.key.pub', 'utf8')

// Log levels for morgan
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

// Set global variables
app.set('PRIVATE_KEY', PRIVATE_KEY)
app.set('PUBLIC_KEY', PUBLIC_KEY)

// Disable some stuff for security reasons
app.set('trust proxy', ServerConfig.trustProxy)
app.disable('x-powered-by')

// Morgan
morgan.token('ipAddress', (req) => IpHelper.GetClientIp(req))
morgan.token('userId', (req) => req.userId || CookiesHelper.GetUserIdCookie(req) || 'unknown')
morgan.token('status', (req, res) => res.statusCode)

app.use(morgan(':method :url :status :ipAddress :userId :user-agent :response-time', {
  stream                                    : {
    write                                   : async (message) => {
      // Extract status code from the message
      const log                             = message.trim().split(' ')
      const logObject                       = {
        method                              : log[ 0 ],
        url                                 : log[ 1 ],
        status                              : Number(log[ 2 ]),
        ipAddress                           : log[ 3 ],
        userId                              : log[ 4 ],
        userAgent                           : log[ 5 ],
        responseTime                        : log[ 6 ],
      }

      await LogModel.create(logObject)
    },
  },
}))

// Use all the middlewares
app.use(bodyParser.urlencoded())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(useragent.express())
app.use(CorsMiddleware)
app.use(CookieParserMiddleware)
app.use(i18nMiddleware)
app.use(Limiter)
app.use(SecurityMiddlewares())
app.use(SessionMiddleware)
app.use(SlowDownLimiter)

// Routes
import IndexRouter from './routes/index.route.js'

app.use('/api', [ CsrfProtection.csrfSynchronisedProtection ], IndexRouter)

// If the route doesn't exist, return a 404 error
app.use((req, res, next) => res.status(404).send(t('RouteNotFound'), { url: req.url }))

// Use the error handler middleware
app.use(ErrorMiddleware.ErrorHandler)

// Listen to server
app.listen(ServerConfig.port, async () => {
  console.log(`Server running in ${ NODE_ENV } mode on port ${ PORT }`)

  // Connect to MongoDB
  await ConnectToDatabase()
})

export {
  app as default,
}
