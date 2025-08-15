import argon2 from 'argon2'
import { t } from 'i18next'

/**
 * @typedef {Object} PasswordHelper
 * @property {Function} Hash - This method is responsible for hashing the password
 * @property {Function} Verify - This method is responsible for verifying the password
 */
const PasswordHelper                        = {}

// The method that hashes the password
PasswordHelper.Hash                         = async (password) => {
  try {
    return await argon2.hash(password)
  } catch (error) {
    console.error('Error hashing password:', error)

    throw new Error(t('PasswordHashError'))
  }
}

// The method for verifying the password
PasswordHelper.Verify                       = async (password, hash) => {
  try {
    return await argon2.verify(hash, password)
  } catch (error) {
    console.error('Error verifying password:', error)

    throw new Error(t('PasswordVerificationFailed'))
  }
}

export {
  PasswordHelper as default,
}
