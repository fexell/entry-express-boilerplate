import mongoose from 'mongoose'

import UserModel from '../models/User.model.js'

import CookiesHelper from './Cookies.helper.js'

const UserHelper                            = {}

UserHelper.GetUserById                      = async (req) => {
  const userIdFromCookie                    = req.userId || CookiesHelper.GetUserIdCookie(req)

  if(!userIdFromCookie || !mongoose.isValidObjectId(userIdFromCookie))
    throw ErrorHelper.UserIdInvalid()

  const findUserById                        = await UserModel.findById(userIdFromCookie)

  if(!findUserById)
    throw ErrorHelper.UserNotFound()

  return findUserById
}

export {
  UserHelper as default,
}
