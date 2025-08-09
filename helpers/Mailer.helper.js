

import transporter, { SENDER_EMAIL, REPLY_TO } from '../config/Mailer.config.js'

/**
 * @class MailerHelper
 * @description Helper class for sending emails
 * @static Send - Sends the email
 */
class MailerHelper {

  /**
   * @param {string} to - The email address to send the email to
   * @param {string} subject - The subject of the email
   * @param {string} message - The message of the email
   */
  constructor(to, subject, message) {
    this.options                            = {
      from                                  : SENDER_EMAIL,
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
