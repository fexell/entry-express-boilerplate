import mongoose, { Schema } from 'mongoose'

/**
 * @typedef {Schema} RefreshTokenSchema
 * @property {String} userId
 * @property {String} token
 * @property {String} ipAddress
 * @property {String} userAgent
 * @property {Boolean} isRevoked
 */
const RefreshTokenSchema                    = new Schema({
  userId                                    : {
    type                                    : Schema.Types.ObjectId,
    required                                : true,
  },
  token                                     : {
    type                                    : String,
    required                                : true,
    select                                  : false,
  },
  ipAddress                                 : {
    type                                    : String,
    required                                : true,
  },
  userAgent                                 : {
    type                                    : String,
    required                                : true,
  },
  isRevoked                                 : {
    type                                    : Boolean,
    required                                : true,
    default                                 : false,
    select                                  : false,
  },
}, {
  timestamps                                : true,
})

RefreshTokenSchema
  .statics
  .SerializeRefreshToken                    = function(token) {
  return {
    _id                                     : token._id,
    userId                                  : token.userId,
    ipAddress                               : token.ipAddress,
    createdAt                               : token.createdAt,
    updatedAt                               : token.updatedAt,
  }
}

// Create the refresh token model
const RefreshTokenModel                     = mongoose.model('RefreshToken', RefreshTokenSchema)

export {
  RefreshTokenModel as default,
}
