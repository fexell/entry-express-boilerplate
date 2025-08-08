import { t } from 'i18next'

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