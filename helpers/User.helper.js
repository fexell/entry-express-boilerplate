import mongoose from 'mongoose'

import UserModel from '../models/User.model.js'

import CookiesHelper from './Cookies.helper.js'

const UserHelper                            = {}

// Retrieves the user's record
UserHelper.GetUserById                      = async (req, includePassword = false) => {

  // Get the user's id
  const userIdFromCookie                    = req.userId || CookiesHelper.GetUserIdCookie(req)

  // If the user id cookie couldn't be found or is invalid
  if(!userIdFromCookie || !mongoose.isValidObjectId(userIdFromCookie))
    throw ErrorHelper.UserIdInvalid()

  // Retrieve the user's record
  const findUserById                        = includePassword
    ? await UserModel.findById(userIdFromCookie).select('+password')
    : await UserModel.findById(userIdFromCookie)

  // If the user could not be found
  if(!findUserById)
    throw ErrorHelper.UserNotFound()

  // Return the user
  return findUserById
}

export {
  UserHelper as default,
}
