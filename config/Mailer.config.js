import nodemailer from 'nodemailer'

import 'dotenv/config'

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SENDER_EMAIL,
  REPLY_TO,
}                                           = process.env

const transporter                           = nodemailer.createTransport({
  host                                      : SMTP_HOST,
  port                                      : SMTP_PORT,
  secure                                    : false,
  auth                                      : {
    user                                    : SMTP_USER,
    pass                                    : SMTP_PASS,
  }
})

export {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SENDER_EMAIL,
  REPLY_TO,
  transporter as default
}
