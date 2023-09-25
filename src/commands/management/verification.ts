import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { Command } from '../../modules';

export default new Command({
  name: 'verification',
  description: 'Setting verification panel',
  options: [
    {
      name: 'type',
      description: 'Verification type',
      type: ApplicationCommandOptionType.String,
      choices: [
        {
          name: 'button',
          value: 'button',
        },
      ],
      required: true,
    },
    {
      name: 'role',
      description: 'Roles granted upon completion of verification',
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
  ],
  run: async ({ client, interaction }) => {
    await interaction.deferReply();

    const type = interaction.options.getString('type') as 'button';
    const role = interaction.options.getRole('role');

    switch (type) {
      case 'button':
        interaction.followUp({
          embeds: [
            new EmbedBuilder()
              .setTitle(
                client.i18n.__('command.verification.button.panel.title')
              )
              .setDescription(
                client.i18n.__('command.verification.button.panel.description')
              ),
          ],
        });

        break;
    }
  },
});
