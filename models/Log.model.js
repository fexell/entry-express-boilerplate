import mongoose, { Schema } from 'mongoose'

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
  ipAddressOrUserId                         : {
    type                                    : String,
    required                                : true,
  },
  userAgent                                 : {
    type                                    : String,
    required                                : true,
  },
  responseTime                              : {
    type                                    : String,
    required                                : true,
  }
}, {
  timestamps                                : true,
})

const LogModel                              = mongoose.model('Log', LogSchema)

export {
  LogModel as default,
}
