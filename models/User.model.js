import crypto from 'crypto'
import mongoose, { Schema } from 'mongoose'
import { t } from 'i18next'

import ErrorHelper from '../helpers/Error.helper.js'
import PasswordHelper from '../helpers/Password.helper.js'
import StringHelper from '../helpers/String.helper.js'

/**
 * @typedef {Schema} UserSchema
 * @property {String} email
 * @property {String} username
 * @property {String} forename
 * @property {String} surname
 * @property {String} password
 * @property {Enum} role
 * @property {Boolean} isActive
 * @property {Boolean} isEmailVerified
 * @property {String} emailVerificationToken
 */
const UserSchema                            = new Schema({
  email                                     : {
    type                                    : String,
    lowercase                               : true,
    trim                                    : true,
    unique                                  : true,
    required                                : [
      true,
      t('EmailRequired'),
    ],
    match                                   : [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
      t('EmailEnterValid'),
    ],
  },
  username                                  : {
    type                                    : String,
    minlength                               : [ 3, t('UsernameMinLength') ],
    maxlength                               : [ 20, t('UsernameMaxLength') ],
    lowercase                               : true,
    trim                                    : true,
    unique                                  : true,
    required                                : [
      true,
      t('UsernameRequired'),
    ],
    match                                   : [
      /^[a-zA-Z0-9_]+$/, 
      t('UsernameInvalid'),
    ],
    validate                                : {
      validator                             : async function(value) {
        const existingUser                  = await this.constructor.findOne({
          username                          : {
            $regex                          : new RegExp(`^${ value }$`, 'i')
          }
        })

        if((this.isNew && existingUser))
          throw new Error(t('UsernameTaken'))

        else if((!this.isNew && !new RegExp(`^${ value }$`, 'i').test(this.username)))
          throw new Error(t('UsernameTaken'))

        return true
      }
    },
  },
  forename                                  : {
    type                                    : String,
    minlength                               : [ 3, t('ForenameMinLength') ],
    maxlength                               : [ 50, t('ForenameMaxLength') ],
    required                                : [
      true,
      t('ForenameRequired'),
    ],
    match                                   : [
      /^[a-zA-Z]+$/, 
      t('ForenameInvalid'),
    ],
  },
  surname                                   : {
    type                                    : String,
    minlength                               : [ 3, t('SurnameMinLength') ],
    maxlength                               : [ 50, t('SurnameMaxLength') ],
    required                                : [
      true,
      t('SurnameRequired'),
    ],
    match                                   : [
      /^[a-zA-Z]+$/, 
      t('SurnameInvalid'),
    ],
  },
  password                                  : {
    type                                    : String,
    required                                : [
      true,
      t('PasswordRequired'),
    ],
    minlength                               : [
      8,
      t('PasswordMinLength')
    ],
    maxlength                               : [
      100,
      t('PasswordMaxLength')
    ],
    select                                  : false,
  },
  role                                      : {
    type                                    : String,
    required                                : true,
    enum                                    : [ 'user', 'moderator', 'admin' ],
    default                                 : 'user',
  },
  isActive                                  : {
    type                                    : Boolean,
    required                                : true,
    default                                 : true,
  },
  isEmailVerified                           : {
    type                                    : Boolean,
    required                                : true,
    default                                 : false,
  },
  emailVerificationToken                    : {
    type                                    : String,
    select                                  : false,
    default                                 : crypto.randomBytes(32).toString('hex'),
  },
}, {
  timestamps                                : true,
})

UserSchema.statics.SerializeUser           = function(user) {
  return {
    _id                                     : user._id,
    email                                   : user.email,
    username                                : user.username,
    forename                                : user.forename,
    surname                                 : user.surname,
  }
}

// Handle and format data before record is saved
UserSchema.pre('save', async function(next) {

  // If a new user or email is modified, then lowercase the email
  if(this.isNew || this.isModified('email')) {
    this.email                              = this.email.toLowerCase().trim()

    // Generate a new email verification token if the email is modified
    if(this.isModified('email')) {
      this.isEmailVerified                  = false // Set email to not verified
      this.emailVerificationToken           = crypto.randomBytes(32).toString('hex') // Generate a new token
    }
  }

  // If a new user or username is modified, then capitalize the username
  if(this.isNew || this.isModified('forename'))
    this.forename                           = StringHelper.Capitalize(this.forename.trim())

  // If a new user or username is modified, then capitalize the username
  if(this.isNew || this.isModified('surname'))
    this.surname                            = StringHelper.Capitalize(this.surname.trim())

  // If a new user or password is modified, then hash the password
  if(this.isNew || this.isModified('password'))
    this.password                           = await PasswordHelper.Hash(this.password)

  // If no fields are modified
  if(this.modifiedPaths().length === 0)
    return next(new Error(t('UserNothingToUpdate')))

  next()
})

const UserModel                             = mongoose.model('User', UserSchema)

export {
  UserModel as default,
}
