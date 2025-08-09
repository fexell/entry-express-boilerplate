import { t } from 'i18next'

import UserModel from '../models/User.model.js'

import CookiesHelper from '../helpers/Cookies.helper.js'
import ErrorHelper from '../helpers/Error.helper.js'
import MailerHelper from '../helpers/Mailer.helper.js'

/**
 * @typedef {Object} UserController
 * @property {Function} Get - Retrieves the user's information
 * @property {Function} GetAll - Retrieves all users in the database
 * @property {Function} Create - The controller function responsible for creating a user, based on the user's input
 */
const UserController                        = {}

// Retrieves the user's information
UserController.Get                          = async (req, res, next) => {
  try {
    const userId                            = CookiesHelper.GetUserIdCookie(req)
    const user                              = await UserModel.findById(userId)

    return res.status(200).json({
      user                                  : {
        id                                  : user._id,
        email                               : user.email,
        username                            : user.username,
        forename                            : user.forename,
        surname                             : user.surname,
      },
    })

  } catch(error) {
    return next(error)
  }
}

// Retrieves all users in the database
UserController.GetAll                       = async (req, res, next) => {
  try {
    const users                             = await UserModel.find({})

    return res.status(200).json({
      users                                 : users.map(user => ({
        id                                  : user._id,
        email                               : user.email,
        username                            : user.username,
        forename                            : user.forename,
        surname                             : user.surname,
      })),
    })

  } catch(error) {
    return next(error)
  }
}

// The controller function responsible for creating a user, based on the user's input
UserController.Create                       = async (req, res, next) => {
  try {
    const {
      email,
      username,
      forename,
      surname,
      password,
      confirmPassword,
    }                                       = req.body

    if(password !== confirmPassword)
      throw ErrorHelper.PasswordMismatch()

    const newUser                           = new UserModel({
      email,
      username,
      forename,
      surname,
      password,
    })

    await newUser.save()

    const mail                              = new MailerHelper(
      email,
      'Verify Email',
      `http://localhost:5000/api/auth/email/verify/${ newUser.emailVerificationToken }?email=${ email }`
    )
    
    await mail.Send()

    return res.status(201).json({
      message                               : t('UserCreated'),
      user                                  : {
        id                                  : user._id,
        email                               : user.email,
        username                            : user.username,
        forename                            : user.forename,
        surname                             : user.surname,
      },
    })
      
  } catch(error) {
    return next(error)
  }
}

export {
  UserController as default,
}
