import { client } from '@/index';
import { GuildQueue } from 'discord-player';
import { EmbedBuilder, Colors, ChatInputCommandInteraction } from 'discord.js';

const PlayHandler = async (
  interaction: ChatInputCommandInteraction,
  queue: GuildQueue<unknown> | null
) => {
  await client.player.extractors.loadDefault();

  const term = interaction.options.getString('term') as string;
  const member = interaction.guild?.members.cache.get(interaction.user.id);
  const me = interaction.guild?.members.cache.get(client.user?.id as string);

  if (!member?.voice.channelId) {
    return await interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setTitle(client.i18n.__('command.track.play.pls_join_vc.title'))
          .setDescription(
            client.i18n.__('command.track.play.pls_join_vc.description')
          )
          .setColor(Colors.Red)
          .setFooter({
            text: client.getUserData().footer,
            iconURL: client.getUserData().icon,
          }),
      ],
    });
  }

  if (me?.voice.channelId && member.voice.channelId !== me?.voice.channelId) {
    return await interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setTitle(client.i18n.__('command.track.play.pls_join_botvc.title'))
          .setDescription(
            client.i18n.__('command.track.play.pls_join_botvc.description')
          )
          .setColor(Colors.Red)
          .setFooter({
            text: client.getUserData().footer,
            iconURL: client.getUserData().icon,
          }),
      ],
    });
  }

  try {
    if (!queue?.connection) {
      await queue?.connect(member.voice.channel?.id as string);
    }
  } catch {
    queue?.delete();
    return await interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setTitle(client.i18n.__('command.track.play.join_error.title'))
          .setDescription(
            client.i18n.__('command.track.play.join_error.description')
          )
          .setColor(Colors.Red)
          .setFooter({
            text: client.getUserData().footer,
            iconURL: client.getUserData().icon,
          }),
      ],
    });
  }

  const track = await client.player.search(term, {
    requestedBy: interaction.user,
  });

  if (!track) {
    return await interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setTitle(client.i18n.__('command.track.play.track_not_found.title'))
          .setDescription(
            client.i18n.__('command.track.play.track_not_found.description')
          )
          .setColor(Colors.Red)
          .setFooter({
            text: client.getUserData().footer,
            iconURL: client.getUserData().icon,
          }),
      ],
    });
  }

  const entry = queue?.tasksQueue.acquire();

  await entry?.getTask();

  if (track.tracks.length >= 1) {
    track.tracks.forEach((x) => queue?.addTrack(x));
    await interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setTitle(client.i18n.__('command.track.play.add_track.title'))
          .setDescription(
            client.i18n
              .__('command.track.play.add_track.playlist')
              .replace('{count}', track.tracks.length.toString())
          )
          .setColor(Colors.Green)
          .setFooter({
            text: client.getUserData().footer,
            iconURL: client.getUserData().icon,
          }),
      ],
    });
  } else {
    await interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setTitle(client.i18n.__('command.track.play.add_track.title'))
          .setDescription(
            client.i18n
              .__('command.track.play.add_track.description')
              .replace('{track}', track.tracks[0].title)
          )
          .setThumbnail(track.tracks[0].thumbnail)
          .setColor(Colors.Green)
          .setFooter({
            text: client.getUserData().footer,
            iconURL: client.getUserData().icon,
          }),
      ],
    });
  }

  try {
    if (!queue?.isPlaying()) await queue?.node.play();
  } finally {
    queue?.tasksQueue.release();
  }
};

export default PlayHandler;
