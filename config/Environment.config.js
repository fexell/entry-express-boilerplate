import 'dotenv/config'

/**
 * 
 */
const {
  NODE_ENV,
  PORT,
  JWT_SECRET,
  SESSION_SECRET,
  COOKIE_SECRET,
  CSRF_SECRET,
  MONGO_URI,
}                                           = process.env

/**
 * 
 */
const dbString                              = MONGO_URI || 'mongodb://localhost:27017/entry-boilerplate'

export {
  NODE_ENV,
  PORT,
  JWT_SECRET,
  SESSION_SECRET,
  COOKIE_SECRET,
  CSRF_SECRET,
  dbString as MONGO_URI,
}
