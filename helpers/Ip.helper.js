import requestIp from 'request-ip'

import ErrorHelper from './Error.helper.js'

/**
 * @typedef {Object} IpHelper
 * @property {Function} GetClientIp - The method for retrieving the client ip
 */
const IpHelper                              = {}

// Get the client ip
IpHelper.GetClientIp                        = (req) => {

  // Get the client ip
  const clientIp                            = req.headers['x-forwarded-for'] ||
    req.headers['x-real-ip'] ||
    req.socket.remoteAddress ||
    requestIp.getClientIp(req)

  // If the client ip couldn't be found
  if(!clientIp)
    throw ErrorHelper.ClientIpNotFound()

  // Return the client ip
  return clientIp
}

export {
  IpHelper as default,
}
