
import { NotificationPort, Notification } from '@/core/infrastructure/services/notifications/types';
import { Twilio } from 'twilio';

const client = new Twilio(process.env.TWILIO_SID!, process.env.TWILIO_TOKEN!);

export class WhatsappNotificationService implements NotificationPort {
  private static instance: WhatsappNotificationService;

  private constructor() {}

  static getInstance() {
    if (!WhatsappNotificationService.instance) {
      WhatsappNotificationService.instance = new WhatsappNotificationService();
    }
    return WhatsappNotificationService.instance;
  }

  async send({ to, message }: Notification) {
    await client.messages.create({
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:+22557351113',
      body: message
    }).then(
      (data) => {
        console.log('result', data)
      }
    ).catch(
      (error)=> {
        console.log('error whatsapp ', error)
      }
    );
  }
}