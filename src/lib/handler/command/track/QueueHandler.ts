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
        {
          title: client.i18n.__('command.track.error.not_played'),
          color: Colors.Red,
          footer: client.footer(),
        },
      ],
    });
  }

  const sorted_tracks = queue.tracks.data.slice(0, 10);

  await interaction.followUp({
    embeds: [
      {
        title: client.i18n.__('command.track.queue.show'),
        description:
          `**1)** ${queue.currentTrack?.title}\n` +
          sorted_tracks
            .map(
              (track: Track, index: number) =>
                `**${index + 2})** ${track.title as string}`
            )
            .join('\n'),
        color: Colors.Aqua,
        footer: client.footer(),
      },
    ],
  });
};

export default QueueHandler;
