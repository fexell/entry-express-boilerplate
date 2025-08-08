import { Router } from 'express'

import UserController from '../../controllers/User.controller.js'

import AuthMiddleware from '../../middlewares/Auth.middleware.js'

const UserRouter                            = Router()

UserRouter.get('/', [
  AuthMiddleware.RevokedRefreshToken,
  AuthMiddleware.Authenticate,
], UserController.Get)

UserRouter.get('/all', [
  AuthMiddleware.RevokedRefreshToken,
  AuthMiddleware.Authenticate,
], UserController.GetAll)

UserRouter.post('/', UserController.Create)

export {
  UserRouter as default,
}
