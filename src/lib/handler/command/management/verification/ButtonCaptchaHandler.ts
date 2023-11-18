import { client } from '@/index';
import {
  APIRole,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  Role,
} from 'discord.js';

const ButtonCaptchaHandler = async (
  interaction: ChatInputCommandInteraction,
  role: Role | APIRole | null
) => {
  return await interaction.followUp({
    embeds: [
      new EmbedBuilder()
        .setTitle(client.i18n.__('command.verification.button.panel.title'))
        .setDescription(
          client.i18n.__('command.verification.button.panel.description')
        )
        .setColor(Colors.Aqua)
        .setFooter({
          text: client.getUserData().footer,
          iconURL: client.getUserData().icon,
        }),
    ],
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId('button_verification-' + role?.id)
          .setEmoji({
            name: '✅',
          })
          .setLabel('クリックして認証')
          .setStyle(ButtonStyle.Success)
      ),
    ],
  });
};

export default ButtonCaptchaHandler;
