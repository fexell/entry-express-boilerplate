import jwt, { decode } from 'jsonwebtoken'

import ErrorHelper from './Error.helper.js'

import app from '../api.js'

import 'dotenv/config'

/**
 * @typedef {Object} JwtHelper
 * @property {Function} Options - The method to set the options for the jwt
 * @property {Function} Sign - A helper function to setting a jwt
 * @property {Function} SignAccessToken - The method for signing the access token
 * @property {Function} SignRefreshToken - The method for signing the refresh token
 * @property {Function} VerifyToken - The method for verifying the jwt
 * @property {Function} ValidateAndDecodeToken - The method for validating and decoding the jwt
 */
const JwtHelper                             = {}

const Expiration                            = {
  ACCESS_TOKEN                              : process.env.JWT_ACCESS_TOKEN_EXPIRATION || '3m',
  REFRESH_TOKEN                             : process.env.JWT_REFRESH_TOKEN_EXPIRATION || '30d',
}

// Options for the jwt
JwtHelper.Options                           = (expiresIn, jwtId) => {
  return {
    issuer                                  : 'EntryBoilerplate',
    algorithm                               : 'RS256',
    ...(expiresIn && { expiresIn: expiresIn }),
    ...(jwtId && { jwtid: jwtId }),
  }
}

// Helper method for setting the jwt
JwtHelper.Sign                              = (payload, expiresIn, jwtId) => {
  return jwt.sign(payload, {
    key: app.get('PRIVATE_KEY'),
    passphrase: app.get('JWT_SECRET'),
  }, JwtHelper.Options(expiresIn, jwtId))
}

// Methods for signing (generating) the access- and refresh token
JwtHelper.SignAccessToken                   = (payload, jwtId) => JwtHelper.Sign({ userId: payload }, Expiration.ACCESS_TOKEN, jwtId)
JwtHelper.SignRefreshToken                  = (payload) => JwtHelper.Sign({ userId: payload }, Expiration.REFRESH_TOKEN)

// Method to verify the jwt
JwtHelper.VerifyToken                       = (token, expiresIn, jwtId) => {
  try {
    return jwt.verify(token, app.get('PUBLIC_KEY'), JwtHelper.Options(expiresIn, jwtId))
  } catch (error) {
    throw new Error('Invalid token')
  }
}

// Methods for verifying the access- and refresh token
JwtHelper.VerifyAccessToken                 = (token, jwtId) => {
  if(!token)
    throw ErrorHelper.RefreshTokenNotFound()

  return JwtHelper.VerifyToken(token, '3m', jwtId)
}

JwtHelper.VerifyRefreshToken                = (token) => {
  if(!token)
    throw ErrorHelper.RefreshTokenNotFound()

  return JwtHelper.VerifyToken(token, '30d')
}

JwtHelper.ValidateAndDecodeToken            = async (token, type) => {
  try {
    const decoded                           = type === 'access'
      ? JwtHelper.VerifyAccessToken(token)
      : JwtHelper.VerifyRefreshToken(token)

    if(!decoded || !decoded.userId)
      return null

    return decoded
  } catch (error) {
    return null
  }
}

export {
  JwtHelper as default,
}
