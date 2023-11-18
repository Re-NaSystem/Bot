import { ApplicationCommandOptionType, Colors } from 'discord.js';
import { Command } from '@/lib/classes/Command';
import model from '@/lib/models/language';
import ButtonCaptchaHandler from '@/lib/handler/command/management/verification/ButtonCaptchaHandler';

export default new Command({
  name: 'verification',
  description: 'Setting verification panel',
  options: [
    {
      name: 'button',
      type: ApplicationCommandOptionType.Subcommand,
      description: 'Send a button captcha panel',
      options: [
        {
          name: 'role',
          description: 'Roles granted upon completion of verification',
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
      ],
    },
    {
      name: 'web',
      type: ApplicationCommandOptionType.Subcommand,
      description: 'Send a web captcha panel',
      options: [
        {
          name: 'role',
          description: 'Roles granted upon completion of verification',
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
      ],
    },
  ],
  run: async ({ client, interaction }) => {
    await interaction.deferReply();

    const data = await model.findOne({ GuildID: interaction.guild?.id });
    if (data) client.i18n.setLocale(data.Language as string);

    const type = interaction.options.getSubcommand();
    const role = interaction.options.getRole('role');

    if (type === 'button') ButtonCaptchaHandler(interaction, role);

    if (type === 'web') {
      await interaction.followUp({
        embeds: [
          {
            title: client.i18n.__('command.verification.web.panel.title'),
            description: client.i18n.__(
              'command.verification.web.panel.description'
            ),
            color: Colors.Aqua,
            footer: {
              text: client.getUserData().footer,
              icon_url: client.getUserData().icon,
            },
          },
        ],
      });
    }
  },
});
