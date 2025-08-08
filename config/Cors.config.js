import cors from 'cors'

const options                               = {
  credentials                               : true,
  origin                                    : [ 'http://localhost:3000', 'http://localhost:8081' ],
}

const CorsMiddleware                        = cors(options)

export {
  CorsMiddleware as default,
}
