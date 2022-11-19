import {BindingScope, inject, injectable} from '@loopback/core';
import {LoggingBindings, WinstonLogger} from '@loopback/logging';
const nodemailer = require("nodemailer");

@injectable({scope: BindingScope.TRANSIENT})
export class MailService {

  @inject(LoggingBindings.WINSTON_LOGGER)
  private logger: WinstonLogger;

  private transporter: any;
  private host: string = 'email-smtp.us-east-2.amazonaws.com';
  private port: string = '465';
  private user: string = 'AKIA2SSX6AR5GCVLAI56';
  private pwd: string = 'BPNOCfRpd6hl/+Rwf0Ae9fpciF6vR9NXSduBKnRlTRW6';
  private from: string = 'noreply@doerz.tech';
  private project: string = 'Nectr'

  constructor(/* Add @inject to inject parameters */) {
    this.transporter = nodemailer.createTransport({

      host: this.host,
      port: this.port,
      auth: {
        user: this.user,
        pass: this.pwd
      },
    });
  }

  async sendPlain(to: string, subject: string, message: string) {
    const result = await this.transporter.sendMail({
      from: {
        name: this.project,
        address: this.from
      },
      to: [to],
      subject: subject,
      text: message,
    });
  }

  async sendHTML(to: string, subject: string, html: string) {
    const response = await this.transporter.sendMail({
      from: {
        name: this.project,
        address: this.from
      },
      name: this.project,
      to: to,
      subject: subject,
      html: html,
    });
    return response;
  }

  async sendVerificationCode(to: string, code: string) {
    try {
      const subject = `${this.project} Verification`
      const message = `${code} is your verification code for ${this.project}. If you didn't request this, you can safely ignore this email`
      const result = await this.sendPlain(to, subject, message);
    } catch (error) {
      this.logger.error("SendVerificationCodeError", error);
    }
  }

  sendPasswordResetEmail(to: string, code: string) {
    try {
      const subject = `${this.project} Password Reset`
      const message = `${code} is your password reset code. If you didn't request this, you can safely ignore this email`
      this.sendPlain(to, subject, message);
    } catch (error) {
      this.logger.error("SendPasswordResetEmail", error);
    }
  }
}
