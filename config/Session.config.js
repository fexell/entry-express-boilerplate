import session from 'express-session'
import MongoStore from 'connect-mongo'

import { NODE_ENV, MONGO_URI, SESSION_SECRET } from './Environment.config.js'

/**
 * Session middleware
 */
const SessionMiddleware                     = session({
  secret                                    : SESSION_SECRET || 'default_session_secret',
  resave                                    : true,
  saveUninitialized                         : true,
  store                                     : MongoStore.create({ mongoUrl: MONGO_URI }),
  cookie                                    : {
    secure                                  : NODE_ENV === 'production', // Set to true if using HTTPS
    httpOnly                                : true,
    maxAge                                  : 1000 * 60 * 60 * 24, // 1 day
  },
})

export {
  SessionMiddleware as default,
}
