import { Router } from 'express'

import UserController from '../../controllers/User.controller.js'

import AuthMiddleware from '../../middlewares/Auth.middleware.js'

const UserRouter                            = Router()

UserRouter.get('/', [
  AuthMiddleware.Authenticate,
  AuthMiddleware.RevokedRefreshToken,
  AuthMiddleware.AccountInactive,
  AuthMiddleware.EmailVerified,
], UserController.Get)

UserRouter.get('/all', [
  AuthMiddleware.Authenticate,
  AuthMiddleware.RevokedRefreshToken,
  AuthMiddleware.AccountInactive,
  AuthMiddleware.EmailVerified,
  AuthMiddleware.RoleChecker([ 'user', 'admin' ]),
], UserController.GetAll)

UserRouter.post('/', UserController.Create)

export {
  UserRouter as default,
}
