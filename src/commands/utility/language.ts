import { Command } from '../../modules';
import model from '../../models/language';
import { ApplicationCommandOptionType, Colors, EmbedBuilder } from 'discord.js';
const i18n = require("i18n")

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

    const language = interaction.options.getString('language') as
      | 'ja_jp'
      | 'en_us';

    await model.findOneAndDelete({ GuildID: interaction.guild?.id });

    await model.create({
      GuildID: interaction.guild?.id,
      Language: language,
    });

    await i18n.setLocale(language);

    interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setTitle(await i18n.__('command.language.title'))
          .setDescription(await i18n.__('command.language.description'))
          .setColor(Colors.Aqua)
          .setFooter({
            text: client.getUserData().footer,
            iconURL: client.getUserData().icon,
          }),
      ],
    });
  },
});
