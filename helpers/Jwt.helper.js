import jwt from 'jsonwebtoken'

import app from '../api.js'

const JwtHelper                             = {}

JwtHelper.Options                           = (expiresIn, jwtId) => {
  return {
    issuer                                  : 'EntryBoilerplate',
    algorithm                               : 'RS256',
    ...(expiresIn && { expiresIn: expiresIn }),
    ...(jwtId && { jwtid: jwtId }),
  }
}

JwtHelper.Sign                              = (payload, expiresIn, jwtId) => {
  return jwt.sign(payload, {
    key: app.get('PRIVATE_KEY'),
    passphrase: app.get('JWT_SECRET'),
  }, JwtHelper.Options(expiresIn, jwtId))
}

JwtHelper.SignAccessToken                   = (payload, jwtId) => JwtHelper.Sign({ userId: payload }, '3m', jwtId)
JwtHelper.SignRefreshToken                  = (payload) => JwtHelper.Sign({ userId: payload }, '30d')

JwtHelper.VerifyToken                       = (token, expiresIn, jwtId) => {
  try {
    return jwt.verify(token, app.get('PUBLIC_KEY'), JwtHelper.Options(expiresIn, jwtId))
  } catch (error) {
    throw new Error('Invalid token')
  }
}
JwtHelper.VerifyAccessToken                 = (token, jwtId) => JwtHelper.VerifyToken(token, '3m', jwtId)
JwtHelper.VerifyRefreshToken                = (token) => JwtHelper.VerifyToken(token, '30d')

export {
  JwtHelper as default,
}
