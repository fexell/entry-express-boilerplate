import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

import AuthController from '../controllers/Auth.controller.js'

import RefreshTokenModel from '../models/RefreshToken.model.js'
import UserModel from '../models/User.model.js'

import CookiesHelper from '../helpers/Cookies.helper.js'
import ErrorHelper from '../helpers/Error.helper.js'
import IpHelper from '../helpers/Ip.helper.js'
import JwtHelper from '../helpers/Jwt.helper.js'

/**
 * Middleware for handling authentication and authorization.
 * It checks if the user is logged in, verifies email, and checks account status.
 * 
 * @typedef {Object} AuthMiddleware
 * @property {Function} AlreadyLoggedIn - Checks if the user is already logged in.
 * @property {Function} AlreadyLoggedOut - Checks if the user is already logged out.
 * @property {Function} EmailVerified - Checks if the user's email is verified.
 * @property {Function} AccountInactive - Checks if the user's account is inactive.
 * @property {Function} RevokedRefreshToken - Checks if the refresh token has been revoked.
 * @property {Function} RoleChecker - Checks if the user has the required role to access the route.
 * @property {Function} EditPermissionsChecker - Checks whether the user has rights to edit.
 * @property {Function} Authenticate - Authenticates the user based on access or refresh tokens.
 * 
 * *****************************************************************************
 * The middlewares should be run in the following order:
 * - Authenticate - Authenticate the user first
 * - RevokedRefreshToken - After authenticate, check if the refresh token has been revoked
 * - EmailVerified - After, check if the email is verified
 * - AccountInactive - After, check if the account is inactive
 * - RoleChecker - After, check if the user has the required role to access the route
 * - EditPermissionsChecker [situational] - After, check if the user has rights to edit
 * *****************************************************************************
 */
const AuthMiddleware                        = {}

// Checks if the user is already logged in
AuthMiddleware.AlreadyLoggedIn              = async (req, res, next) => {
  try {

    // Get the cookies and their value
    const userId                            = req.userId || CookiesHelper.GetUserIdCookie(req)
    const refreshTokenId                    = req.refreshTokenId || CookiesHelper.GetRefreshTokenIdCookie(req)

    // Retrieve the refresh token record
    const refreshTokenRecord                = await RefreshTokenModel.findOne({
      _id                                   : refreshTokenId,
      userId                                : userId,
      isRevoked                             : false,
    })

    // Check if there's an active refresh token
    if(refreshTokenRecord)
      throw ErrorHelper.UserAlreadyLoggedIn()

    // Continue to the next middleware, or route
    return next()

  } catch(error) {
    return next(error)
  }
}

// Checks if the user is already logged out
AuthMiddleware.AlreadyLoggedOut             = async (req, res, next) => {
  try {

    // Get the cookies and their values
    const userId                            = req.userId || CookiesHelper.GetUserIdCookie(req)
    const refreshTokenId                    = req.refreshTokenId || CookiesHelper.GetRefreshTokenIdCookie(req)

    // Retrieve a refresh token record
    const refreshTokenRecord                = await RefreshTokenModel.findOne({
      _id                                   : refreshTokenId,
      userId                                : userId,
      isRevoked                             : false,
    })

    // Check if there's NO active refresh token
    if(!refreshTokenRecord)
      throw ErrorHelper.UserAlreadyLoggedOut()

    // Continue to the next middleware, or route
    return next()

  } catch(error) {
    return next(error)
  }
}

