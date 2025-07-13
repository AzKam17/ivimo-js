import { eventBus } from '../event-bus/EventBus';
import { EmailNotificationAdapter } from '../../infrastructure/email/EmailNotificationAdapter';
import { SendNotificationUseCase } from '../../application/usecases';
import { SMSAppNotificationAdapter, WhatsAppNotificationAdapter } from '../../infrastructure/twilio';

const useCase = new SendNotificationUseCase([
    new EmailNotificationAdapter(),
    new WhatsAppNotificationAdapter(),
    new SMSAppNotificationAdapter(),
]);

eventBus.on('user.registered', async ({ email, name }) => {
    await useCase.execute({
        to: email,
        subject: 'Bienvenue',
        message: `Salut ${name}, bienvenue sur 225immo`,
        channel: 'email'
    });
});

eventBus.on('user.whatsapp.optin', async ({ phone }) => {
    console.log('Event wht')
    await useCase.execute({
        to: phone,
        message: messageTemplates.welcome(phone),
        channel: 'whatsapp'
    });
});

eventBus.on('user.sms.optin', async ({ phone }) => {
    console.log('Event wht')
    await useCase.execute({
        to: phone,
        message: messageTemplates.welcome(phone),
        channel: 'sms'
    });
});

// Templates de messages
const messageTemplates = {
    welcome: (name: string) =>
        `🎉 Bienvenue ${name} !\n\nVotre inscription a été confirmée avec succès. Nous sommes ravis de vous avoir parmi nous !`,

    confirmation: (name: string, email: string) =>
        `✅ Inscription confirmée\n\nBonjour ${name},\n\nVotre compte a été créé avec succès avec l'email: ${email}\n\nMerci de nous avoir rejoint !`
};