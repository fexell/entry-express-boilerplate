import { t } from 'i18next'
import sanitize from 'mongo-sanitize'
import { v4 as uuidv4 } from 'uuid'

import RefreshTokenModel from '../models/RefreshToken.model.js'
import UserModel from '../models/User.model.js'

import CookiesHelper, { CookieNames } from '../helpers/Cookies.helper.js'
import ErrorHelper from '../helpers/Error.helper.js'
import IpHelper from '../helpers/Ip.helper.js'
import JwtHelper from '../helpers/Jwt.helper.js'
import PasswordHelper from '../helpers/Password.helper.js'
import SuccessHelper from '../helpers/Success.helper.js'
import UserHelper from '../helpers/User.helper.js'

/**
 * @typedef {Object} AuthController
 * @property {Function} Login - Login the user
 * @property {Function} Logout - Logs the user out
 * @property {Function} VerifyEmail - Verifies the user's email
 * @property {Function} Units - Returns the units that the user is logged in on
 * @property {Function} ChangePassword - Changes the user's password
 * @property {Function} RevokeRefreshToken - Revokes a refresh token
 */
const AuthController                        = {}

// Login the user
AuthController.Login                        = async (req, res, next) => {
  try {

    // Get the email and password from the form body
    const { email, password }               = req.body

    // If an email could NOT be found
    if(!email)
      throw ErrorHelper.EmailRequired()

    // Else if a password could NOT be found
    else if(!password)
      throw ErrorHelper.PasswordRequired()

    // Attempt to find a user by provided email
    const user                              = await UserModel.findOne({ email: email.toLowerCase() }).select('+password').lean()

    // If a user could not be found
    if(!user)
      throw ErrorHelper.UserNotFound()

    // Attempt to verify the password
    const isPasswordValid                   = await PasswordHelper.Verify(password, user.password)

    // If the password given is wrong
    if(!isPasswordValid)
      throw ErrorHelper.PasswordWrong()

    // Set the necessary variables and their value for the creation of the refresh token record
    const clientIp                          = IpHelper.GetClientIp(req)
    const jwtId                             = uuidv4()
    const accessToken                       = JwtHelper.SignAccessToken(user._id, jwtId)
    const refreshToken                      = JwtHelper.SignRefreshToken(user._id)

    // Initiate the new refresh token record
    const newRefreshTokenRecord             = new RefreshTokenModel({
      userId                                : user._id,
      token                                 : refreshToken,
      ipAddress                             : clientIp,
      userAgent                             : req.headers[ 'user-agent' ],
    })

    // Attempt to save the new refresh token record
    await newRefreshTokenRecord.save()

    // If the refresh token record was successfully saved, then set the relevant cookies
    CookiesHelper.SetUserIdCookie(res, user._id)
    CookiesHelper.SetAccessTokenCookie(res, accessToken)
    CookiesHelper.SetRefreshTokenIdCookie(res, newRefreshTokenRecord._id)
      
    // Respond with a success status
    return SuccessHelper.UserLoggedIn(res, user)

  } catch(error) {
    return next(error)
  }
}

// Logs the user out
AuthController.Logout                       = async (req, res, next, forced = false) => {
  try {

    // Get the necessary cookies and their values
    const userId                            = UserHelper.GetUserId(req)
    const refreshTokenId                    = UserHelper.GetUserRefreshTokenId(req)

    // If both user id and refresh token id are not set
    if(!userId || !refreshTokenId)
      throw ErrorHelper.UserAlreadyLoggedOut()

    // Try to find the current refresh token record for the user
    const refreshTokenRecord                = await RefreshTokenModel.findOne({
      _id                                   : refreshTokenId,
      userId                                : userId,
      isRevoked                             : false,
    })

    // If the refresh token record was found
    if(refreshTokenRecord) {

      // Revoke the current refresh token
      refreshTokenRecord.isRevoked          = true

      // Attempt to save the refresh token record
      await refreshTokenRecord.save()
    }

    // Clear all the cookies
    CookiesHelper.ClearCookie(res, CookieNames.UserId)
    CookiesHelper.ClearCookie(res, CookieNames.AccessToken, true)
    CookiesHelper.ClearCookie(res, CookieNames.RefreshTokenId, true)

    // Return a success based on if the user was logged out forcefully, or not
    return forced
      ? SuccessHelper.UserLoggedOutForcefully(res)
      : SuccessHelper.UserLoggedOut(res)

  } catch(error) {
    return next(error)
  }
}

