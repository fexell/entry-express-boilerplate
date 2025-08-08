import { Router } from 'express'

import { CsrfProtection } from '../../config/Security.config.js'

const CsrfRouter                            = Router()

CsrfRouter.get('/', (req, res, next) => {
  try {
    res.status(200).json({
      csrfToken: CsrfProtection.generateToken(req),
    })
  } catch (error) {
    next(error)
  }
})

export {
  CsrfRouter as default,
}
