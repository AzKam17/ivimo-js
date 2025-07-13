import { Elysia } from 'elysia';
import '../listeners/NotificationListener';
import { eventBus } from '../event-bus';

export const NotificationController  = new Elysia();

NotificationController.get('/test-notif-email', async () => {
  const { name, email } = {name: 'Mariko', email: 'oudoumariko@gmail.com'};
  await eventBus.emit('user.registered', { name, email });
  return { message: 'Utilisateur enregistré' };
},
    {
      response: {},
      detail: {
        tags: ["Notification"],
        summary: "Test Notif email",
        description: "Test Notification email",
      },
    }
);

NotificationController.get('/test-notif-whatsapp', async () => {
  await eventBus.emit('user.whatsapp.optin', {  phone: '' } );
  return { message: 'Utilisateur' };
},
    {
      response: {},
      detail: {
        tags: ["Notification"],
        summary: "Test Notif whatsapp",
        description: "Test Notification whatsapp",
      },
    }
);

NotificationController.get('/test-notif-sms', async () => {
  await eventBus.emit('user.sms.optin', {  phone: '' } );
  return { message: 'Utilisateur' };
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

