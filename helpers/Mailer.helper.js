

import transporter, { SENDER_EMAIL, REPLY_TO } from '../config/Mailer.config.js'

/**
 * @class MailerHelper
 * @description Helper class for sending emails
 * @static Send - Sends the email
 * 
 * Example:
 * const mailerHelper = new MailerHelper('no-reply@yourdomain.com', 'abc@def', 'Subject', 'Message')
 * await mailerHelper.Send()
 */
class MailerHelper {

  /**
   * @param {string} to - The email address to send the email to
   * @param {string} subject - The subject of the email
   * @param {string} message - The message of the email
   */
  constructor(from = 'no-reply@yourdomain.com', to, subject, message) {
    this.options                            = {
      from                                  : from,
      to                                    : to,
      replyTo                               : REPLY_TO,
      subject                               : subject,
      message                               : message,
    }
  }

  /**
   * Sends the email
   * @returns {Promise}
   */
  static async Send() {
    return await transporter.sendMail(this.options)
  }
}

export {
  MailerHelper as default
}
