import { t } from 'i18next'

import UserModel from '../models/User.model.js'

import CookiesHelper from '../helpers/Cookies.helper.js'
import ErrorHelper from '../helpers/Error.helper.js'
import MailerHelper from '../helpers/Mailer.helper.js'
import PasswordHelper from '../helpers/Password.helper.js'
import StringHelper from '../helpers/String.helper.js'
import UserHelper from '../helpers/User.helper.js'

/**
 * @typedef {Object} UserController
 * @property {Function} Get - Retrieves the user's information.
 * @property {Function} GetAll - Retrieves all users in the database.
 * @property {Function} GetByUserId - Retrieves a user by their ID.
 * @property {Function} GetByUsername - Retrieves a user by their username.
 * @property {Function} GetByEmail - Retrieves a user by their email.
 * @property {Function} Create - The controller function responsible for creating a user, based on the user's input.
 * @property {Function} Update - The controller function responsible for updating a user, based on the user's input.
 */
const UserController                        = {}

// Retrieves the user's information
UserController.Get                          = async (req, res, next) => {
  try {

    // Retrieve the user
    const user                              = await UserHelper.GetUserById(req, false, true)

    // Return the response with the user's information
    return res.status(200).json({
      user                                  : UserModel.SerializeUser(user),
    })

  } catch(error) {
    return next(error)
  }
}

// Retrieves all users in the database
UserController.GetAll                       = async (req, res, next) => {
  try {

    // Retrieve the order
    const sort                              = req.query.sort

    // Retrieve all users
    const users                             = !sort ? await UserModel.find().lean() : await UserModel.find().sort(sort).lean()

    // Return the response with the users' information
    return res.status(200).json({
      users                                 : users.map(user => UserModel.SerializeUser(user)),
    })

  } catch(error) {
    return next(error)
  }
}

// Retrieves a user by their ID
UserController.GetByUserId                  = async (req, res, next) => {
  try {

    // Retrieve the user id from the parameter
    const userIdFromParams                  = req.params.userId

    // Retrieve the user by their id from the parameter
    const user                              = await UserModel.findById(userIdFromParams).lean()

    // If the user could not be found
    if(!user)
      throw ErrorHelper.UserNotFound()

    // Return the response with the user's information
    return res.status(200).json({
      user                                  : UserModel.SerializeUser(user),
    })

  } catch(error) {
    return next(error)
  }
}

// Retrieves a user by their username
UserController.GetByUsername                = async (req, res, next) => {
  try {

    // Retrieve the username from the parameter
    const usernameFromParams                = req.params.username

    if(!usernameFromParams)
      throw ErrorHelper.UsernameParamNotFound()

    // Retrieve the user by their username from the parameter
    const user                              = await UserModel.findOne({
      username                              : {
        $regex                              : new RegExp(`^${ usernameFromParams }$`, 'i')
      }
    }).lean()

    // If the user could not be found
    if(!user)
      throw ErrorHelper.UserNotFound()

    // Return the response with the user's information
    return res.status(200).json({
      user                                  : UserModel.SerializeUser(user),
    })

  } catch(error) {
    return next(error)
  }
}

// Retrieves a user by their email
UserController.GetByEmail                   = async (req, res, next) => {
  try {

    // Retrieve the email from the parameter
    const emailFromParams                   = req.params.email

    if(!emailFromParams)
      throw ErrorHelper.EmailParamNotFound()

    const user                              = await UserModel.findOne({ email: emailFromParams.toLowerCase() }).lean()

    // If the user could not be found
    if(!user)
      throw ErrorHelper.UserNotFound()

    // Return the response with the user's information
    return res.status(200).json({
      user                                  : UserModel.SerializeUser(user),
    })

  } catch(error) {
    
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
      user                                  : UserModel.SerializeUser(newUser),
    })
      
  } catch(error) {
    return next(error)
  }
}

// The controller function responsible for updating a user, based on the user's input
UserController.Update                       = async (req, res, next) => {
  try {

    // Destructure the request body
    const {
      email,
      username,
      forename,
      surname,
      password,
    }                                       = req.body

    const user                              = await UserHelper.GetUserById(req, true)

    // Update the user's email if it's set and is different from the current email
    if(email && email !== user.email) {
      if(!password)
        throw ErrorHelper.PasswordForEmailUpdateRequired()

      if(!PasswordHelper.Verify(password, user.password))
        throw ErrorHelper.PasswordForEmailUpdateIncorrect()

      user.email                            = email.toLowerCase().trim()
    }

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
      user                                  : UserModel.SerializeUser(user),
    })
    
  } catch(error) {
    return next(error)
  }
}

export {
  UserController as default,
}
