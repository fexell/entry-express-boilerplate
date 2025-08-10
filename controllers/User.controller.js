import { t } from 'i18next'

import UserModel from '../models/User.model.js'

import CookiesHelper from '../helpers/Cookies.helper.js'
import ErrorHelper from '../helpers/Error.helper.js'
import MailerHelper from '../helpers/Mailer.helper.js'

/**
 * @typedef {Object} UserController
 * @property {Function} Get - Retrieves the user's information.
 * @property {Function} GetAll - Retrieves all users in the database.
 * @property {Function} Create - The controller function responsible for creating a user, based on the user's input.
 */
const UserController                        = {}

// Retrieves the user's information
UserController.Get                          = async (req, res, next) => {
  try {

    // Get the user id from the cookie
    const userId                            = CookiesHelper.GetUserIdCookie(req)

    // Retrieve the user's record
    const user                              = await UserModel.findById(userId)

    // Return the response with the user's information
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

    // Retrieve all users
    const users                             = await UserModel.find({})

    // Return the response with the users
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

    // Destructure the request body
    const {
      email,
      username,
      forename,
      surname,
      password,
      confirmPassword,
    }                                       = req.body

    // If password and confirm password do not match
    if(password !== confirmPassword)
      throw ErrorHelper.PasswordMismatch()

    // Create a new user
    const newUser                           = new UserModel({
      email,
      username,
      forename,
      surname,
      password,
    })

    // Save the new user
    await newUser.save()

    /* // Compose the email
    const mail                              = new MailerHelper(
      'no-reply@yourdomain.com',
      email,
      'Verify Email',
      `http://localhost:5000/api/auth/email/verify/${ newUser.emailVerificationToken }?email=${ email }`
    )
    
    // Send the email
    await mail.Send() */

    // Return the response with the new user's information
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

UserController.Edit                         = async (req, res, next) => {
  try {

    // Destructure the request body
    const {
      email,
      username,
      forename,
      surname
    }                                       = req.body

    // Get the user id
    const userId                            = req.userId || CookiesHelper.GetUserIdCookie(req)

    // Retrieve the user
    const user                              = await UserModel.findById(userId)

    // If the user doesn't exist
    if(!user)
      throw ErrorHelper.UserNotFound()

    // Update the user's email if it's set and is different from the current email
    if(email && email !== user.email)
      user.email                            = email

    // Update the user's username if it's set and is different from the current username
    if(username && username !== user.username)
      user.username                         = username

    // Update the user's forename if it's set and is different from the current forename
    if(forename && forename !== user.forename)
      user.forename                         = forename

    // Update the user's surname if it's set and is different from the current surname
    if(surname && surname !== user.surname)
      user.surname                          = surname

    // Save the user
    await user.save()

    // Return the response
    return res.status(200).json({
      message                               : t('UserUpdated'),
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
