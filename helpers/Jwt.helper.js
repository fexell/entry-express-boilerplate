import jwt from 'jsonwebtoken'

import app from '../api.js'

/**
 * @typedef {Object} JwtHelper
 * @property {Function} Options - The method to set the options for the jwt
 * @property {Function} Sign - A helper function to setting a jwt
 * @property {Function} SignAccessToken - The method for signing the access token
 * @property {Function} SignRefreshToken - The method for signing the refresh token
 * @property {Function} VerifyToken - The method for verifying the jwt
 */
const JwtHelper                             = {}

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
JwtHelper.SignAccessToken                   = (payload, jwtId) => JwtHelper.Sign({ userId: payload }, '3m', jwtId)
JwtHelper.SignRefreshToken                  = (payload) => JwtHelper.Sign({ userId: payload }, '30d')

// Method to verify the jwt
JwtHelper.VerifyToken                       = (token, expiresIn, jwtId) => {
  try {
    return jwt.verify(token, app.get('PUBLIC_KEY'), JwtHelper.Options(expiresIn, jwtId))
  } catch (error) {
    throw new Error('Invalid token')
  }
}

// Methods for verifying the access- and refresh token
JwtHelper.VerifyAccessToken                 = (token, jwtId) => JwtHelper.VerifyToken(token, '3m', jwtId)
JwtHelper.VerifyRefreshToken                = (token) => {
  if(!token)
    return false

  return JwtHelper.VerifyToken(token, '30d')
}

export {
  JwtHelper as default,
}
