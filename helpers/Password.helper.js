import argon2 from 'argon2'
import { t } from 'i18next'

const PasswordHelper                        = {}

PasswordHelper.Hash                        = async (password) => {
  try {
    return await argon2.hash(password)
  } catch (error) {
    console.error('Error hashing password:', error)

    throw new Error(t('PasswordHashError'))
  }
}

PasswordHelper.Verify                     = async (password, hash) => {
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
