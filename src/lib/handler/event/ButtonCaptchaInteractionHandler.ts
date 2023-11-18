import { client } from '@/index';
import { ButtonInteraction, GuildMember } from 'discord.js';

const ButtonCaptchaInteractionHandler = async (
  interaction: ButtonInteraction
) => {
  const member = interaction.guild?.members.cache.get(
    interaction.user.id
  ) as GuildMember;
  const roleId = interaction.customId.split('-')[1];
  const role = interaction.guild?.roles.cache.get(roleId);

  await interaction.deferReply({
    ephemeral: true,
  });

  if (!role) {
    return interaction.followUp({
      content: `不明なエラーが発生しました。Bot管理者(<@!${
        client.getUserData().userId
      }>)にお問い合わせください`,
      ephemeral: true,
    });
  }
  if (member.roles.cache.has(role.id)) {
    return interaction.followUp({
      content: 'すでに認証されています',
      ephemeral: true,
    });
  }
  member.roles
    .add(role.id)
    .catch(() => {
      return interaction.followUp({
        content: `不明なエラーが発生しました。Bot管理者(<@!${
          client.getUserData().userId
        }>)にお問い合わせください`,
        ephemeral: true,
      });
    })
    .then(() => {
      return interaction.followUp({
        content: '認証が完了しました',
        ephemeral: true,
      });
    });
};

export default ButtonCaptchaInteractionHandler;
