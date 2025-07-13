
import { Twilio } from 'twilio';
import { Notification, NotificationPort } from '../../domain/model';

const client = new Twilio(process.env.TWILIO_SID!, process.env.TWILIO_TOKEN!);

export class SMSAppNotificationAdapter implements NotificationPort {
  supports(channel: string) {
    return channel === 'sms';
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