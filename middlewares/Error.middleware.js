import mongoose from 'mongoose'

const ErrorMiddleware                       = {}

ErrorMiddleware.ErrorHandler                = (error, req, res, next) => {
  if(error instanceof mongoose.Error.ValidationError)
    return res.status(400).json({ error: { message: Object.values(error.errors)[ 0 ].message, } })

  if(process.env.NODE_ENV === 'development')
    console.error(error)

  return res
    .status(error.statusCode ? error.statusCode : 400)
    .json({
      error                                 : {
        message                              : error.message || 'An unexpected error occurred',
      }
    })
}

export {
  ErrorMiddleware as default,
}
