import mongoose from 'mongoose'

import ErrorHelper from './Error.helper.js'
import TimeHelper from './Time.helper.js'

import app from '../api.js'

const CookieNames                           = {
  UserId                                    : 'userId',
  AccessToken                               : 'accessToken',
  RefreshTokenId                            : 'refreshTokenId',
}

const CookieOptions                         = (maxAge) => {
  return {
    secure                                  : app.get('NODE_ENV') === 'production',
    sameSite                                : 'Strict',
    maxAge                                  : maxAge || TimeHelper.OneDay, // Default to 1 day
    path                                    : '/',
  }
}

const SignedCookieOptions                   = (maxAge) => {
  return {
    httpOnly                                : true,
    secure                                  : app.get('NODE_ENV') === 'production',
    sameSite                                : 'Strict',
    maxAge                                  : maxAge || TimeHelper.OneDay, // Default to 1 day
    signed                                  : true,
    path                                    : '/',
  }
}

const CookiesHelper                         = {}

// <Set cookies>
CookiesHelper.SetCookie                     = (res, name, value, maxAge) => {
  return res.cookie(name, value, CookieOptions(maxAge))
}

CookiesHelper.SetSignedCookie               = (res, name, value, maxAge) => {
  return res.cookie(name, value, SignedCookieOptions(maxAge))
}
// </Set cookies>

// User ID Cookies
CookiesHelper.SetUserIdCookie               = (res, userId) => {
  return CookiesHelper.SetCookie(res, CookieNames.UserId, userId, TimeHelper.OneMonth)
}

CookiesHelper.GetUserIdCookie               = (req) => {
  if(req.signedCookies.userId && !mongoose.isValidObjectId(req.signedCookies.userId))
    throw ErrorHelper.UserIdInvalid()

  return req.cookies.userId || null
}

// Access tokens
CookiesHelper.SetAccessTokenCookie          = (res, token) => {
  return CookiesHelper.SetSignedCookie(res, CookieNames.AccessToken, token, TimeHelper.ThreeMinutes)
}

CookiesHelper.GetAccessTokenCookie          = (req) => {
  return req.signedCookies.accessToken || null
}

// Refresh tokens
CookiesHelper.SetRefreshTokenIdCookie       = (res, tokenId) => {
  return CookiesHelper.SetSignedCookie(res, CookieNames.RefreshTokenId, tokenId, TimeHelper.OneMonth)
}

CookiesHelper.GetRefreshTokenIdCookie       = (req) => {
  if(req.signedCookies.refreshTokenId && !mongoose.isValidObjectId(req.signedCookies.refreshTokenId))
    throw ErrorHelper.RefreshTokenIdInvalid()

  return req.signedCookies.refreshTokenId || null
}

// Clear cookies
CookiesHelper.ClearCookie                   = (res, name, signed = false) => {
  const options                             = signed ? SignedCookieOptions() : CookieOptions()

  return res.clearCookie(name, options)
}

export {
  CookiesHelper as default,
  CookieNames,
}
