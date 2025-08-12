import { Router } from 'express'

import AuthController from '../../controllers/Auth.controller.js'

import AuthMiddleware from '../../middlewares/Auth.middleware.js'

/**
 * @type {Router}
 * @description Auth routes
 * @constant AuthRouter
 * 
 * 
 */
const AuthRouter                            = Router()

// Retrieves the units that the user is logged in on
AuthRouter.get('/units', [
  AuthMiddleware.Authenticate,
  AuthMiddleware.RevokedRefreshToken,
  AuthMiddleware.EmailVerified,
  AuthMiddleware.AccountInactive,
], AuthController.Units)

// Logs the user in
AuthRouter.post('/login', [
  AuthMiddleware.AlreadyLoggedIn,
  AuthMiddleware.EmailVerified,
  AuthMiddleware.AccountInactive,
], AuthController.Login)

// Logs the user out
AuthRouter.post('/logout', [
  AuthMiddleware.AlreadyLoggedOut,
], AuthController.Logout)

// Verifies the user's email
AuthRouter.put('/email/verify/:token', [
  AuthMiddleware.EmailVerified,
], AuthController.VerifyEmail)

// Changes the user's password
AuthRouter.put('/password/change', [
  AuthMiddleware.Authenticate,
  AuthMiddleware.RevokedRefreshToken,
  AuthMiddleware.EmailVerified,
  AuthMiddleware.AccountInactive,
], AuthController.ChangePassword)

export {
  AuthRouter as default,
}
