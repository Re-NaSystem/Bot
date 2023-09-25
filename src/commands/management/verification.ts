import { ApplicationCommandOptionType, Colors, EmbedBuilder } from 'discord.js';
import { Command } from '../../modules';
const i18n = require('i18n');
i18n.configure({
  locales: ['ja_jp', 'en_us'],
  defaultLocale: 'ja_jp',
  directory: '../../i18n',
  objectNotation: true,
});

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
              )
              .setColor(Colors.Aqua)
              .setFooter({
                text: client.getUserData().footer,
                iconURL: client.getUserData().icon,
              }),
          ],
        });

        break;
    }
  },
});
