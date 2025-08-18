import mongoose from 'mongoose'

import Logger from '../config/Logger.config.js'

/**
 * @typedef {Object} ErrorMiddleware
 * @property {Function} ErrorHandler - The main error handler method
 */
const ErrorMiddleware                       = {}

// The main error handler
ErrorMiddleware.ErrorHandler                = (error, req, res, next) => {

  // If the error is a mongoose validation error
  if(error instanceof mongoose.Error.ValidationError)
    return res.status(400).json({ error: { message: Object.values(error.errors)[ 0 ].message, } }) // Handle one error at the time

  // If in development mode, also console log the error to the terminal
  if(process.env.NODE_ENV === 'development')
    console.error(error)

  // Otherwise just process the error like normal
  return res
    .status(error.statusCode ? error.statusCode : 400)
    .json({
      error                                 : {
        message                             : error.message || 'An unexpected error occurred',
      }
    })
}

export {
  ErrorMiddleware as default,
}
