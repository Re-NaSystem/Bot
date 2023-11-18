import { ApplicationCommandOptionType } from 'discord.js';
import { Command } from '@/lib/classes/Command';
import { useQueue } from 'discord-player';
import { TrackHandler } from '@/lib/handler/class/TrackHandler';

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

    const handler = new TrackHandler(interaction, queue);

    switch (subcommand) {
      case 'play':
        handler.PlayHandler();
        break;
      case 'queue':
        handler.QueueHandler();
        break;
      case 'stop':
        handler.StopHandler();
        break;
      case 'repeat':
        handler.RepeatHandler();
        break;
      case 'skip':
        handler.SkipHandler();
        break;
      case 'shufful':
        handler.ShuffulHandler();
        break;
    }
  },
});
