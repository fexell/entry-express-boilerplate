import { Router } from 'express'
import multer from 'multer'

import CsrfRouter from './Csrf/Csrf.route.js'
import UserRouter from './User/User.route.js'
import AuthRouter from './Auth/Auth.route.js'

const IndexRouter                           = Router()

IndexRouter.use('/csrf', CsrfRouter)
IndexRouter.use('/user', multer().array(), UserRouter)
IndexRouter.use('/auth', multer().array(), AuthRouter)

export {
  IndexRouter as default,
}
