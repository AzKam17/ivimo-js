import { Notification } from './Notification';

export interface NotificationPort {
  supports(channel: string): boolean;
  send(notification: Notification): Promise<void>;
}