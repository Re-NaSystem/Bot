import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, Colors, EmbedBuilder } from 'discord.js';
import { client } from '..';
import { Event } from '../modules/index';

export default new Event('guildCreate', async (guild) => {
  client.user?.setActivity({
    name: `/help | ${client.guilds.cache.size} servers`
  })

  const channel = client.channels.cache.get(process.env.INVITE_LOG_CHANNEL)
  if (!channel || channel?.type !== ChannelType.GuildText) return

  const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`invite-${guild.id}`)
      .setLabel("サーバー招待を出力")
      .setStyle(ButtonStyle.Success)
      .setEmoji("👤"),
    new ButtonBuilder()
      .setCustomId(`serverId-${guild.id}`)
      .setLabel("サーバーIDを出力")
      .setStyle(ButtonStyle.Success)
      .setEmoji("📄")
  )

  const embed = new EmbedBuilder()
    .setTitle("サーバーに追加されました")
    .setFields([
      {
        name: "追加されたBot",
        value: client.user?.tag as string,
      },
      {
        name: "サーバー",
        value: `${guild.name}(${guild.id})`,
      },
    ])
    .setColor(Colors.Aqua)
    .setFooter({
      iconURL: client.getUserData().icon,
      text: client.getUserData().footer,
    })

  await channel
    .send({
      embeds: [embed],
      components: [button],
    })
    .catch((e) => console.log(e))
});
