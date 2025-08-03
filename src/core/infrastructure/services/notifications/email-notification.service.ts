import { Notification, NotificationPort } from "@/core/infrastructure/services/notifications/types";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST, // Ou smtp.sendgrid.net
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER!,
    pass: process.env.MAIL_PASS!,
  },
});

export class EmailNotificationService implements NotificationPort {
  private static instance: EmailNotificationService;

  private constructor() {}

  static getInstance() {
    if (!EmailNotificationService.instance) {
      EmailNotificationService.instance = new EmailNotificationService();
    }
    return EmailNotificationService.instance;
  }

  async send({ to, subject, message }: Notification) {
    await transporter.sendMail({
      to,
      from: '"225immo" <no-reply@225immo.ci>',
      subject,
      text: message,
    });
  }
}
