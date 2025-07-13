
import { Twilio } from 'twilio';
import { Notification, NotificationPort } from '../../domain/model';

const client = new Twilio(process.env.TWILIO_SID!, process.env.TWILIO_TOKEN!);

export class WhatsAppNotificationAdapter implements NotificationPort {
  supports(channel: string) {
    return channel === 'whatsapp';
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