export interface Notification {
  to: string;
  message: string;
  subject?: string;
}

export interface NotificationPort {
  send(notification: Notification): Promise<void>;
}

export type NotificationChannel = 'email' | 'whatsapp' | 'sms';
