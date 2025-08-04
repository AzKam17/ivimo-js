
import { NotificationPort, Notification } from '@/core/infrastructure/services/notifications/types';
import { Twilio } from 'twilio';

const client = new Twilio(process.env.TWILIO_SID!, process.env.TWILIO_TOKEN!);

export class SMSNotificationService implements NotificationPort {
  private static instance: SMSNotificationService;

  private constructor() {}

  static getInstance() {
    if (!SMSNotificationService.instance) {
      SMSNotificationService.instance = new SMSNotificationService();
    }
    return SMSNotificationService.instance;
  }

  async send({ to, message }: Notification) {
    await client.messages.create({
      from: '+15412931466',
      to: '+22557351113',
      body: message
    }).then(
      (data) => {
        console.log('result', data)
      }
    ).catch(
      (error)=> {
        console.log('error sms ', error)
      }
    );
  }
}