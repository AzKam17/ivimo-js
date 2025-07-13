import { Notification } from "../../domain/model/Notification";
import { NotificationPort } from "../../domain/model/NotificationPort";


export class SendNotificationUseCase {
  constructor(private readonly adapters: NotificationPort[]) {}

  async execute(notification: Notification): Promise<void> {
    const adapter = this.adapters.find(a => a.supports(notification.channel));
    if (!adapter) throw new Error(`No adapter for channel ${notification.channel}`);
    await adapter.send(notification);
  }
}