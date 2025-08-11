import mongoose from 'mongoose'

import ErrorHelper from './Error.helper.js'
import TimeHelper from './Time.helper.js'

import app from '../api.js'

// Cookie Names object
const CookieNames                           = {
  UserId                                    : 'userId',
  AccessToken                               : 'accessToken',
  RefreshTokenId                            : 'refreshTokenId',
}

// Normal cookie options
const CookieOptions                         = (maxAge) => {
  return {
    secure                                  : app.get('NODE_ENV') === 'production',
    sameSite                                : 'Strict',
    maxAge                                  : maxAge || TimeHelper.OneDay, // Default to 1 day
    path                                    : '/',
  }
}

// Signed HttpOnly cookie options
const SignedHttpOnlyCookieOptions           = (maxAge) => {
  return {
    httpOnly                                : true,
    secure                                  : app.get('NODE_ENV') === 'production',
    sameSite                                : 'Strict',
    maxAge                                  : maxAge || TimeHelper.OneDay, // Default to 1 day
    signed                                  : true,
    path                                    : '/',
  }
}

/**
 * @typedef {Object} CookiesHelper
 * @property {Function} SetCookie - The method for setting normal cookies
 * @property {Function} SetSignedHttpOnlyCookie - Method for setting a signed http only cookie
 * @property {Function} SetUserIdCookie - The method for setting  the user id cookie
 * @property {Function} GetUserIdCookie - The method for retrieving the user id from its cookie
 * @property {Function} SetAccessTokenCookie - The method for setting the access token cookie
 * @property {Function} GetAccessTokenCookie - The method for retrieving the access token from its cookie
 * @property {Function} SetRefreshTokenIdCookie - The method for setting the refresh token's id and storing it in a cookie
 * @property {Function} GetRefreshTokenIdCookie - The method for retrieving the refresh token's id from its cookie
 * @property {Function} ClearCookie - The method for clearing a cookie
 */
const CookiesHelper                         = {}

// <Set cookies>
CookiesHelper.SetCookie                     = (res, name, value, maxAge) => {
  return res.cookie(name, value, CookieOptions(maxAge))
}

CookiesHelper.SetSignedHttpOnlyCookie       = (res, name, value, maxAge) => {
  return res.cookie(name, value, SignedHttpOnlyCookieOptions(maxAge))
}
// </Set cookies>

// User ID Cookies
// This is set as a normal (unsigned) cookie (also without httpOnly), that the frontend can access
// It expires in one month (30 days)
CookiesHelper.SetUserIdCookie               = (res, userId) => {
  return CookiesHelper.SetCookie(res, CookieNames.UserId, userId, TimeHelper.OneMonth)
}

CookiesHelper.GetUserIdCookie               = (req) => {
  if(req.signedCookies.userId && !mongoose.isValidObjectId(req.signedCookies.userId))
    throw ErrorHelper.UserIdInvalid()

  return req.cookies.userId || null
}

// Access tokens
// The access token cookie is set as a signed, httpOnly cookie
CookiesHelper.SetAccessTokenCookie          = (res, token) => {
  return CookiesHelper.SetSignedHttpOnlyCookie(res, CookieNames.AccessToken, token, TimeHelper.ThreeMinutes)
}

CookiesHelper.GetAccessTokenCookie          = (req) => {
  return req.signedCookies.accessToken || null
}

// Refresh tokens
CookiesHelper.SetRefreshTokenIdCookie       = (res, tokenId) => {
  return CookiesHelper.SetSignedHttpOnlyCookie(res, CookieNames.RefreshTokenId, tokenId, TimeHelper.OneMonth)
}

CookiesHelper.GetRefreshTokenIdCookie       = (req) => {
  if(req.signedCookies.refreshTokenId && !mongoose.isValidObjectId(req.signedCookies.refreshTokenId))
    throw ErrorHelper.RefreshTokenIdInvalid()

  return req.signedCookies.refreshTokenId || null
}

// Clear cookies
CookiesHelper.ClearCookie                   = (res, name, signed = false) => {

  // If the cookie is signed, use the signed cookie options, else use the normal cookie options
  const options                             = signed ? SignedHttpOnlyCookieOptions() : CookieOptions()

  return res.clearCookie(name, options)
}

export {
  CookiesHelper as default,
  CookieNames,
}
