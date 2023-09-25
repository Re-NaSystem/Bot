import { Colors, EmbedBuilder } from 'discord.js';
import { Command } from '../../modules';
import model from '../../models/language';
const i18n = require('i18n');

export default new Command({
  name: 'ping',
  description: 'Measure the response speed of the bot.',
  run: async ({ client, interaction }) => {
    await interaction.deferReply();

    const data = await model.findOne({ GuildID: interaction.guild?.id });
    if (data) i18n.setLocale(data.GuildID as string);

    await interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setTitle(await i18n.__('command.ping.title'))
          .setDescription(
            i18n
              .__('command.ping.description')
              .replace('{ping}', `${client.ws.ping}`)
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
