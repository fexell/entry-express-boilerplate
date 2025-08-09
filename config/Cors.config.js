import cors from 'cors'

/**
 * @typedef {Object} options
 * @property {boolean} credentials
 * @property {string[]} origin
 */
const options                               = {
  credentials                               : true,
  origin                                    : [ 'http://localhost:3000', 'http://localhost:8081' ],
}

// Cors middleware
const CorsMiddleware                        = cors(options)

export {
  CorsMiddleware as default,
}
