import cookieParser from 'cookie-parser'
import { rateLimit } from 'express-rate-limit'
import { slowDown } from 'express-slow-down'
import { xss } from 'express-xss-sanitizer'
import helmet from 'helmet'
import hpp from 'hpp'
import { csrfSync } from 'csrf-sync'

import { NODE_ENV, COOKIE_SECRET } from './Environment.config.js'

const CookieParserMiddleware                = cookieParser(COOKIE_SECRET, {
  secure                                    : NODE_ENV !== 'development',
})

const SecurityMiddlewares                   = () => [
  helmet(),
  hpp(),
  xss(),
]

const CsrfProtection                        = csrfSync()

const Limiter                               = rateLimit({
  windowMs                                  : 15 * 60 * 1000, // 15 minutes
  max                                       : 100, // Limit each IP to 100 requests per windowMs
  standardHeaders                           : 'draft-8', // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders                             : false, // Disable the `X-RateLimit-*` headers
})

const SlowDownLimiter                       = slowDown({
  windowMs                                  : 15 * 60 * 1000, // 15 minutes
  delayAfter                                : 100, // Allow 100 requests per windowMs before slowing down
  delayMs                                   : (hits) => hits * 500, // Slow down subsequent requests by 500ms
})

export {
  CookieParserMiddleware,
  CsrfProtection,
  Limiter,
  SecurityMiddlewares as default,
  SlowDownLimiter,
}
