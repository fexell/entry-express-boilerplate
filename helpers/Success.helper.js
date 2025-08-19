import { t } from 'i18next'

/**
 * @typedef {Object} SuccessHelper
 * @property {Function} Response - The method for sending a success response.
 */
const SuccessHelper                         = {}

// Response helper
SuccessHelper.Response                      = (res, message = 'Success', data, statusCode = 200, key = 'data') => {

  // Set the success message to be used for logging
  res.locals.message                        = message
  
  return res
    .status(statusCode)
    .json({
      message,
      ...(data && { [ key ]: data }),
  })
}

export {
  SuccessHelper as default,
}
