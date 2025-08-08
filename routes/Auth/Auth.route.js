import { Router } from 'express'

import AuthController from '../../controllers/Auth.controller.js'

import AuthMiddleware from '../../middlewares/Auth.middleware.js'

const AuthRouter                            = Router()

AuthRouter.get('/units', [
  AuthMiddleware.AccountInactive,
  AuthMiddleware.EmailVerified,
  AuthMiddleware.Authenticate,
], AuthController.Units)

AuthRouter.post('/login', [
  AuthMiddleware.AlreadyLoggedIn,
  AuthMiddleware.AccountInactive,
  AuthMiddleware.EmailVerified,
], AuthController.Login)

AuthRouter.post('/logout', [
  AuthMiddleware.AlreadyLoggedOut,
], AuthController.Logout)

AuthRouter.put('/email/verify/:token', [
  AuthMiddleware.EmailVerified,
], AuthController.VerifyEmail)

export {
  AuthRouter as default,
}
