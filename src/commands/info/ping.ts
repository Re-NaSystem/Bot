import { Colors, EmbedBuilder } from 'discord.js';
import { Command } from '@/lib/classes/Command';
import model from '@/lib/models/language';

export default new Command({
  name: 'ping',
  description: 'Measure the response speed of the bot.',
  run: async ({ client, interaction }) => {
    await interaction.deferReply();

    const data = await model.findOne({ GuildID: interaction.guild?.id });
    if (data) client.i18n.setLocale(data.Language as string);

    await interaction.followUp({
      embeds: [
        {
          title: client.i18n.__('command.ping.title'),
          description: client.i18n
            .__('command.ping.description')
            .replace('{ping}', client.ws.ping.toString()),
          color: Colors.Aqua,
          footer: client.footer(),
        },
      ],
    });
  },
});
