import { t } from 'i18next'

import UserModel from '../models/User.model.js'

import CookiesHelper from '../helpers/Cookies.helper.js'
import ErrorHelper from '../helpers/Error.helper.js'
import MailerHelper from '../helpers/Mailer.helper.js'
import StringHelper from '../helpers/String.helper.js'
import UserHelper from '../helpers/User.helper.js'

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

    // Retrieve the user
    const user                              = await UserHelper.GetUserById(req)

    // Return the response with the user's information
    return res.status(200).json({
      user                                  : {
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

    const user                              = await UserHelper.GetUserById(req)

    // Update the user's email if it's set and is different from the current email
    if(email && email !== user.email)
      user.email                            = email.toLowerCase().trim()

    // Update the user's username if it's set and is different from the current username
    if(username && username !== user.username)
      user.username                         = username

    // Update the user's forename if it's set and is different from the current forename
    if(forename && forename !== user.forename)
      user.forename                         = StringHelper.Capitalize(forename.trim())

    // Update the user's surname if it's set and is different from the current surname
    if(surname && surname !== user.surname)
      user.surname                          = StringHelper.Capitalize(surname.trim())

    // Save the user
    await user.save()

    // Return the response
    return res.status(200).json({
      message                               : t('UserUpdated'),
      user                                  : {
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
