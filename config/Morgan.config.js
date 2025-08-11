import morgan from 'morgan'

import LogModel from '../models/Log.model.js'

import CookiesHelper from '../helpers/Cookies.helper.js'
import IpHelper from '../helpers/Ip.helper.js'

// Morgan
morgan.token('ipAddress', (req) => IpHelper.GetClientIp(req))
morgan.token('userId', (req) => req.userId || CookiesHelper.GetUserIdCookie(req) || 'unknown')
morgan.token('status', (req, res) => res.statusCode)

const MorganMiddleware                      = morgan(':method :url :status :ipAddress :userId :user-agent :response-time', {
  stream                                    : {
    write                                   : async (message) => {
      // Extract status code from the message
      const log                             = message.trim().split(' ')
      const logObject                       = {
        method                              : log[ 0 ],
        url                                 : log[ 1 ],
        status                              : Number(log[ 2 ]),
        ipAddress                           : log[ 3 ],
        userId                              : log[ 4 ],
        userAgent                           : log[ 5 ],
        responseTime                        : log[ 6 ],
      }

      await LogModel.create(logObject)
    },
  },
})

export {
  MorganMiddleware as default,
}
