import { Colors, EmbedBuilder } from 'discord.js';
import { Command } from '../../modules';
import model from '../../models/language';

export default new Command({
  name: 'ping',
  description: 'Measure the response speed of the bot.',
  run: async ({ client, interaction }) => {
    await interaction.deferReply();

    const data = await model.findOne({ GuildID: interaction.guild?.id });
    if (data) client.i18n.setLocale(data.Language as string);

    await interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setTitle(client.i18n.__('command.ping.title'))
          .setDescription(
            client.i18n
              .__('command.ping.description')
              .replace('{ping}', `${Date.now() - interaction.createdTimestamp}`)
          )
          .setColor(Colors.Aqua)
          .setFooter({
            text: client.getUserData().footer,
            iconURL: client.getUserData().icon,
          }),
      ],
    });
  },
});
