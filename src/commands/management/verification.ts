import { ApplicationCommandOptionType, Colors, EmbedBuilder } from 'discord.js';
import { Command } from '../../modules';
import model from '../../models/language';

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

    const data = await model.findOne({ GuildID: interaction.guild?.id });
    if (data) client.i18n.setLocale(data.Language as string);

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
