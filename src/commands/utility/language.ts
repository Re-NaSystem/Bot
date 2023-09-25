import { Command } from '../../modules';
import model from '../../models/language';
import { ApplicationCommandOptionType, ChannelType, Colors, EmbedBuilder, GuildMember, PermissionsBitField } from 'discord.js';

export default new Command({
  name: 'language',
  description: 'Change the language of the Bot used on the server.',
  options: [
    {
      name: 'language',
      description: 'Language to be set.',
      type: ApplicationCommandOptionType.String,
      choices: [
        {
          name: '日本語(Japanese)',
          value: 'ja_jp',
        },
        {
          name: 'English(US)',
          value: 'en_us',
        },
      ],
      required: true,
    },
  ],
  run: async ({ client, interaction }) => {
    await interaction.deferReply();

    const member: GuildMember = interaction.guild?.members.cache.get(
      interaction.user.id
    ) as GuildMember;

    if (!member || interaction.channel?.type !== ChannelType.GuildText) {
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(client.i18n.__('error.unexpectederror.title'))
            .setDescription(client.i18n.__('error.unexpectederror.description'))
            .setColor(Colors.Red)
            .setFooter({
              text: client.getUserData().footer,
              iconURL: client.getUserData().icon,
            }),
        ],
      });
    }

    if (!member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(client.i18n.__('error.missingpermissions.title'))
            .setDescription(
              client.i18n.__('error.missingpermissions.manage_guild')
            )
            .setColor(Colors.Red)
            .setFooter({
              text: client.getUserData().footer,
              iconURL: client.getUserData().icon,
            }),
        ],
      });
    }

    const language = interaction.options.getString('language') as
      | 'ja_jp'
      | 'en_us';

    await model.findOneAndDelete({ GuildID: interaction.guild?.id });

    await model.create({
      GuildID: interaction.guild?.id,
      Language: language,
    });

    client.i18n.setLocale(language);

    interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setTitle(client.i18n.__('command.language.title'))
          .setDescription(client.i18n.__('command.language.description'))
          .setColor(Colors.Aqua)
          .setFooter({
            text: client.getUserData().footer,
            iconURL: client.getUserData().icon,
          }),
      ],
    });
  },
});
