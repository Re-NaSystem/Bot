import { Event } from '@/lib/classes/Event';
import ButtonCaptchaInteractionHandler from '@/lib/handler/event/ButtonCaptchaInteractionHandler';

export default new Event('interactionCreate', async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId.startsWith('button_verification-'))
      ButtonCaptchaInteractionHandler(interaction);
  }
});
