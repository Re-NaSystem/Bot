import { client } from '@/index';
import { GuildQueue } from 'discord-player';
import { ChatInputCommandInteraction, Colors, EmbedBuilder } from 'discord.js';

const RepeatHandler = async (
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

  const type = interaction.options.getNumber('type');

  if (!type) return;

  queue.setRepeatMode(type);

  const modes = [
    client.i18n.__('command.track.repeat.mode.off'),
    client.i18n.__('command.track.repeat.mode.track'),
    client.i18n.__('command.track.repeat.mode.queue'),
    client.i18n.__('command.track.repeat.mode.autoplay'),
  ];

  await interaction.followUp({
    embeds: [
      {
        title: client.i18n
          .__('command.track.repeat.set')
          .replace('{mode}', modes[type]),
        color: Colors.Aqua,
        footer: client.footer(),
      },
    ],
  });
};

export default RepeatHandler;
