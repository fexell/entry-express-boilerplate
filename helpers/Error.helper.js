import { t } from 'i18next'

/**
 * @typedef {Object} ErrorHelper
 * @property {Function} Unauthorized - Throws an error for unauthorized access
 * 
 * *****************************************************************************
 * Account Errors
 * @property {Function} AccountInactive - Throws an error for inactive account
 * 
 * *****************************************************************************
 * User Errors
 * @property {Function} UserNotFound - Throws an error for user not found
 * @property {Function} UserAlreadyLoggedIn - Throws an error for user already logged in
 * @property {Function} UserAlreadyLoggedOut - Throws an error for user already logged out
 * @property {Function} UserIdInvalid - Throws an error for invalid user id
 * @property {Function} UserIdNotFound - Throws an error for user id not found
 * @property {Function} UserLoggedOutForcefully - Throws an error for user logged out forcefully
 * @property {Function} UserNothingToUpdate - Throws an error for user nothing to update
 * 
 * *****************************************************************************
 * Target ID Errors
 * @property {Function} TargetIdNotFound - Throws an error for target id not found
 * @property {Function} TargetIdInvalid - Throws an error for invalid target id
 * 
 * *****************************************************************************
 * Units Errors
 * @property {Function} UnitsNotFound - Throws an error for units not found
 * 
 * *****************************************************************************
 * Email Errors
 * @property {Function} EmailRequired - Throws an error for email required
 * @property {Function} EmailInvalid - Throws an error for invalid email
 * @property {Function} EmailEnterValid - Throws an error for email enter valid
 * @property {Function} EmailQueryNotFound - Throws an error for email query not found
 * @property {Function} EmailAlreadyVerified - Throws an error for email already verified
 * @property {Function} EmailNotVerified - Throws an error for email not verified
 * @property {Function} EmailParamNotFound - Throws an error for email param not found
 * 
 * *****************************************************************************
 * Username Errors
 * @property {Function} UsernameRequired - Throws an error for username required
 * @property {Function} UsernameInvalid - Throws an error for invalid username
 * @property {Function} UsernameMinLength - Throws an error for username min length
 * @property {Function} UsernameMaxLength - Throws an error for username max length
 * @property {Function} UsernameTaken - Throws an error for username taken
 * @property {Function} UsernameParamNotFound - Throws an error for username param not found
 * 
 * *****************************************************************************
 * Forename Errors
 * @property {Function} ForenameRequired - Throws an error for forename required
 * @property {Function} ForenameInvalid - Throws an error for invalid forename
 * @property {Function} ForenameMinLength - Throws an error for forename min length
 * @property {Function} ForenameMaxLength - Throws an error for forename max length
 * 
 * *****************************************************************************
 * Surname Errors
 * @property {Function} SurnameRequired - Throws an error for surname required
 * @property {Function} SurnameInvalid - Throws an error for invalid surname
 * @property {Function} SurnameMinLength - Throws an error for surname min length
 * @property {Function} SurnameMaxLength - Throws an error for surname max length
 * 
 * *****************************************************************************
 * Password Errors
 * @property {Function} PasswordRequired - Throws an error for password required
 * @property {Function} PasswordNewRequired - Throws an error for new password required
 * @property {Function} PasswordNewConfirmRequired - Throws an error for new password confirmation required
 * @property {Function} PasswordInvalid - Throws an error for invalid password
 * @property {Function} PasswordMinLength - Throws an error for password min length
 * @property {Function} PasswordMaxLength - Throws an error for password max length
 * @property {Function} PasswordHashError - Throws an error for password hash error
 * @property {Function} PasswordVerificationFailed - Throws an error for password verification failed
 * @property {Function} PasswordMismatch - Throws an error for password mismatch
 * @property {Function} PasswordWrong - Throws an error for wrong password
 * @property {Function} PasswordEqualsNewPassword - Throws an error for password equals new password
 * @property {Function} PasswordForEmailUpdateRequired - Throws an error for password for email update required
 * @property {Function} PasswordForEmailUpdateIncorrect - Throws an error for password for email update incorrect
 * 
 * *****************************************************************************
 * Route Errors
 * @property {Function} RouteProtected - Throws an error for protected route
 * 
 * *****************************************************************************
 * Token Errors
 * @property {Function} TokenParamNotFound - Throws an error for token param not found
 * 
 * *****************************************************************************
 * Refresh Token Errors
 * @property {Function} RefreshTokenIdInvalid - Throws an error for refresh token id invalid
 * @property {Function} RefreshTokenRevoked - Throws an error for refresh token revoked
 * @property {Function} RefreshTokenIdRequired - Throws an error for refresh token id required
 * @property {Function} RefreshTokenRecordNotFound - Throws an error for refresh token record not found
 * @property {Function} RefreshTokenCurrentRevoke - Throws an error for refresh token current revoke
 * 
 * *****************************************************************************
 * Client IP Errors
 * @property {Function} ClientIpNotFound - Throws an error for client ip not found
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
ErrorHelper.UserNothingToUpdate             = () => new CustomError(t('UserNothingToUpdate'), 400)

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
ErrorHelper.EmailParamNotFound              = () => new CustomError(t('EmailParamNotFound'), 404)

// Username Errors
ErrorHelper.UsernameRequired                = () => new CustomError(t('UsernameRequired'), 400)
ErrorHelper.UsernameInvalid                 = () => new CustomError(t('UsernameInvalid'), 400)
ErrorHelper.UsernameMinLength               = () => new CustomError(t('UsernameMinLength'), 400)
ErrorHelper.UsernameMaxLength               = () => new CustomError(t('UsernameMaxLength'), 400)
ErrorHelper.UsernameTaken                   = () => new CustomError(t('UsernameTaken'), 400)
ErrorHelper.UsernameParamNotFound           = () => new CustomError(t('UsernameParamNotFound'), 404)

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
ErrorHelper.PasswordNewRequired             = () => new CustomError(t('PasswordNewRequired'), 400)
ErrorHelper.PasswordNewConfirmRequired      = () => new CustomError(t('PasswordNewConfirmRequired'), 400)
ErrorHelper.PasswordInvalid                 = () => new CustomError(t('PasswordInvalid'), 400)
ErrorHelper.PasswordMinLength               = () => new CustomError(t('PasswordMinLength'), 400)
ErrorHelper.PasswordMaxLength               = () => new CustomError(t('PasswordMaxLength'), 400)
ErrorHelper.PasswordHashError               = () => new CustomError(t('PasswordHashError'), 500)
ErrorHelper.PasswordVerificationFailed      = () => new CustomError(t('PasswordVerificationFailed'), 401)
ErrorHelper.PasswordMismatch                = () => new CustomError(t('PasswordMismatch'), 400)
ErrorHelper.PasswordWrong                   = () => new CustomError(t('PasswordWrong'), 401)
ErrorHelper.PasswordEqualsNewPassword       = () => new CustomError(t('PasswordEqualsNewPassword'), 400)
ErrorHelper.PasswordForEmailUpdateRequired  = () => new CustomError(t('PasswordForEmailUpdateRequired'), 400)
ErrorHelper.PasswordForEmailUpdateIncorrect = () => new CustomError(t('PasswordForEmailUpdateIncorrect'), 400)

// Route Errors
ErrorHelper.RouteProtected                  = () => new CustomError(t('RouteProtected'), 401)

// Token Errors
ErrorHelper.TokenParamNotFound              = () => new CustomError(t('TokenParamNotFound'), 404)

// Refresh Token Errors
ErrorHelper.RefreshTokenIdInvalid           = () => new CustomError(t('RefreshTokenIdInvalid'), 400)
ErrorHelper.RefreshTokenRevoked             = () => new CustomError(t('RefreshTokenRevoked'), 400)
ErrorHelper.RefreshTokenIdRequired          = () => new CustomError(t('RefreshTokenIdRequired'), 400)
ErrorHelper.RefreshTokenRecordNotFound      = () => new CustomError(t('RefreshTokenRecordNotFound'), 404)
ErrorHelper.RefreshTokenCurrentRevoke       = () => new CustomError(t('RefreshTokenCurrentRevoke'), 400)

// Client Errors
ErrorHelper.ClientIpNotFound                = () => new CustomError(t('ClientIpNotFound'), 400)

export {
  CustomError,
  ErrorHelper as default,
}