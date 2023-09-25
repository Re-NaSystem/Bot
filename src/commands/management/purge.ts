import {
  ApplicationCommandOptionType,
  ChannelType,
  Colors,
  EmbedBuilder,
  GuildMember,
  PermissionsBitField,
} from 'discord.js';
import { Command } from '../../modules';
const i18n = require('i18n');
i18n.configure({
  locales: ['ja_jp', 'en_us'],
  defaultLocale: 'ja_jp',
  directory: '../../i18n',
  objectNotation: true,
});

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
    const member: GuildMember = interaction.guild?.members.cache.get(
      interaction.user.id
    ) as GuildMember;

    if (!member || interaction.channel?.type !== ChannelType.GuildText) {
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(await i18n.__('error.unexpectederror.title'))
            .setDescription(await i18n.__('error.unexpectederror.description'))
            .setColor(Colors.Red)
            .setFooter({
              text: client.getUserData().footer,
              iconURL: client.getUserData().icon,
            }),
        ],
      });
    }

    if (!member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(await i18n.__('error.missingpermissions.title'))
            .setDescription(
              await i18n.__('error.missingpermissions.manage_messages')
            )
            .setColor(Colors.Red)
            .setFooter({
              text: client.getUserData().footer,
              iconURL: client.getUserData().icon,
            }),
        ],
      });
    }

    await interaction.channel.bulkDelete(
      interaction.options.getNumber('amount') || 10
    );

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(await i18n.__('command.purge.success.title'))
          .setDescription(
            i18n
              .__('command.purge.success.description')
              .replace(
                '{messages}',
                `${interaction.options.getNumber('amount') || '10'}`
              )
          )
          .setColor(Colors.Green)
          .setFooter({
            text: client.getUserData().footer,
            iconURL: client.getUserData().icon,
          }),
      ],
    });
  },
});
