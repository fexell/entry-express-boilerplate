import { t } from 'i18next'

/**
 * @typedef {Object} SuccessHelper
 * @property {Function} Response - The method for sending a success response.
 * @property {Function} UserLoggedIn - The method for sending a user is logged in response.
 * @property {Function} UserLoggedOut - The method for sending a user is logged out response.
 * @property {Function} UserLoggedOutForcefully - The method for sending a user is logged out forcefully response.
 * @property {Function} UserCreated - The method for sending a user is created response.
 * @property {Function} EmailVerified - The method for sending a email is verified response.
 */
const SuccessHelper                         = {}

SuccessHelper.Response                      = (res, message = 'Success', data, statusCode = 200) => {
  return res
    .status(statusCode)
    .json({
      message,
      ...(data ? { data } : {}),
  })
}

SuccessHelper.UserLoggedIn                  = (res, user) => {
  return SuccessHelper.Response(res, t('UserLoggedIn'), {
    id: user._id,
  })
}

SuccessHelper.UserLoggedOut                 = (res) => {
  return SuccessHelper.Response(res, t('UserLoggedOut'), null, 200)
}

SuccessHelper.UserLoggedOutForcefully       = (res) => {
  return SuccessHelper.Response(res, t('UserLoggedOutForcefully'), null, 200)
}

SuccessHelper.UserCreated                   = (res, user) => {
  return SuccessHelper.Response(res, t('UserCreated'), {
    id: user._id,
    email: user.email,
    username: user.username,
    forename: user.forename,
    surname: user.surname,
  }, 201)
}

SuccessHelper.EmailVerified                = (res) => {
  return SuccessHelper.Response(res, t('EmailVerified'), null, 200)
}

export {
  SuccessHelper as default,
}