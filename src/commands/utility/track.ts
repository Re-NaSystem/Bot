import { ApplicationCommandOptionType, Colors, EmbedBuilder } from 'discord.js';
import { Command } from '../../modules';
import { QueryType, useQueue } from 'discord-player';

export default new Command({
  name: 'track',
  description: 'Search and play music from YouTube',
  options: [
    {
      name: 'play',
      description: 'Search and play music from YouTube',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'term',
          description: 'Music name or URL to search',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
  ],
  run: async ({ client, interaction }) => {
    if (!interaction.guild) return;
    await interaction.deferReply();

    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case 'play':
        await client.player.extractors.loadDefault();

        const term = interaction.options.getString('term') as string;
        const member = interaction.guild?.members.cache.get(
          interaction.user.id
        );
        const me = interaction.guild?.members.cache.get(
          client.user?.id as string
        );

        if (!member?.voice.channelId) {
          return await interaction.followUp({
            embeds: [
              new EmbedBuilder()
                .setTitle(
                  client.i18n.__('command.track.play.pls_join_vc.title')
                )
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

        if (
          me?.voice.channelId &&
          member.voice.channelId !== me?.voice.channelId
        ) {
          return await interaction.followUp({
            embeds: [
              new EmbedBuilder()
                .setTitle(
                  client.i18n.__('command.track.play.pls_join_botvc.title')
                )
                .setDescription(
                  client.i18n.__(
                    'command.track.play.pls_join_botvc.description'
                  )
                )
                .setColor(Colors.Red)
                .setFooter({
                  text: client.getUserData().footer,
                  iconURL: client.getUserData().icon,
                }),
            ],
          });
        }

        client.player.nodes.create(interaction.guild.id, {
          metadata: {
            channel: interaction.channel,
          },
          volume: 10
        });

        const queue = useQueue(interaction.guild.id);

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

        const track = await client.player
          .search(term, {
            requestedBy: interaction.user,
            searchEngine: QueryType.YOUTUBE,
          })
          .then((x) => x.tracks[0]);

        if (!track) {
          return await interaction.followUp({
            embeds: [
              new EmbedBuilder()
                .setTitle(
                  client.i18n.__('command.track.play.track_not_found.title')
                )
                .setDescription(
                  client.i18n.__(
                    'command.track.play.track_not_found.description'
                  )
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

        queue?.addTrack(track);

        try {
          if (!queue?.isPlaying()) await queue?.node.play();
        } finally {
          queue?.tasksQueue.release();
        }

        return await interaction.followUp({
          embeds: [
            new EmbedBuilder()
              .setTitle(client.i18n.__('command.track.play.add_track.title'))
              .setDescription(
                client.i18n
                  .__('command.track.play.add_track.description')
                  .replace('{track}', track.title)
              )
              .setThumbnail(track.thumbnail)
              .setColor(Colors.Green)
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
