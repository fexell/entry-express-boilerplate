import bodyParser from 'body-parser'
import express from 'express'
import fs from 'fs'
import { t } from 'i18next'
import useragent from 'express-useragent'

import CorsMiddleware from './config/Cors.config.js'
import ConnectToDatabase from './config/Mongoose.config.js'
import {
  NODE_ENV,
  PORT,
} from './config/Environment.config.js'
import SecurityMiddlewares, {
  CookieParserMiddleware,
  CsrfProtection,
  Limiter,
  SlowDownLimiter,
} from './config/Security.config.js'
import i18nMiddleware from './config/i18n.config.js'
import MorganMiddleware from './config/Morgan.config.js'
import SessionMiddleware from './config/Session.config.js'
import ServerConfig from './config/Server.config.js'

import ErrorMiddleware from './middlewares/Error.middleware.js'

// The express instance
const app                                   = express()

// Private and public key for jwt
const PRIVATE_KEY                           = fs.readFileSync('jwt.key', 'utf8')
const PUBLIC_KEY                            = fs.readFileSync('jwt.key.pub', 'utf8')

// Set global variables
app.set('PRIVATE_KEY', PRIVATE_KEY)
app.set('PUBLIC_KEY', PUBLIC_KEY)

// Disable some stuff for security reasons
app.set('trust proxy', ServerConfig.trustProxy)
app.disable('x-powered-by')

// Use all the middlewares
app.use(MorganMiddleware)
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
