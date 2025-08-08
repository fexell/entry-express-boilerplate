

import { NODE_ENV, PORT } from './Environment.config.js'

const ServerConfig                          = {
  port                                      : PORT || 3000,
  trustProxy                                : NODE_ENV === 'production',
  disableXPoweredBy                         : true,
  env                                       : NODE_ENV || 'development',
}

export {
  ServerConfig as default,
}
