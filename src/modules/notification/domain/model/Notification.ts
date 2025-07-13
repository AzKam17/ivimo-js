import { NotificationChannel } from "../Enums/NotificationChannel";

export interface Notification {
  to: string;
  message: string;
  subject?: string;
  channel: NotificationChannel;
}