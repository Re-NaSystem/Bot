import { client } from '@/index';
import { GuildQueue, Track } from 'discord-player';
import { ChatInputCommandInteraction, Colors, EmbedBuilder } from 'discord.js';

const QueueHandler = async (
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

  const sorted_tracks = queue.tracks.data.slice(0, 10);

  await interaction.followUp({
    embeds: [
      new EmbedBuilder()
        .setTitle(client.i18n.__('command.track.queue.show'))
        .setDescription(
          `**1)** ${queue.currentTrack?.title}\n` +
            sorted_tracks
              .map(
                (track: Track, index: number) =>
                  `**${index + 2})** ${track.title as string}`
              )
              .join('\n')
        )
        .setColor(Colors.Aqua)
        .setFooter({
          text: client.getUserData().footer,
          iconURL: client.getUserData().icon,
        }),
    ],
  });
};

export default QueueHandler;
