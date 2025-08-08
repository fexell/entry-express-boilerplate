import requestIp from 'request-ip'

import ErrorHelper from './Error.helper.js'

const IpHelper                              = {}

IpHelper.GetClientIp                        = (req) => {
  const clientIp                            = req.headers['x-forwarded-for'] ||
    req.headers['x-real-ip'] ||
    req.socket.remoteAddress ||
    requestIp.getClientIp(req)

  if(!clientIp)
    throw ErrorHelper.ClientIpNotFound()

  return clientIp
}

export {
  IpHelper as default,
}
