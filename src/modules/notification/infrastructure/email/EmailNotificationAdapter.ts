import nodemailer from 'nodemailer';
import { Notification, NotificationPort } from '../../domain/model';


const transporter = nodemailer.createTransport({ 
    host: process.env.MAIL_HOST, // Ou smtp.sendgrid.net
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER!,
      pass: process.env.MAIL_PASS!
    }
 });

export class EmailNotificationAdapter implements NotificationPort {
  supports(channel: string) {
    return channel === 'email';
  }

  async send({ to, subject, message }: Notification) {
    await transporter.sendMail({
      to,
      from: '"225immo" <no-reply@225immo.ci>',
      subject,
      text: message
    });
  }
}