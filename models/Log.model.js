import mongoose, { Schema } from 'mongoose'

/**
 * This is the log schema for Morgan logs
 * 
 * @typedef {Schema} LogSchema
 * @property {String} method
 * @property {String} url
 * @property {Number} status
 * @property {String} ipAddress
 * @property {String} userId
 * @property {String} userAgent
 * @property {Number} responseTime
 */
const LogSchema                             = new Schema({
  method                                    : {
    type                                    : String,
    required                                : true,
  },
  url                                       : {
    type                                    : String,
    required                                : true,
  },
  status                                    : {
    type                                    : Number,
    required                                : true,
  },
  ipAddress                                 : {
    type                                    : String,
    required                                : true,
  },
  userId                                    : {
    type                                    : String,
    required                                : false,
    default                                 : null,
  },
  userAgent                                 : {
    type                                    : String,
    required                                : true,
  },
  responseTime                              : {
    type                                    : Number,
    required                                : true,
  }
}, {
  timestamps                                : true,
})

// Create the log model
const LogModel                              = mongoose.model('Log', LogSchema)

export {
  LogModel as default,
}
