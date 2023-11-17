import { ApplicationCommandOptionType, Colors, EmbedBuilder } from 'discord.js';
import { Command } from '@/lib/classes/Command';
import { Track, useQueue } from 'discord-player';

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
    {
      name: 'queue',
      description: 'Displays the songs in the queue',
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: 'stop',
      description: 'Stop playing music',
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: 'repeat',
      description: 'Repeat playback of a song',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'type',
          description: 'Repeat mode',
          type: ApplicationCommandOptionType.Number,
          choices: [
            { name: 'Off', value: 0 },
            { name: 'Track', value: 1 },
            { name: 'Queue', value: 2 },
            { name: 'Autoplay', value: 3 },
          ],
          required: true,
        },
      ],
    },
    {
      name: 'skip',
      description: 'Skip a song',
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: 'shufful',
      description: 'Shuffuling the queue',
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  run: async ({ client, interaction }) => {
    if (!interaction.guild) return;
    await interaction.deferReply();

    const subcommand = interaction.options.getSubcommand();

    client.player.nodes.create(interaction.guild.id, {
      metadata: interaction.channel,
      volume: 10,
    });

    const queue = useQueue(interaction.guild.id);

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

        break;
      case 'queue':
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
        break;
      case 'stop':
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

        queue.delete();

        await interaction.followUp({
          embeds: [
            new EmbedBuilder()
              .setTitle(client.i18n.__('command.track.stop'))
              .setColor(Colors.Aqua)
              .setFooter({
                text: client.getUserData().footer,
                iconURL: client.getUserData().icon,
              }),
          ],
        });
        break;
      case 'repeat':
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
        break;
      case 'skip':
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

        queue.node.skip();

        await interaction.followUp({
          embeds: [
            new EmbedBuilder()
              .setTitle(client.i18n.__('command.track.skip'))
              .setColor(Colors.Aqua)
              .setFooter({
                text: client.getUserData().footer,
                iconURL: client.getUserData().icon,
              }),
          ],
        });
        break;
      case 'shufful':
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

        queue.tracks.shuffle();

        await interaction.followUp({
          embeds: [
            new EmbedBuilder()
              .setTitle(client.i18n.__('command.track.shufful'))
              .setColor(Colors.Aqua)
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
