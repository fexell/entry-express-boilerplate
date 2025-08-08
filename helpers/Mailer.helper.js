

import transporter, { SENDER_EMAIL, REPLY_TO } from '../config/Mailer.config.js'

class MailerHelper {
  constructor(to, subject, message) {
    this.options                            = {
      from                                  : SENDER_EMAIL,
      to                                    : to,
      replyTo                               : REPLY_TO,
      subject                               : subject,
      message                               : message,
    }
  }

  static async Send() {
    return await transporter.sendMail(this.options)
  }
}

export {
  MailerHelper as default
}
