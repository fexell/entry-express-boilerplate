import { Router } from 'express'
import multer from 'multer'

import CsrfRouter from './Csrf/Csrf.route.js'
import UserRouter from './User/User.route.js'
import AuthRouter from './Auth/Auth.route.js'

/**
 * @type {Router}
 * @description Index routes
 * @constant IndexRouter
 */
const IndexRouter                           = Router()

// CSRF routes
IndexRouter.use('/csrf', CsrfRouter)

// User routes
IndexRouter.use('/user', multer().none(), UserRouter)

// Auth routes
IndexRouter.use('/auth', multer().array(), AuthRouter)

export {
  IndexRouter as default,
}
