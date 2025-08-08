import crypto from 'crypto'
import mongoose, { Schema } from 'mongoose'
import { t } from 'i18next'

import PasswordHelper from '../helpers/Password.helper.js'
import StringHelper from '../helpers/String.helper.js'

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
          username: {
            $regex: new RegExp(`^${ value }$`, 'i')
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

UserSchema.pre('save', async function(next) {
  if(this.isNew || this.isModified('email'))
    this.email                              = this.email.toLowerCase().trim()

  if(this.isNew || this.isModified('forename'))
    this.forename                           = StringHelper.Capitalize(this.forename.trim())

  if(this.isNew || this.isModified('surname'))
    this.surname                            = StringHelper.Capitalize(this.surname.trim())

  if(this.isNew || this.isModified('password'))
    this.password                           = await PasswordHelper.Hash(this.password)

  next()
})

const UserModel                             = mongoose.model('User', UserSchema)

export {
  UserModel as default,
}
