import {
  ApplicationCommandOptionType,
  ChannelType,
  Colors,
  EmbedBuilder,
  GuildMember,
  PermissionsBitField,
} from 'discord.js';
import { Command } from '@/lib/classes/Command';
import model from '@/lib/models/language';

export default new Command({
  name: 'purge',
  description: 'Purge the specified number of messages.',
  options: [
    {
      name: 'amount',
      description: 'Number of messages to delete(Default: 10).',
      maxValue: 100,
      min_value: 1,
      type: ApplicationCommandOptionType.Number,
      required: false,
    },
  ],
  run: async ({ client, interaction }) => {
    const data = await model.findOne({ GuildID: interaction.guild?.id });
    if (data) client.i18n.setLocale(data.Language as string);

    const member: GuildMember = interaction.guild?.members.cache.get(
      interaction.user.id
    ) as GuildMember;

    if (!member || interaction.channel?.type !== ChannelType.GuildText) {
      return await interaction.reply({
        embeds: [
          {
            title: client.i18n.__('error.unexpectederror.title'),
            description: client.i18n.__('error.unexpectederror.description'),
            color: Colors.Red,
            footer: client.footer(),
          },
        ],
      });
    }

    if (!member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return await interaction.reply({
        embeds: [
          {
            title: client.i18n.__('error.missingpermissions.title'),
            description: client.i18n.__(
              'error.missingpermissions.manage_messages'
            ),
            color: Colors.Red,
            footer: client.footer(),
          },
        ],
      });
    }

    await interaction.channel.bulkDelete(
      interaction.options.getNumber('amount') || 10
    );

    await interaction.reply({
      embeds: [
        {
          title: client.i18n.__('command.purge.success.title'),
          description: client.i18n
            .__('command.purge.success.description')
            .replace(
              '{messages}',
              `${interaction.options.getNumber('amount') || '10'}`
            ),
          color: Colors.Green,
          footer: client.footer(),
        },
      ],
    });
  },
});
