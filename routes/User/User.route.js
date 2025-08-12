import { Router } from 'express'

import UserController from '../../controllers/User.controller.js'

import AuthMiddleware from '../../middlewares/Auth.middleware.js'

/**
 * @type {Router}
 * @description User routes
 * @constant UserRouter
 * 
 * 
 */
const UserRouter                            = Router()

UserRouter.get('/', [
  AuthMiddleware.Authenticate,
  AuthMiddleware.RevokedRefreshToken,
  AuthMiddleware.EmailVerified,
  AuthMiddleware.AccountInactive,
], UserController.Get)

UserRouter.put('/', [
  AuthMiddleware.Authenticate,
  AuthMiddleware.RevokedRefreshToken,
  AuthMiddleware.EmailVerified,
  AuthMiddleware.AccountInactive,
], UserController.Update)

UserRouter.get('/all', [
  AuthMiddleware.Authenticate,
  AuthMiddleware.RevokedRefreshToken,
  AuthMiddleware.EmailVerified,
  AuthMiddleware.AccountInactive,
  // AuthMiddleware.RoleChecker([ 'moderator', 'admin' ]),
], UserController.GetAll)

UserRouter.get('/:username', [
  AuthMiddleware.Authenticate,
  AuthMiddleware.RevokedRefreshToken,
  AuthMiddleware.EmailVerified,
  AuthMiddleware.AccountInactive,
], UserController.GetByUsername)

UserRouter.get('/:userId', [
  AuthMiddleware.Authenticate,
  AuthMiddleware.RevokedRefreshToken,
  AuthMiddleware.EmailVerified,
  AuthMiddleware.AccountInactive,
  // AuthMiddleware.RoleChecker([ 'moderator', 'admin' ]),
], UserController.GetByUserId)

UserRouter.post('/', UserController.Create)

export {
  UserRouter as default,
}
