import { client } from '@/index';
import { GuildQueue } from 'discord-player';
import { ChatInputCommandInteraction, Colors, EmbedBuilder } from 'discord.js';

const SkipHandler = async (
  interaction: ChatInputCommandInteraction,
  queue: GuildQueue<unknown> | null
) => {
  if (queue?.isEmpty() || !queue) {
    return interaction.followUp({
      embeds: [
        {
          title: client.i18n.__('command.track.error.not_played'),
          color: Colors.Red,
          footer: client.footer(),
        },
      ],
    });
  }

  queue.node.skip();

  await interaction.followUp({
    embeds: [
      {
        title: client.i18n.__('command.track.skip'),
        color: Colors.Aqua,
        footer: client.footer(),
      },
    ],
  });
};

export default SkipHandler;
