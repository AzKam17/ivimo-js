import { EmailNotificationService, SMSNotificationService, WhatsappNotificationService } from "@/core/infrastructure/services/notifications";
import { Elysia } from "elysia";

export const NotificationController = new Elysia()
  .get(
    "/test-notif-email",
    async () => {
      const { name, email } = { name: "Mariko", email: "oudoumariko@gmail.com" };

      await EmailNotificationService.getInstance().send({
        to: email,
        subject: "Test Notif email",
        message: "Test Notification email",
      });

      return { message: "Utilisateur enregistré" };
    },
    {
      response: {},
      detail: {
        tags: ["Notification"],
        summary: "Test Notif email",
        description: "Test Notification email",
      },
    }
  )
  .get(
    "/test-notif-whatsapp",
    async () => {
      await WhatsappNotificationService.getInstance().send({
        to: "+22557351113",
        message: "Test Notification whatsapp",
      });

      return { message: "Utilisateur" };
    },
    {
      response: {},
      detail: {
        tags: ["Notification"],
        summary: "Test Notif whatsapp",
        description: "Test Notification whatsapp",
      },
    }
  )
  .get(
    "/test-notif-sms",
    async () => {
      await SMSNotificationService.getInstance().send({
        to: "+22557351113",
        message: "Test Notification sms",
      });
      
      return { message: "Utilisateur" };
    },
    {
      response: {},
      detail: {
        tags: ["Notification"],
        summary: "Test Notif sms",
        description: "Test Notification sms",
      },
    }
  );
