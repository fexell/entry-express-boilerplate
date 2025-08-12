import { Router } from 'express'

import UserController from '../../controllers/User.controller.js'

import AuthMiddleware from '../../middlewares/Auth.middleware.js'

/**
 * @type {Router}
 * @description User routes
 * @constant UserRouter
 * 
 * @property {GET} / - Retrieves the user's information.
 * @property {POST} / - The controller function responsible for creating a user, based on the user's input.
 * @property {PUT} / - The controller function responsible for updating a user, based on the user's input.
 * @property {GET} /all - Retrieves all users in the database.
 * @property {GET} /username/:username - Retrieves a user by their username.
 * @property {GET} /email/:email - Retrieves a user by their email.
 * @property {GET} /:userId - Retrieves a user by their ID.
 */
const UserRouter                            = Router()

// /user routes first
UserRouter.get('/', [
  AuthMiddleware.Authenticate,
  AuthMiddleware.RevokedRefreshToken,
  AuthMiddleware.EmailVerified,
  AuthMiddleware.AccountInactive,
], UserController.Get)

UserRouter.post('/', UserController.Create)

UserRouter.put('/', [
  AuthMiddleware.Authenticate,
  AuthMiddleware.RevokedRefreshToken,
  AuthMiddleware.EmailVerified,
  AuthMiddleware.AccountInactive,
], UserController.Update)

// /user/all routes
UserRouter.get('/all', [
  AuthMiddleware.Authenticate,
  AuthMiddleware.RevokedRefreshToken,
  AuthMiddleware.EmailVerified,
  AuthMiddleware.AccountInactive,
  // AuthMiddleware.RoleChecker([ 'moderator', 'admin' ]),
], UserController.GetAll)

// /user/username routes
UserRouter.get('/username/:username', [
  AuthMiddleware.Authenticate,
  AuthMiddleware.RevokedRefreshToken,
  AuthMiddleware.EmailVerified,
  AuthMiddleware.AccountInactive,
], UserController.GetByUsername)

// /user/email routes
UserRouter.get('/email/:email', [
  AuthMiddleware.Authenticate,
  AuthMiddleware.RevokedRefreshToken,
  AuthMiddleware.EmailVerified,
  AuthMiddleware.AccountInactive,
  AuthMiddleware.RoleChecker([ 'moderator', 'admin' ]),
], UserController.GetByEmail)

// /user/:userId routes
UserRouter.get('/:userId', [
  AuthMiddleware.Authenticate,
  AuthMiddleware.RevokedRefreshToken,
  AuthMiddleware.EmailVerified,
  AuthMiddleware.AccountInactive,
  // AuthMiddleware.RoleChecker([ 'moderator', 'admin' ]),
], UserController.GetByUserId)

export {
  UserRouter as default,
}