// Checks if the user's email is verified
AuthMiddleware.EmailVerified                = async (req, res, next) => {
  try {

    // Get the user id from the cookie
    const userId                            = req.userId || CookiesHelper.GetUserIdCookie(req)

    // Get the user based on either user id (if the user is logged in),
    // or by email (if the user is trying to log in)
    const user                              = await UserModel.findOne({
      $or: [{ _id: userId }, { ...(req.body?.email && { email: req.body?.email }) }]
    })

    // In case the user could not be found
    if(!user)
      throw ErrorHelper.UserNotFound()

    // If the url path has the word "verify" in it, AND if the email is already verified
    if(req.path.includes('verify') && user.isEmailVerified)
      throw ErrorHelper.EmailAlreadyVerified()

    // If the email is NOT verified
    if(!user.isEmailVerified)
      throw ErrorHelper.EmailNotVerified()

    // Continue to the next middleware, or route
    return next()

  } catch(error) {
    return next(error)
  }
}

// Checks if the user's account is inactive
AuthMiddleware.AccountInactive              = async (req, res, next) => {
  try {

    // Get user id from the cookie
    const userId                            = req.userId || CookiesHelper.GetUserIdCookie(req)

    // Retrieve the user's record either by user id (logged in user),
    // or by email (if the user is trying to log in)
    // AND where isActive is set to false
    const user                              = await UserModel.findOne({
      $and: [
        { $or: [{ _id: userId }, { ...(req.body?.email && { email: req.body?.email }) }] },
        { isActive: false },
      ]
    })

    // If a record was found, with isActive set to false
    if(user)
      throw ErrorHelper.AccountInactive()

    // Continue to the next middleware, or route
    return next()

  } catch(error) {
    return next(error)
  }
}

// Checks if the refresh token has been revoked
// This middleware is used to ensure that the refresh token is still valid and has not been revoked
AuthMiddleware.RevokedRefreshToken          = async (req, res, next) => {
  try {

    // Get the refresh token's id from the cookie
    const refreshTokenId                    = req.refreshTokenId || CookiesHelper.GetRefreshTokenIdCookie(req)

    // Attempt to find a refresh token based on the refresh token's id, AND where isRevoked is set to true
    const refreshTokenRecord                = await RefreshTokenModel.findOne({
      _id                                   : refreshTokenId,
      isRevoked                             : true,
    })

    // If a refresh token record was found
    if(refreshTokenRecord)
      throw ErrorHelper.RefreshTokenRevoked()

    // Continue to the next middleware, or route
    return next()

  } catch(error) {
    return next(error)
  }
}

// Checks if the user has the required role to access the route
AuthMiddleware.RoleChecker                  = (roles = [] || '') => async (req, res, next) => {
  try {

    // Get the user id from the cookie
    const userId                            = req.userId || CookiesHelper.GetUserIdCookie(req)

    // Retrieve the user's record
    const user                              = await UserModel.findById(userId)

    // If the user doesn't exist
    if(!user)
      throw ErrorHelper.UserNotFound()

    // If role is a string and the user doesn't have the required role
    if(typeof roles === 'string' && roles !== user.role)
      throw ErrorHelper.Unauthorized()

    // If the user doesn't have the required role
    else if(Array.isArray(roles) && !roles.includes(user.role))
      throw ErrorHelper.Unauthorized()

    // Continue to the next middleware, or route
    return next()

  } catch(error) {
    return next(error)
  }
}

// Checks if the user has the required role to edit their own permissions
AuthMiddleware.EditPermissionsChecker       = async (req, res, next) => {
  try {

    // Get the user id from the cookie
    const userId                            = req.userId || CookiesHelper.GetUserIdCookie(req)

    // Retrieve the user's record
    const user                              = await UserModel.findById(userId)

    // If the user doesn't exist
    if(!user)
      throw ErrorHelper.UserNotFound()

    // Get the target user id
    const targetUserId                      = req.params.userId || req.params.id || req.body?.userId || req.body?.id

    // If the target user id is invalid
    if(!targetUserId)
      throw ErrorHelper.UserIdNotFound()

    else if(!mongoose.Types.ObjectId.isValid(targetUserId))
      throw ErrorHelper.UserIdInvalid()

    // Is the user trying to update their own data?
    const isSelf                            = user._id.toString() === targetUserId

    if(!isSelf && ![ 'moderator', 'admin' ].includes(user.role))
      throw ErrorHelper.Unauthorized()

    // Continue to the next middleware, or route
    return next()

  } catch(error) {
    return next(error)
  }
}