// Verifies the user's email
AuthController.VerifyEmail                  = async (req, res, next) => {
  try {

    // Get the email from the query (example: ?email=abc@def.com)
    const { email }                         = req.query

    // Get the token from the parameter (example: /abcdefg123456)
    const { token }                         = sanitize(req.params)

    // If the email query could not be found
    if(!email)
      throw ErrorHelper.EmailQueryNotFound()

    // Else if the email parameter could not be found
    else if(!token)
      throw ErrorHelper.TokenParamNotFound()

    // Find a user based on the email, and also by the email verification token, and where isEmailVerified is set to false
    const user                              = await UserModel.findOne({
      email: email,
      emailVerificationToken: token,
      isEmailVerified: false,
    })

    // If a user could not be found
    if(!user)
      throw ErrorHelper.UserNotFound()

    // If a user could be found, then update and set that the user's email is verified
    user.isEmailVerified                    = true
    user.emailVerificationToken             = null

    // Attempt to save the user
    await user.save()

    // Return with a success
    return SuccessHelper.EmailVerified(res)

  } catch(error) {
    return next(error)
  }
}

// Returns the units that the user is logged in on
AuthController.Units                        = async (req, res, next) => {
  try {

    // Get the order
    const sort                              = req.query.sort

    // Get the user's id
    const userId                            = UserHelper.GetUserId(req)

    // Find refresh token records that belongs to the user; by user id and where isRevoked is set to false
    const units                             = !sort
    ? await RefreshTokenModel.find({
      userId                                : userId,
      isRevoked                             : false,
    }).lean()
    : await RefreshTokenModel.find({
      userId                                : userId,
      isRevoked                             : false,
    }).sort(sort).lean()

    // If no logged in units were found
    if(!units.length)
      throw ErrorHelper.UnitsNotFound()

    // If successful, respond with the units that the user is logged in on
    return res.status(200).json({
      units                                 : units.map(unit => RefreshTokenModel.SerializeRefreshToken(unit)),
    })

  } catch(error) {
    return next(error)
  }
}

// Change the user's password
AuthController.ChangePassword               = async (req, res, next) => {
  try {

    const user                              = await UserHelper.GetUserById(req, true)

    // Get the password, new password, and confirm new password
    const {
      password,
      newPassword,
      confirmNewPassword,
    }                                       = req.body

    // If password field is missing/not filled in
    if(!password)
      throw ErrorHelper.PasswordRequired()

    // Else if the new password field is missing/not filled in
    else if(!newPassword)
      throw ErrorHelper.PasswordNewRequired()

    // Else if the confirm new password field is missing/not filled in
    else if(!confirmNewPassword)
      throw ErrorHelper.PasswordNewConfirmRequired()

    // Else if the new password and confirm new password do not match
    if(newPassword !== confirmNewPassword)
      throw ErrorHelper.PasswordMismatch()

    // Else if the new password is the same as the current password
    else if(password === newPassword)
      throw ErrorHelper.PasswordEqualsNewPassword()

    // If the password is incorrect
    if(!await PasswordHelper.Verify(password, user.password))
      throw ErrorHelper.PasswordWrong()

    // Set the new password
    user.password                           = newPassword

    // Attempt to save the user
    await user.save()

    // Return with a success
    return res.status(200).json({
      message                               : t('PasswordChanged'),
    })

  } catch(error) {
    return next(error)
  }
}

// Revokes a refresh token
AuthController.RevokeRefreshToken           = async (req, res, next) => {
  try {
    
    // Get the refresh token id
    const targetRefreshTokenId              = req.params.refreshTokenId
    const currentRefreshTokenId             = UserHelper.GetUserRefreshTokenId(req)

    // If the refresh token id parameter is missing
    if(!targetRefreshTokenId)
      throw ErrorHelper.RefreshTokenIdRequired()

    // Else if the current refresh token id is missing
    else if(!currentRefreshTokenId)
      throw ErrorHelper.RefreshTokenRecordNotFound()

    // Else if the refresh token id is the same as the current refresh token id
    if(targetRefreshTokenId === currentRefreshTokenId)
      throw ErrorHelper.RefreshTokenCurrentRevoke()

    // Find the refresh token record
    const refreshTokenRecord                = await RefreshTokenModel.findOne({
      _id                                   : targetRefreshTokenId,
      isRevoked                             : false,
    })

    // If the refresh token record could not be found
    if(!refreshTokenRecord)
      throw ErrorHelper.RefreshTokenRecordNotFound()

    // Revoke the refresh token
    refreshTokenRecord.isRevoked            = true

    // Attempt to save the refresh token
    await refreshTokenRecord.save()

    // Return with a success
    return res.status(200).json({
      message                               : t('RefreshTokenRevoked'),
    })

  } catch(error) {
    return next(error)
  }
}

export {
  AuthController as default,
}
