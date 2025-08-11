import mongoose from 'mongoose'

import UserModel from '../models/User.model.js'

import CookiesHelper from './Cookies.helper.js'

const UserHelper                            = {}

// Retrieves the user's id
UserHelper.GetUserId                        = (req) => req.userId || CookiesHelper.GetUserIdCookie(req)

// Retrieves the user's refresh token id
UserHelper.GetUserRefreshTokenId            = (req) => req.refreshTokenId || CookiesHelper.GetRefreshTokenIdCookie(req)

// Retrieves the user's record
UserHelper.GetUserById                      = async (req, includePassword = false, lean = false) => {

  // Get the user's id
  const userIdFromCookie                    = req.userId || CookiesHelper.GetUserIdCookie(req)

  // If the user id cookie couldn't be found
  if(!userIdFromCookie)
    throw ErrorHelper.UserIdNotFound()

  // If the user id cookie is invalid
  else if(!mongoose.isValidObjectId(userIdFromCookie))
    throw ErrorHelper.UserIdInvalid()

  // Retrieve the user's record
  const findUserById                        = includePassword
    ? !lean
      ? await UserModel.findById(userIdFromCookie).select('+password')
      : await UserModel.findById(userIdFromCookie).select('+password').lean()
    : !lean
      ? await UserModel.findById(userIdFromCookie)
      : await UserModel.findById(userIdFromCookie).lean()

  // If the user could not be found
  if(!findUserById)
    throw ErrorHelper.UserNotFound()

  // Return the user
  return findUserById
}

export {
  UserHelper as default,
}
