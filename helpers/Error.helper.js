import { t } from 'i18next'

/**
 * @typedef {Object} ErrorHelper
 * 
 */
const ErrorHelper                           = {}

/**
 * Custom error class (extending the native error class), so status code is included
 */
class CustomError extends Error {
  constructor(message, statusCode) {
    super(message)

    this.statusCode = statusCode
  }
}

// Authentication/Authorization Errors
ErrorHelper.Unauthorized                    = () => new CustomError(t('Unauthorized'), 401)

// Account Errors
ErrorHelper.AccountInactive                 = () => new CustomError(t('AccountInactive'), 403)

// User Errors
ErrorHelper.UserNotFound                    = () => new CustomError(t('UserNotFound'), 404)
ErrorHelper.UserAlreadyLoggedIn             = () => new CustomError(t('UserAlreadyLoggedIn'), 400)
ErrorHelper.UserAlreadyLoggedOut            = () => new CustomError(t('UserAlreadyLoggedOut'), 400)
ErrorHelper.UserIdInvalid                   = () => new CustomError(t('UserIdInvalid'), 400)
ErrorHelper.UserIdNotFound                  = () => new CustomError(t('UserIdNotFound'), 404)
ErrorHelper.UserLoggedOutForcefully         = () => new CustomError(t('UserLoggedOutForcefully'), 400)

// Target ID Errors
ErrorHelper.TargetIdNotFound                = () => new CustomError(t('TargetIdNotFound'), 404)
ErrorHelper.TargetIdInvalid                 = () => new CustomError(t('TargetIdInvalid'), 400)

// Unit Errors
ErrorHelper.UnitsNotFound                   = () => new CustomError(t('UnitsNotFound'), 404)

// Email Errors
ErrorHelper.EmailRequired                   = () => new CustomError(t('EmailRequired'), 400)
ErrorHelper.EmailInvalid                    = () => new CustomError(t('EmailInvalid'), 400)
ErrorHelper.EmailEnterValid                 = () => new CustomError(t('EmailEnterValid'), 400)
ErrorHelper.EmailQueryNotFound              = () => new CustomError(t('EmailQueryNotFound'), 404)
ErrorHelper.EmailAlreadyVerified            = () => new CustomError(t('EmailAlreadyVerified'), 400)
ErrorHelper.EmailNotVerified                = () => new CustomError(t('EmailNotVerified'), 401)

// Username Errors
ErrorHelper.UsernameRequired                = () => new CustomError(t('UsernameRequired'), 400)
ErrorHelper.UsernameInvalid                 = () => new CustomError(t('UsernameInvalid'), 400)
ErrorHelper.UsernameMinLength               = () => new CustomError(t('UsernameMinLength'), 400)
ErrorHelper.UsernameMaxLength               = () => new CustomError(t('UsernameMaxLength'), 400)
ErrorHelper.UsernameTaken                   = () => new CustomError(t('UsernameTaken'), 400)

// Forename (first name) Errors
ErrorHelper.ForenameRequired                = () => new CustomError(t('ForenameRequired'), 400)
ErrorHelper.ForenameInvalid                 = () => new CustomError(t('ForenameInvalid'), 400)
ErrorHelper.ForenameMinLength               = () => new CustomError(t('ForenameMinLength'), 400)
ErrorHelper.ForenameMaxLength               = () => new CustomError(t('ForenameMaxLength'), 400)

// Surname Errors
ErrorHelper.SurnameRequired                 = () => new CustomError(t('SurnameRequired'), 400)
ErrorHelper.SurnameInvalid                  = () => new CustomError(t('SurnameInvalid'), 400)
ErrorHelper.SurnameMinLength                = () => new CustomError(t('SurnameMinLength'), 400)
ErrorHelper.SurnameMaxLength                = () => new CustomError(t('SurnameMaxLength'), 400)

// Password Errors
ErrorHelper.PasswordRequired                = () => new CustomError(t('PasswordRequired'), 400)
ErrorHelper.PasswordInvalid                 = () => new CustomError(t('PasswordInvalid'), 400)
ErrorHelper.PasswordMinLength               = () => new CustomError(t('PasswordMinLength'), 400)
ErrorHelper.PasswordMaxLength               = () => new CustomError(t('PasswordMaxLength'), 400)
ErrorHelper.PasswordHashError               = () => new CustomError(t('PasswordHashError'), 500)
ErrorHelper.PasswordVerificationFailed      = () => new CustomError(t('PasswordVerificationFailed'), 401)
ErrorHelper.PasswordMismatch                = () => new CustomError(t('PasswordMismatch'), 400)
ErrorHelper.PasswordWrong                   = () => new CustomError(t('PasswordWrong'), 401)

// Route Errors
ErrorHelper.RouteProtected                  = () => new CustomError(t('RouteProtected'), 401)

// Token Errors
ErrorHelper.TokenParamNotFound              = () => new CustomError(t('TokenParamNotFound'), 404)

// Refresh Token Errors
ErrorHelper.RefreshTokenIdInvalid           = () => new CustomError(t('RefreshTokenIdInvalid'), 400)
ErrorHelper.RefreshTokenRevoked             = () => new CustomError(t('RefreshTokenRevoked'), 400)

// Client Errors
ErrorHelper.ClientIpNotFound                = () => new CustomError(t('ClientIpNotFound'), 400)

export {
  CustomError,
  ErrorHelper as default,
}