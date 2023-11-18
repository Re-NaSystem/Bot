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
        new EmbedBuilder()
          .setTitle(client.i18n.__('command.track.error.not_played'))
          .setColor(Colors.Red)
          .setFooter({
            text: client.getUserData().footer,
            iconURL: client.getUserData().icon,
          }),
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
      new EmbedBuilder()
        .setTitle(
          client.i18n
            .__('command.track.repeat.set')
            .replace('{mode}', modes[type])
        )
        .setColor(Colors.Aqua)
        .setFooter({
          text: client.getUserData().footer,
          iconURL: client.getUserData().icon,
        }),
    ],
  });
};

export default RepeatHandler;