// Authenticates the user based on access or refresh tokens
AuthMiddleware.Authenticate                 = async (req, res, next) => {
  try {

    // Get the user id and access token from their cookies
    const userId                            = CookiesHelper.GetUserIdCookie(req)
    const accessToken                       = CookiesHelper.GetAccessTokenCookie(req)

    // If BOTH user id and access token couldn't be found
    if(!userId && !accessToken)
      throw ErrorHelper.RouteProtected()

    // If access token is present
    if(accessToken) {

      // Decode the access token and "decode" it
      const decodedAccessToken              = JwtHelper.VerifyAccessToken(accessToken)

      // If the access token couldn't be decoded, forcefully log out the user
      if(!decodedAccessToken)
        return AuthController.Logout(req, res, next, true)

      // If the user id cookie isn't present, issue a new user id cookie,
      // from the decoded access token
      if(!userId)
        CookiesHelper.SetUserIdCookie(res, decodedAccessToken.userId)

      // Check to see if the decoded user id and the user id (from cookie) are valid
      else if(decodedAccessToken.userId !== userId ||
        !mongoose.isValidObjectId(decodedAccessToken.userId) ||
        !mongoose.isValidObjectId(userId)
      )
        return AuthController.Logout(req, res, next, true)

      // Make the access token available straight away
      req.accessToken                       = accessToken
      req.refreshTokenId                    = CookiesHelper.GetRefreshTokenIdCookie(req)

      // Continue to the next middleware or route
      return next()

    } else {

      // Get the refresh token id from req or its cookie
      const refreshTokenId                  = req.refreshTokenId || CookiesHelper.GetRefreshTokenIdCookie(req)

      // If the refresh token could not be found
      if(!refreshTokenId)
        throw ErrorHelper.RouteProtected()

      // Find the (current) refresh token record
      const refreshTokenRecord              = await RefreshTokenModel.findOne({
        _id                                 : refreshTokenId,
        userId                              : userId,
        isRevoked                           : false,
      }).select('+token')

      // If the refresh token record could not be found, or the refresh token is invalid, forcefully log out the user
      if(!refreshTokenRecord || !JwtHelper.VerifyRefreshToken(refreshTokenRecord.token))
        return AuthController.Logout(req, res, next, true)

      // Set the old refresh token to be revoked
      refreshTokenRecord.isRevoked          = true

      // Save the old refresh token record changes
      await refreshTokenRecord.save()

      // Generate a new jwt id
      const jwtId                           = uuidv4()

      // Set the jwt id in session
      req.session.jwtId                     = jwtId

      const newAccessToken                  = JwtHelper.SignAccessToken(userId, jwtId)
      const newRefreshToken                 = JwtHelper.SignRefreshToken(userId)

      // Make a new refresh token record (for rotating the refresh token)
      const newRefreshTokenRecord           = RefreshTokenModel({
        userId                              : userId,
        token                               : newRefreshToken,
        ipAddress                           : IpHelper.GetClientIp(req),
        userAgent                           : req.headers[ 'user-agent' ],
      })

      // Save the new refresh token record
      await newRefreshTokenRecord.save()

      // Set the necessary cookies
      // CookiesHelper.SetUserIdCookie(res, userId)
      CookiesHelper.SetAccessTokenCookie(res, newAccessToken)
      CookiesHelper.SetRefreshTokenIdCookie(res, newRefreshTokenRecord._id)

      // Make these available straight away
      req.userId                            = userId
      req.accessToken                       = newAccessToken
      req.refreshTokenId                    = newRefreshTokenRecord._id

      // Continue to the next middleware, or route
      return next()
    }
  } catch(error) {
    return next(error)
  }
}

export {
  AuthMiddleware as default,
}
